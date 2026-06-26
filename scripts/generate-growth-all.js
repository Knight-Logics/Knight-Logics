const fs = require('fs');
const path = require('path');
const { renderServicePage, renderCaseStudy, VER } = require('./growth-page-template');
const { flagshipPages, subPages, caseStudies } = require('./growth-content');

const root = path.join(__dirname, '..');

for (const p of flagshipPages) {
  fs.writeFileSync(path.join(root, `${p.slug}.html`), renderServicePage(p), 'utf8');
}
for (const p of subPages) {
  fs.writeFileSync(path.join(root, `${p.slug}.html`), renderServicePage(p), 'utf8');
}
for (const c of caseStudies) {
  fs.writeFileSync(path.join(root, `${c.slug}.html`), renderCaseStudy(c), 'utf8');
}

const allSlugs = [...flagshipPages, ...subPages, ...caseStudies].map((x) => x.slug);
console.log(`Generated ${flagshipPages.length} flagship, ${subPages.length} sub, ${caseStudies.length} case studies (${allSlugs.length} total). VER=${VER}`);

module.exports = { VER, allSlugs, flagshipPages, subPages, caseStudies };
