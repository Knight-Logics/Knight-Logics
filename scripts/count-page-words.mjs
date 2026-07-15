import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const skip = new Set([
  'header.html',
  'footer.html',
  '404.html',
  'admin.html',
  'design-preview.html',
  'referral-dashboard.html',
  'referral-verify.html',
  'pay-invoice.html',
]);

const legal = new Set([
  'privacy-policy.html',
  'terms-of-service.html',
  'cookie-policy.html',
  'refund-policy.html',
  'disclaimer.html',
]);

function stripBoilerplate(html) {
  let h = html;
  h = h.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  h = h.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  h = h.replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');
  h = h.replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
  h = h.replace(/<head[\s\S]*?<\/head>/gi, ' ');
  h = h.replace(/<div[^>]*id=["']header-container["'][^>]*>[\s\S]*?<\/div>/gi, ' ');
  h = h.replace(/<div[^>]*id=["']footer-container["'][^>]*>[\s\S]*?<\/div>/gi, ' ');
  h = h.replace(/<nav[\s\S]*?<\/nav>/gi, ' ');
  h = h.replace(/<header[\s\S]*?<\/header>/gi, ' ');
  h = h.replace(/<footer[\s\S]*?<\/footer>/gi, ' ');
  h = h.replace(/<!--[\s\S]*?-->/g, ' ');
  h = h.replace(/<[^>]+>/g, ' ');
  h = h
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&#?\w+;/g, ' ');
  h = h.replace(/\s+/g, ' ').trim();
  return h;
}

function bucketFor(file, count) {
  if (legal.has(file)) return 'legal';
  if (count < 400) return 'critical';
  if (count < 700) return 'thin';
  if (count < 1000) return 'below-target';
  return 'ok';
}

const files = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.html') && !skip.has(f));

const rows = [];
for (const f of files) {
  const html = fs.readFileSync(path.join(root, f), 'utf8');
  const text = stripBoilerplate(html);
  const words = text.split(/\s+/).filter(Boolean);
  const count = words.length;
  rows.push({
    page: f.replace(/\.html$/, ''),
    file: f,
    words: count,
    bucket: bucketFor(f, count),
    chars: text.length,
  });
}

rows.sort((a, b) => a.words - b.words);

const summary = {
  total: rows.length,
  critical: rows.filter((r) => r.bucket === 'critical').length,
  thin: rows.filter((r) => r.bucket === 'thin').length,
  belowTarget: rows.filter((r) => r.bucket === 'below-target').length,
  ok: rows.filter((r) => r.bucket === 'ok').length,
  legal: rows.filter((r) => r.bucket === 'legal').length,
  median: rows[Math.floor(rows.length / 2)].words,
  mean: Math.round(rows.reduce((s, r) => s + r.words, 0) / rows.length),
};

const out = {
  generatedAt: new Date().toISOString(),
  target: 1000,
  method:
    'Visible text after stripping head/scripts/styles/nav/header/footer containers. Crawl-fallback footer links still included when present in page HTML.',
  summary,
  pages: rows,
};

const outPath = path.join(root, 'data', 'page-word-counts.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);

console.log(JSON.stringify(summary, null, 2));
console.log('\nTHINNEST (non-legal):');
rows
  .filter((r) => r.bucket !== 'legal')
  .slice(0, 30)
  .forEach((r) => console.log(String(r.words).padStart(5), r.bucket.padEnd(12), r.page));
console.log('\nKEY PAGES:');
[
  'index',
  'crm-outreach-lead-generation',
  'case-study-crm-outreach-system',
  'email-agent-automation',
  'business-growth-systems',
  'service-websites',
  'pricing',
  'case-study-screen-team',
  'case-study-faith-works',
  'case-study-knight-group',
  'case-study-roof-monsters',
  'service-local-seo',
  'service-google-business-profile',
].forEach((p) => {
  const r = rows.find((x) => x.page === p);
  if (r) console.log(String(r.words).padStart(5), r.bucket.padEnd(12), r.page);
});
