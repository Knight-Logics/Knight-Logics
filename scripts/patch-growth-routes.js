const fs = require('fs');
const path = require('path');
const { VER, allSlugs } = require('./growth-content');

const root = path.join(__dirname, '..');
const existingSlugs = [
  'business-growth-systems','crm-outreach-lead-generation','ticketing-invoicing-job-workflows',
  'referral-network-systems','local-visibility-systems','website-growth-audit','online-ordering-systems',
  'contractor-growth-systems','home-service-business-growth-systems','performance-partner-program'
];
const slugs = [...new Set([...existingSlugs, ...allSlugs])];

const vercelPath = path.join(root, 'vercel.json');
const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

for (const slug of slugs) {
  const redirect = { source: `/${slug}.html`, destination: `/${slug}`, permanent: true };
  const rewrite = { source: `/${slug}`, destination: `/${slug}.html` };
  if (!vercel.redirects.some(r => r.source === redirect.source)) vercel.redirects.push(redirect);
  if (!vercel.rewrites.some(r => r.source === rewrite.source)) vercel.rewrites.push(rewrite);
}

// Canonical audit URL — remove stale .html → /free-website-audit redirect if present
vercel.redirects = vercel.redirects.filter(r => !(r.source === '/free-website-audit.html' && r.destination === '/free-website-audit'));
if (!vercel.redirects.some(r => r.source === '/free-website-audit' && r.destination === '/website-growth-audit')) {
  vercel.redirects.push({ source: '/free-website-audit', destination: '/website-growth-audit', permanent: true });
}
vercel.rewrites = vercel.rewrites.filter(r => r.source !== '/free-website-audit');

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const newUrls = slugs.filter(s => !sitemap.includes(`/${s}</loc>`)).map(slug => `  <url>
    <loc>https://knightlogics.com/${slug}</loc>
    <lastmod>2026-06-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${slug.startsWith('case-study') ? '0.84' : '0.88'}</priority>
  </url>`).join('\n');
if (newUrls) {
  sitemap = sitemap.replace('  <!-- Growth System Pages -->', `  <!-- Growth System Pages -->\n${newUrls}`);
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
}

const bumpVer = VER;
function bumpFile(fp) {
  if (!fs.existsSync(fp)) return false;
  let c = fs.readFileSync(fp, 'utf8');
  const orig = c;
  c = c.replace(/style\.css\?v=[^"'\s>]+/g, `style.css?v=${bumpVer}`);
  c = c.replace(/script\.js\?v=[^"'\s>]+/g, `script.js?v=${bumpVer}`);
  c = c.replace(/\/header\.html\?v=[^"'\s>]+/g, `/header.html?v=${bumpVer}`);
  c = c.replace(/\/footer\.html\?v=[^"'\s>]+/g, `/footer.html?v=${bumpVer}`);
  if (c !== orig) { fs.writeFileSync(fp, c, 'utf8'); return true; }
  return false;
}

let changed = 0;
fs.readdirSync(root).filter(f => f.endsWith('.html')).forEach(f => { if (bumpFile(path.join(root, f))) changed++; });
bumpFile(path.join(root, 'pricing', 'index.html'));
fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n', 'utf8');
console.log('Routes patched. Cache bumped on', changed, 'files. VER=', bumpVer);
