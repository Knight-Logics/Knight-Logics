/**
 * Patch meta description + keywords on static HTML pages.
 * Run: node scripts/apply-static-page-seo.js
 */
const fs = require('fs');
const path = require('path');
const STATIC = require('./static-page-seo');

const root = path.join(__dirname, '..');

function upsertMeta(html, name, content) {
  const tag = `<meta name="${name}" content="${content.replace(/"/g, '&quot;')}">`;
  const re = new RegExp(`<meta name="${name}" content="[^"]*">`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<meta name="viewport"[^>]*>/i, (m) => `${m}\n    ${tag}`);
}

let updated = 0;
Object.entries(STATIC).forEach(([rel, seo]) => {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) {
    console.warn('skip missing', rel);
    return;
  }
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;
  if (seo.description) html = upsertMeta(html, 'description', seo.description);
  if (seo.keywords) html = upsertMeta(html, 'keywords', seo.keywords);
  if (html !== orig) {
    fs.writeFileSync(fp, html, 'utf8');
    updated += 1;
    console.log('updated', rel);
  }
});
console.log(`Static SEO applied to ${updated} files.`);
