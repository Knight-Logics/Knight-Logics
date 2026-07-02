/**
 * Regenerate sitemap.xml from canonical public routes.
 * Run: node scripts/sync-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { allSlugs } = require('./growth-content');

const root = path.join(__dirname, '..');
const LASTMOD = '2026-07-02';

const CORE = [
  { loc: '', priority: '1.0', changefreq: 'weekly' },
  { loc: 'pricing', priority: '0.92', changefreq: 'monthly' },
  { loc: 'contact', priority: '0.9', changefreq: 'monthly' },
  { loc: 'book-consultation', priority: '0.9', changefreq: 'monthly' },
  { loc: 'website-growth-audit', priority: '0.92', changefreq: 'monthly' },
  { loc: 'nicholas-knight', priority: '0.84', changefreq: 'monthly' },
];

const FLAGSHIP_GROWTH = [
  'business-growth-systems',
  'crm-outreach-lead-generation',
  'ticketing-invoicing-job-workflows',
  'referral-network-systems',
  'local-visibility-systems',
  'online-ordering-systems',
  'contractor-growth-systems',
  'home-service-business-growth-systems',
  'performance-partner-program',
];

const SERVICES = [
  { loc: 'service-websites', priority: '0.95' },
  { loc: 'home-service-websites', priority: '0.9' },
  { loc: 'service-local-seo', priority: '0.9' },
  { loc: 'service-google-business-profile', priority: '0.88' },
  { loc: 'service-ecommerce', priority: '0.85' },
  { loc: 'service-ai-automation', priority: '0.86' },
  { loc: 'service-desktop-apps', priority: '0.75' },
];

const PROOF = [
  'case-studies',
  'automation',
  'referral-program',
  'case-study-knight-logics',
  'case-study-jns',
  'case-study-knight-group',
  'case-study-screen-team',
  'case-study-faith-works',
  'case-study-farrell-electric',
  'case-study-sals-painting',
  'case-study-moms-resin-tables',
  'case-study-evidencedesk-ai',
];

const LOCAL = [
  'web-designer-tampa',
  'web-designer-st-petersburg',
  'web-designer-clearwater',
  'web-designer-safety-harbor',
  'web-designer-palm-harbor',
];

const PRODUCTS = [
  'display-control-plus',
  'videoforge',
  'pixelforge-ai',
  'auto-vid-compiler',
];

const LEGAL = [
  'privacy-policy',
  'terms-of-service',
  'cookie-policy',
  'refund-policy',
  'disclaimer',
];

const DISCOVERY = ['ai.txt', 'llms.txt', 'llms-full.txt'];

function urlEntry(loc, priority, changefreq = 'monthly') {
  const href = loc ? `https://knightlogics.com/${loc}` : 'https://knightlogics.com/';
  return `  <url>
    <loc>${href}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const seen = new Set();
const entries = [];

function add(loc, priority, changefreq) {
  const key = loc || '/';
  if (seen.has(key)) return;
  seen.add(key);
  entries.push(urlEntry(loc, priority, changefreq));
}

CORE.forEach((e) => add(e.loc, e.priority, e.changefreq));
FLAGSHIP_GROWTH.forEach((slug) => add(slug, '0.9'));
SERVICES.forEach((e) => add(e.loc, e.priority));

const growthSub = allSlugs.filter(
  (s) => !FLAGSHIP_GROWTH.includes(s) && !s.startsWith('case-study-')
);
growthSub.forEach((slug) => add(slug, '0.88'));

const growthCases = allSlugs.filter((s) => s.startsWith('case-study-'));
growthCases.forEach((slug) => add(slug, '0.84'));

PROOF.forEach((slug) => add(slug, slug === 'case-studies' ? '0.88' : '0.84'));
LOCAL.forEach((slug) => add(slug, slug.includes('tampa') || slug.includes('clearwater') ? '0.85' : '0.8'));
PRODUCTS.forEach((slug) => add(slug, '0.65'));
LEGAL.forEach((slug) => add(slug, '0.3', 'yearly'));
DISCOVERY.forEach((slug) => add(slug, '0.3'));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Core conversion pages -->
${entries.join('\n')}

</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');
console.log(`Sitemap synced: ${entries.length} URLs, lastmod=${LASTMOD}`);
