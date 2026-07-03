#!/usr/bin/env node
/**
 * Cross-device hero visibility regression — catches "plain black hero" on Safari/iOS.
 * Uses Playwright device profiles + WebKit (Safari engine) + reduced-motion checks.
 *
 * Usage:
 *   node scripts/qa-hero-cross-device.js --base=http://127.0.0.1:4183 --strict
 */

const fs = require('fs');
const path = require('path');

function printHelp() {
  console.log(`Hero cross-device QA

Usage:
  node scripts/qa-hero-cross-device.js [options]

Options:
  --base=<url>     Base URL (default: http://127.0.0.1:4183)
  --strict         Exit 1 on any failure
  --headed         Show browser windows
  --help           Show this help
`);
}

function parseArgs(argv) {
  const options = {
    base: 'http://127.0.0.1:4183',
    headless: true,
    strict: false,
    help: false,
  };
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--headed') options.headless = false;
    else if (arg === '--strict') options.strict = true;
    else if (arg.startsWith('--base=')) options.base = arg.slice('--base='.length);
  }
  return options;
}

function slugify(value) {
  return value.replace(/[^a-z0-9-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function timestampSlug() {
  return new Date().toISOString().replace(/[.:]/g, '-');
}

async function sampleTitleLuminance(page) {
  return page.evaluate(() => {
    const title =
      document.querySelector('#hero .company-name') ||
      document.querySelector('#hero .hero-title') ||
      document.querySelector('#hero h1');
    if (!title) return { found: false, luminance: 0 };

    const rect = title.getBoundingClientRect();
    const x = Math.floor(rect.left + rect.width / 2);
    const y = Math.floor(rect.top + rect.height / 2);
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { found: true, luminance: -1, text: (title.textContent || '').trim() };
    }

    // html2canvas not available — use elementFromPoint + computed color fallback
    const s = getComputedStyle(title);
    const fill = s.webkitTextFillColor || s.color || '';
    const nums = fill.match(/[\d.]+/g) || [];
    let luminance = 0;
    if (nums.length >= 3) {
      const [r, g, b] = nums.map(Number);
      luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    return {
      found: true,
      luminance,
      fill,
      text: (title.textContent || '').replace(/\s+/g, ' ').trim(),
      center: { x, y },
      inViewport: rect.top >= 0 && rect.top < window.innerHeight,
    };
  });
}

async function collectHeroMetrics(page) {
  return page.evaluate(() => {
    const clean = (v) => (v || '').replace(/\s+/g, ' ').trim();
    const hero = document.getElementById('hero');
    const enters = hero ? Array.from(hero.querySelectorAll('.hero-enter')) : [];
    const title = hero ? hero.querySelector('.company-name, .hero-title') : null;
    const nav = document.querySelector('.navbar, #header-container nav');
    const form = hero ? hero.querySelector('.hero-form-card, form') : null;

    const opacityOf = (el) => (el ? parseFloat(getComputedStyle(el).opacity) : 0);
    const visible = (el) => {
      if (!el) return false;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };

    const enterOpacities = enters.map((el) => ({
      className: el.className.split(' ').filter((c) => c.startsWith('hero-enter')).join(' ') || 'hero-enter',
      opacity: opacityOf(el),
      visible: visible(el),
    }));

    const avgEnterOpacity = enters.length
      ? enters.reduce((sum, el) => sum + opacityOf(el), 0) / enters.length
      : 0;

    const stars = document.getElementById('klHeroStars');
    const asteroids = document.getElementById('klHeroAsteroids');

    return {
      bodyClasses: document.body.className,
      heroClasses: hero ? hero.className : '',
      heroExperimentActive: hero ? hero.classList.contains('hero-experiment-active') : false,
      viewportWidth: window.innerWidth,
      enterCount: enters.length,
      enterOpacities,
      avgEnterOpacity,
      titleText: clean(title ? title.textContent : ''),
      titleVisible: visible(title),
      titleOpacity: opacityOf(title),
      navVisible: visible(nav),
      formVisible: visible(form),
      h1: clean(document.querySelector('h1')?.textContent || ''),
      scriptVersion: Array.from(document.querySelectorAll('script[src*="script.js"]'))
        .map((s) => s.getAttribute('src') || '')
        .join(','),
      styleVersion: Array.from(document.querySelectorAll('link[href*="style.css"]'))
        .map((l) => l.getAttribute('href') || '')
        .join(','),
      starsCanvasDisplay: stars ? getComputedStyle(stars).display : 'missing',
      asteroidsCanvasDisplay: asteroids ? getComputedStyle(asteroids).display : 'missing',
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      pageErrors: window.__klQaPageErrors || [],
    };
  });
}

function evaluateChecks(metrics, phase, titleSample) {
  const failures = [];
  const warnings = [];

  if (!metrics.heroExperimentActive) {
    warnings.push('hero-experiment-active not set (experiment may be disabled)');
  }
  if (metrics.enterCount === 0) {
    failures.push('No .hero-enter elements found in #hero');
  }

  if (phase === 'immediate') {
    if (!metrics.navVisible) failures.push('Nav not visible on load');
  }

  if (phase === 'after-entrance') {
    if (!metrics.titleVisible) {
      failures.push(`Hero title not visible (opacity ${metrics.titleOpacity.toFixed(2)})`);
    }
    if (!metrics.titleText || !/knight logics/i.test(metrics.titleText)) {
      failures.push(`Hero title text missing or wrong: "${metrics.titleText}"`);
    }
    if (metrics.avgEnterOpacity < 0.5) {
      failures.push(
        `Hero enter elements still too transparent (avg opacity ${metrics.avgEnterOpacity.toFixed(2)})`
      );
    }
    if (titleSample?.found && !titleSample.inViewport) {
      failures.push('Hero title is outside the viewport');
    }
    if (!metrics.navVisible) {
      failures.push('Nav not visible after entrance');
    }
    if (metrics.viewportWidth >= 769 && !metrics.formVisible) {
      failures.push('Hero form card not visible after entrance (desktop)');
    }
  }

  if (metrics.pageErrors.length > 0) {
    failures.push(`${metrics.pageErrors.length} page error(s): ${metrics.pageErrors.slice(0, 2).join(' | ')}`);
  }

  return { failures, warnings };
}

async function runScenario(playwright, scenario, baseUrl, runDir, headless) {
  const browserType = playwright[scenario.browser] || playwright.webkit;
  const browser = await browserType.launch({ headless });

  const contextOptions = {
    ...scenario.context,
    ignoreHTTPSErrors: true,
  };

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(String(err.message || err)));
  await page.addInitScript(() => {
    window.__klQaPageErrors = [];
    window.addEventListener('error', (e) => {
      window.__klQaPageErrors.push(e.message || String(e));
    });
  });

  const url = new URL('/', baseUrl).toString();
  const screenshotBase = `${slugify(scenario.name)}`;
  const results = [];

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(400);
    let metrics = await collectHeroMetrics(page);
    metrics.pageErrors = pageErrors.slice();

    let checks = evaluateChecks(metrics, 'immediate');
    await page.screenshot({
      path: path.join(runDir, `${screenshotBase}-immediate.png`),
      fullPage: false,
    });
    results.push({ phase: 'immediate', metrics, ...checks });

    await page.waitForTimeout(2600);
    metrics = await collectHeroMetrics(page);
    metrics.pageErrors = pageErrors.slice();
    const titleSample = await sampleTitleLuminance(page);
    checks = evaluateChecks(metrics, 'after-entrance', titleSample);
    await page.screenshot({
      path: path.join(runDir, `${screenshotBase}-after-entrance.png`),
      fullPage: false,
    });
    results.push({ phase: 'after-entrance', metrics, ...checks });
  } catch (error) {
    results.push({
      phase: 'navigation',
      failures: [`Navigation failed: ${error.message}`],
      warnings: [],
      metrics: null,
    });
  } finally {
    await context.close();
    await browser.close();
  }

  return {
    name: scenario.name,
    browser: scenario.browser,
    results,
  };
}

function buildScenarios(playwright) {
  const devices = playwright.devices;
  const scenarios = [];

  const deviceNames = [
    'iPhone 13',
    'iPhone SE',
    'iPhone 13 Pro Max',
    'iPad Pro',
    'iPad Mini',
    'Pixel 5',
    'Galaxy S9+',
  ];

  for (const deviceName of deviceNames) {
    const profile = devices[deviceName];
    if (!profile) continue;
    scenarios.push({
      name: deviceName.replace(/\s+/g, '-'),
      browser: 'webkit',
      context: profile,
    });
    scenarios.push({
      name: `${deviceName.replace(/\s+/g, '-')}-chrome`,
      browser: 'chromium',
      context: profile,
    });
  }

  scenarios.push({
    name: 'desktop-webkit-1440',
    browser: 'webkit',
    context: {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      isMobile: false,
      hasTouch: false,
    },
  });

  scenarios.push({
    name: 'desktop-chromium-1920',
    browser: 'chromium',
    context: {
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
  });

  scenarios.push({
    name: 'iphone-13-reduced-motion',
    browser: 'webkit',
    context: {
      ...devices['iPhone 13'],
      reducedMotion: 'reduce',
    },
  });

  scenarios.push({
    name: 'ipad-reduced-motion',
    browser: 'webkit',
    context: {
      ...devices['iPad Pro'],
      reducedMotion: 'reduce',
    },
  });

  return scenarios;
}

function writeReport(runDir, report) {
  const lines = [
    '# Hero Cross-Device QA Report',
    '',
    `- Generated: ${report.generatedAt}`,
    `- Base URL: ${report.baseUrl}`,
    `- Scenarios: ${report.scenarios.length}`,
    `- Failures: ${report.failureCount}`,
    `- Warnings: ${report.warningCount}`,
    '',
    '| Scenario | Phase | Status | Details |',
    '| --- | --- | --- | --- |',
  ];

  for (const scenario of report.scenarios) {
    for (const result of scenario.results) {
      const status = result.failures.length > 0 ? 'FAIL' : result.warnings.length > 0 ? 'WARN' : 'PASS';
      const details =
        result.failures.length > 0
          ? result.failures.join('; ')
          : result.warnings.length > 0
            ? result.warnings.join('; ')
            : `title="${result.metrics?.titleText || ''}" avgOpacity=${result.metrics?.avgEnterOpacity?.toFixed(2) ?? 'n/a'}`;
      lines.push(`| ${scenario.name} | ${result.phase} | ${status} | ${details} |`);
    }
  }

  lines.push('');
  lines.push('## Screenshots');
  lines.push('');
  lines.push('Compare `*-immediate.png` vs `*-after-entrance.png` in this folder for black-screen regressions.');
  lines.push('');

  fs.writeFileSync(path.join(runDir, 'report.md'), `${lines.join('\n')}\n`, 'utf8');
  fs.writeFileSync(path.join(runDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  let playwright;
  try {
    playwright = require('playwright');
  } catch (error) {
    console.error('Playwright not installed. Run: npm install && npx playwright install chromium webkit');
    process.exit(1);
  }

  const runDir = path.join(process.cwd(), '.qa-matrix', 'hero-devices', timestampSlug());
  fs.mkdirSync(runDir, { recursive: true });

  const scenarios = buildScenarios(playwright);
  const scenarioResults = [];

  console.log(`Hero cross-device QA — ${scenarios.length} scenarios against ${options.base}`);
  console.log(`Output: ${runDir}`);

  for (const scenario of scenarios) {
    process.stdout.write(`  • ${scenario.name} (${scenario.browser})... `);
    const result = await runScenario(playwright, scenario, options.base, runDir, options.headless);
    const failures = result.results.flatMap((r) => r.failures);
    const warnings = result.results.flatMap((r) => r.warnings);
    console.log(failures.length > 0 ? `FAIL (${failures.length})` : warnings.length > 0 ? `warn (${warnings.length})` : 'ok');
    scenarioResults.push(result);
  }

  const failureCount = scenarioResults.reduce(
    (n, s) => n + s.results.reduce((m, r) => m + r.failures.length, 0),
    0
  );
  const warningCount = scenarioResults.reduce(
    (n, s) => n + s.results.reduce((m, r) => m + r.warnings.length, 0),
    0
  );

  const report = {
    baseUrl: options.base,
    generatedAt: new Date().toISOString(),
    scenarios: scenarioResults,
    failureCount,
    warningCount,
    outputDir: runDir,
  };

  writeReport(runDir, report);

  console.log('');
  console.log(`Done. Failures: ${failureCount}, Warnings: ${warningCount}`);
  console.log(`Report: ${path.join(runDir, 'report.md')}`);

  if (options.strict && failureCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
