const fs = require('fs');
const path = require('path');

const pages = [
  'handyman-business-growth-systems',
  'roofing-business-growth-systems',
  'screen-enclosure-business-growth-systems',
  'excavation-business-growth-systems',
  'electrician-business-growth-systems',
  'painter-business-growth-systems',
  'contractor-growth-systems',
  'home-service-business-growth-systems',
];

const root = path.join(__dirname, '..');

for (const slug of pages) {
  const html = fs.readFileSync(path.join(root, `${slug}.html`), 'utf8');
  const heroEnd = html.indexOf('</section>');
  const body = html.slice(heroEnd + 12);
  const bodyImgs = [...body.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1].split('?')[0]);
  const counts = {};
  for (const s of bodyImgs) counts[s] = (counts[s] || 0) + 1;
  const dups = Object.entries(counts).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
  console.log(`${slug}: ${dups.length ? dups.map(([s, n]) => `${n}x ${s}`).join(' | ') : 'no body dupes'}`);
}
