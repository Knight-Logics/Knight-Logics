/**
 * Align inner pages with book-consultation.html hero behavior:
 * - Legacy hero HTML in the page (restored from git where baked)
 * - script.js?v=20260701hero4 in <head> (dynamic svc-hero-stars load)
 * - No pre-baked svc-hero-stars.js tag in HTML
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const VER = '20260701hero4';
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.venv', '_rollback', 'partials',
  'Tic-Tac-Toe', 'Chess-Game-main', 'JavaScript-Tic-Tac-Toe-master',
  'Project-Management-System', 'Invoice-Management-System',
  'Employee-Management-System', 'Ecommerce-Management-System',
  'CRM-Management-System', 'images',
]);
const SKIP_FILES = new Set([
  'index.html',
  'book-consultation.html',
  'header.html',
  'footer.html',
  'admin.html',
  'design-preview.html',
  'projects.html',
  'referral-dashboard.html',
  'referral-verify.html',
]);

const HERO_SECTION_RE = /<section\b[^>]*\b(?:svc-hero|pricing-hero|profile-hero|cs-hero|contact-page-hero|automation-hero|referral-hero|displayplus-hero|videoforge-hero|pixelforge-hero|ed-hero|booking-page-hero)\b[^>]*>[\s\S]*?<\/section>/i;
const ACTIONS_BAR_RE = /<section class="kl-hero-actions-bar">[\s\S]*?<\/section>\s*/i;

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(name)) continue;
      walk(full, files);
    } else if (name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function gitShow(relPath) {
  try {
    return execSync(`git show HEAD:${relPath.replace(/\\/g, '/')}`, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    return null;
  }
}

function extractHero(html) {
  const match = html.match(HERO_SECTION_RE);
  return match ? match[0] : null;
}

function replaceHeroRegion(html, gitHero) {
  let next = html.replace(ACTIONS_BAR_RE, '');
  const heroMatch = next.match(HERO_SECTION_RE);
  if (!heroMatch || !gitHero) return null;
  next = next.replace(HERO_SECTION_RE, gitHero);
  return next;
}

function syncAssets(src) {
  let next = src;
  next = next.replace(/style\.css\?v=[^"'`>\s]+/g, `style.css?v=${VER}`);
  next = next.replace(/\/style\.css\?v=[^"'`>\s]+/g, `/style.css?v=${VER}`);
  next = next.replace(/script\.js\?v=[^"'`>\s]+/g, `script.js?v=${VER}`);
  next = next.replace(/\/script\.js\?v=[^"'`>\s]+/g, `/script.js?v=${VER}`);
  next = next.replace(/\s*<script\b[^>]*svc-hero-stars\.js[^>]*><\/script>\s*/gi, '\n');
  return next;
}

function ensureScriptInHead(html) {
  const scriptRe = /<script\b[^>]*\bscript\.js\?v=[^"'`>\s]+[^>]*><\/script>/i;
  const match = html.match(scriptRe);
  if (!match) return html;

  let next = html.replace(/\s*<script\b[^>]*\bscript\.js\?v=[^"'`>\s]+[^>]*><\/script>\s*/gi, '\n');
  if (next.includes(match[0])) return next;

  const tag = match[0].includes('defer') ? match[0] : match[0].replace('<script', '<script defer');
  next = next.replace(/<\/head>/i, `    ${tag}\n</head>`);
  return next;
}

function ensureHeaderContainer(html) {
  if (html.includes('id="header-container"')) return html;
  if (!html.includes('<body')) return html;
  return html.replace(/<body([^>]*)>/i, '<body$1>\n    <div id="header-container"></div>');
}

let heroRestored = 0;
let assetSynced = 0;
let headerFixed = 0;

for (const file of walk(ROOT)) {
  const base = path.basename(file);
  if (SKIP_FILES.has(base)) continue;

  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  let src = fs.readFileSync(file, 'utf8');
  const original = src;

  if (src.includes('svc-hero--stars') || src.includes('kl-hero-actions-bar')) {
    const gitHtml = gitShow(rel);
    const gitHero = gitHtml ? extractHero(gitHtml) : null;
    if (gitHero && !gitHero.includes('svc-hero--stars')) {
      const replaced = replaceHeroRegion(src, gitHero);
      if (replaced) {
        src = replaced;
        heroRestored += 1;
        console.log('hero restored:', rel);
      }
    }
  }

  src = syncAssets(src);
  src = ensureScriptInHead(src);
  const withHeader = ensureHeaderContainer(src);
  if (withHeader !== src) {
    headerFixed += 1;
    console.log('header container added:', rel);
  }
  src = withHeader;

  if (src !== original) {
    fs.writeFileSync(file, src, 'utf8');
    assetSynced += 1;
  }
}

if (require.main === module) {
  console.log(`Hero regions restored from git: ${heroRestored}`);
  console.log(`Header containers added: ${headerFixed}`);
  console.log(`HTML files updated: ${assetSynced} (assets v=${VER})`);
}
