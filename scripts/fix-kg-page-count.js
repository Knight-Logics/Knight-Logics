const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'growth-content.js');
let c = fs.readFileSync(file, 'utf8');

const replacements = [
  [/19 pages with Lighthouse 96/gi, '97 indexable pages with Lighthouse 96 performance and 100 SEO'],
  [/19-page handyman growth system/gi, '97-page handyman local SEO architecture'],
  [/19 pages, Lighthouse 96/gi, '97 indexable pages, Lighthouse 96/100/100'],
  [/19-page style architecture/gi, '97-page local SEO architecture'],
  [/19 pages, Lighthouse 96, booking/gi, '97 indexable pages, Lighthouse 96/100/100, booking'],
  [/Knight Group runs 19 pages/gi, 'Knight Group runs 97 indexable pages'],
  [/Knight Group — 19 pages/gi, 'Knight Group — 97 pages'],
  [/Knight Group: 19-page/gi, 'Knight Group: 97-page'],
  [{ value: '19', label: 'Pages — Knight Group' }, { value: '97', label: 'Indexable pages — KG sitemap' }],
  [/Do I need all 19 pages\?/g, 'Do I need 97 pages like Knight Group?'],
  [/Knight Group is the benchmark, not a minimum package/g, 'Knight Group shows what deep local SEO looks like at scale — your page count should match real service coverage, not copy a number'],
  [/VER: '20260626growth3'/g, "VER: '20260626growth4'"]
];

// String replacements
for (const [from, to] of replacements.slice(0, -2)) {
  if (typeof from === 'object' && from instanceof RegExp) c = c.replace(from, to);
}

// Object replacement for stats - manual
c = c.replace("{ value: '19', label: 'Pages — Knight Group' }", "{ value: '97', label: 'Indexable pages — KG sitemap' }");
c = c.replace("VER: '20260626growth3'", "VER: '20260626growth4'");

fs.writeFileSync(file, c, 'utf8');
console.log('Updated growth-content.js with Knight Group 97-page facts');
