/**
 * Pre-deploy SEO audit for knightlogics.com MainSite.
 * Run: node scripts/audit-seo-deploy.js
 */
const fs = require('fs');
const path = require('path');
const { allSlugs } = require('./growth-content');

const root = path.join(__dirname, '..');
const issues = [];
const ok = [];

function read(fp) {
  return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '';
}

function check(name, pass, detail) {
  (pass ? ok : issues).push({ name, detail });
}

// Sitemap
const sm = read(path.join(root, 'sitemap.xml'));
const smUrls = [...sm.matchAll(/<loc>https:\/\/knightlogics\.com\/([^<]*)<\/loc>/g)].map((m) => m[1].replace(/\/$/, ''));
check('Sitemap exists', sm.includes('<urlset'), `${smUrls.length} URLs`);
check('No legacy free-website-audit URL', !sm.includes('free-website-audit'), 'redirect target is website-growth-audit');
check('Electrician in sitemap', sm.includes('electrician-business-growth-systems'), '');
check('Painter in sitemap', sm.includes('painter-business-growth-systems'), '');

// Robots
const robotsTxt = read(path.join(root, 'robots.txt'));
check('robots.txt references sitemap', robotsTxt.includes('Sitemap: https://knightlogics.com/sitemap.xml'), '');
check('robots blocks admin', robotsTxt.includes('Disallow: /admin'), '');

// Discovery files
['llms.txt', 'ai.txt', 'llms-full.txt'].forEach((f) => {
  check(`${f} present`, fs.existsSync(path.join(root, f)), '');
});

// Growth pages — schema + canonical
const tier1 = [
  'business-growth-systems',
  'contractor-growth-systems',
  'service-websites',
  'website-growth-audit',
  'handyman-business-growth-systems',
  'electrician-business-growth-systems',
];

tier1.forEach((slug) => {
  const fp = path.join(root, `${slug}.html`);
  const html = read(fp);
  if (!html) {
    check(`${slug} html exists`, false, 'missing file');
    return;
  }
  check(`${slug} canonical`, html.includes(`<link rel="canonical" href="https://knightlogics.com/${slug}"`), '');
  if (allSlugs.includes(slug)) {
    check(`${slug} Service schema`, html.includes('"@type":"Service"') || html.includes('"@type": "Service"'), '');
    check(`${slug} BreadcrumbList`, html.includes('BreadcrumbList'), '');
    check(`${slug} FAQ schema`, html.includes('FAQPage'), '');
    check(`${slug} keywords meta`, html.includes('name="keywords"'), '');
  }
});

// Static tier-1 pages
const staticTier1 = ['index.html', 'service-websites.html', 'pricing/index.html', 'contact.html', 'book-consultation.html'];
staticTier1.forEach((rel) => {
  const html = read(path.join(root, rel));
  check(`${rel} has meta description`, /<meta name="description"/.test(html), '');
  check(`${rel} has keywords meta`, /<meta name="keywords"/.test(html), '');
  check(`${rel} has ld+json`, html.includes('application/ld+json'), '');
});

// vercel routes for new slugs
const vercel = JSON.parse(read(path.join(root, 'vercel.json')) || '{}');
['electrician-business-growth-systems', 'painter-business-growth-systems'].forEach((slug) => {
  const hasRewrite = (vercel.rewrites || []).some((r) => r.source === `/${slug}`);
  check(`vercel rewrite /${slug}`, hasRewrite, '');
});

console.log('\n=== SEO Deploy Audit ===\n');
console.log(`PASS (${ok.length}):`);
ok.forEach((r) => console.log(`  ✓ ${r.name}${r.detail ? ` — ${r.detail}` : ''}`));
if (issues.length) {
  console.log(`\nFAIL (${issues.length}):`);
  issues.forEach((r) => console.log(`  ✗ ${r.name}${r.detail ? ` — ${r.detail}` : ''}`));
  process.exitCode = 1;
} else {
  console.log('\nAll checks passed — ready for deploy after visual QA.');
}
