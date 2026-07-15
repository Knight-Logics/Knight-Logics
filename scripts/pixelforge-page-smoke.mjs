import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const target = process.argv[2] || 'http://127.0.0.1:8765/pixelforge-ai.html';
const outputDir = path.resolve('website-audit', '2026-07-15');
await fs.mkdir(outputDir, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const pageErrors = [];
    const localRequestFailures = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      if (request.url().startsWith('http://127.0.0.1:8765/')) {
        localRequestFailures.push(`${request.url()}: ${request.failure()?.errorText || 'failed'}`);
      }
    });

    const response = await page.goto(target, { waitUntil: 'networkidle', timeout: 45_000 });
    const checks = await page.evaluate(() => {
      const download = document.querySelector('a[href*="releases/latest/download/PixelForge-AI.exe"]');
      const release = document.querySelector('a[href*="releases/tag/v1.0.18"]');
      const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((node) => {
          try { return JSON.parse(node.textContent || '{}'); } catch { return null; }
        })
        .filter(Boolean);
      const software = schemas
        .map((item) => item.mainEntity || item)
        .find((item) => item['@type'] === 'SoftwareSourceCode');
      return {
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim() || '',
        visibleVersion: document.querySelector('.pixelforge-shell-version')?.textContent?.trim() || '',
        hasTrialCopy: document.body.innerText.includes('New devices receive a server-backed trial'),
        hasNeutralDefaultCopy: document.body.innerText.includes('benchmarked neutral 2x default'),
        downloadHref: download?.href || '',
        releaseHref: release?.href || '',
        schemaVersion: software?.version || '',
        schemaModified: software?.dateModified || '',
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        rootDiagnostics: {
          viewportWidth: window.innerWidth,
          htmlClientWidth: document.documentElement.clientWidth,
          htmlScrollWidth: document.documentElement.scrollWidth,
          bodyClientWidth: document.body.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
          bodyRectWidth: Math.round(document.body.getBoundingClientRect().width),
          bodyBefore: {
            content: getComputedStyle(document.body, '::before').content,
            width: getComputedStyle(document.body, '::before').width,
            left: getComputedStyle(document.body, '::before').left,
            right: getComputedStyle(document.body, '::before').right,
            position: getComputedStyle(document.body, '::before').position,
          },
          bodyAfter: {
            content: getComputedStyle(document.body, '::after').content,
            width: getComputedStyle(document.body, '::after').width,
            left: getComputedStyle(document.body, '::after').left,
            right: getComputedStyle(document.body, '::after').right,
            position: getComputedStyle(document.body, '::after').position,
          },
        },
        overflowOffenders: [...document.querySelectorAll('body *')]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              tag: element.tagName.toLowerCase(),
              id: element.id || '',
              className: typeof element.className === 'string' ? element.className : '',
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
            };
          })
          .filter((item) => item.left < -1 || item.right > window.innerWidth + 1)
          .slice(0, 12),
        oversizedLayoutBoxes: [...document.querySelectorAll('body *')]
          .map((element) => ({
            tag: element.tagName.toLowerCase(),
            id: element.id || '',
            className: typeof element.className === 'string' ? element.className : '',
            offsetWidth: element.offsetWidth,
            scrollWidth: element.scrollWidth,
            cssWidth: getComputedStyle(element).width,
            transform: getComputedStyle(element).transform,
            position: getComputedStyle(element).position,
          }))
          .filter((item) => item.offsetWidth > window.innerWidth + 1 || item.scrollWidth > window.innerWidth + 1)
          .slice(0, 12),
      };
    });
    const screenshot = path.join(outputDir, `pixelforge-v1018-${viewport.name}-viewport.png`);
    const fullPageScreenshot = path.join(outputDir, `pixelforge-v1018-${viewport.name}-full.png`);
    await page.screenshot({ path: screenshot, fullPage: false });
    await page.screenshot({ path: fullPageScreenshot, fullPage: true });
    const passed = Boolean(
      response?.ok()
      && checks.h1 === 'PixelForge AI'
      && checks.visibleVersion === 'v1.0.18'
      && checks.hasTrialCopy
      && checks.hasNeutralDefaultCopy
      && checks.downloadHref.endsWith('/releases/latest/download/PixelForge-AI.exe')
      && checks.releaseHref.endsWith('/releases/tag/v1.0.18')
      && checks.schemaVersion === '1.0.18'
      && checks.schemaModified === '2026-07-15'
      && checks.horizontalOverflow <= 1
      && pageErrors.length === 0
      && localRequestFailures.length === 0
    );
    results.push({
      viewport: viewport.name,
      status: response?.status() || 0,
      passed,
      ...checks,
      pageErrors,
      localRequestFailures,
      screenshot,
      fullPageScreenshot,
    });
    await page.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ target, passed: results.every((item) => item.passed), results }, null, 2));
if (!results.every((item) => item.passed)) process.exitCode = 1;
