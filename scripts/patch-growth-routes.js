const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const slugs = [
  'business-growth-systems',
  'crm-outreach-lead-generation',
  'ticketing-invoicing-job-workflows',
  'referral-network-systems',
  'local-visibility-systems',
  'website-growth-audit',
  'online-ordering-systems',
  'contractor-growth-systems',
  'home-service-business-growth-systems',
  'performance-partner-program'
];

const vercelPath = path.join(root, 'vercel.json');
const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

for (const slug of slugs) {
  const redirect = {
    source: `/${slug}.html`,
    destination: `/${slug}`,
    permanent: true
  };
  const rewrite = {
    source: `/${slug}`,
    destination: `/${slug}.html`
  };
  if (!vercel.redirects.some(r => r.source === redirect.source)) {
    vercel.redirects.push(redirect);
  }
  if (!vercel.rewrites.some(r => r.source === rewrite.source)) {
    vercel.rewrites.push(rewrite);
  }
}

// Alias growth audit landing; keep legacy audit form URL
if (!vercel.redirects.some(r => r.source === '/website-growth-audit.html')) {
  vercel.redirects.push({
    source: '/website-growth-audit.html',
    destination: '/website-growth-audit',
    permanent: true
  });
}

fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n', 'utf8');
console.log('Updated vercel.json with', slugs.length, 'routes');

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
const block = slugs.map(slug => `  <url>
    <loc>https://knightlogics.com/${slug}</loc>
    <lastmod>2026-06-26</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

if (!sitemap.includes('business-growth-systems')) {
  sitemap = sitemap.replace(
    '  <!-- Service Pages -->',
    `  <!-- Growth System Pages -->\n${block}\n\n  <!-- Service Pages -->`
  );
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log('Updated sitemap.xml');
}

const VER = '20260626growth1';
const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));
let changed = 0;
for (const file of files) {
  const fp = path.join(root, file);
  let c = fs.readFileSync(fp, 'utf8');
  const orig = c;
  c = c.replace(/style\.css\?v=[^"'\s>]+/g, `style.css?v=${VER}`);
  c = c.replace(/script\.js\?v=[^"'\s>]+/g, `script.js?v=${VER}`);
  c = c.replace(/\/header\.html\?v=[^"'\s>]+/g, `/header.html?v=${VER}`);
  c = c.replace(/\/footer\.html\?v=[^"'\s>]+/g, `/footer.html?v=${VER}`);
  if (c !== orig) {
    fs.writeFileSync(fp, c, 'utf8');
    changed++;
  }
}

// pricing/index.html
const pricingIndex = path.join(root, 'pricing', 'index.html');
if (fs.existsSync(pricingIndex)) {
  let c = fs.readFileSync(pricingIndex, 'utf8');
  const orig = c;
  c = c.replace(/style\.css\?v=[^"'\s>]+/g, `style.css?v=${VER}`);
  c = c.replace(/script\.js\?v=[^"'\s>]+/g, `script.js?v=${VER}`);
  if (c !== orig) fs.writeFileSync(pricingIndex, c, 'utf8');
}

console.log('Bumped cache on', changed, 'html files');
