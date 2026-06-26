const fs = require('fs');
const path = require('path');
const { renderServicePage, renderCaseStudy, VER } = require('./growth-page-template');
const { flagshipPages, subPages, caseStudies } = require('./growth-content');
const { enrichPage } = require('./growth-content-enrich');

const root = path.join(__dirname, '..');

function writePage(p, render) {
  fs.writeFileSync(path.join(root, `${p.slug}.html`), render(enrichPage(p)), 'utf8');
}

for (const p of flagshipPages) writePage(p, renderServicePage);
for (const p of subPages) writePage(p, renderServicePage);
for (const c of caseStudies) writePage(c, renderCaseStudy);

const allSlugs = [...flagshipPages, ...subPages, ...caseStudies].map((x) => x.slug);
console.log(`Generated ${flagshipPages.length} flagship, ${subPages.length} sub, ${caseStudies.length} case studies (${allSlugs.length} total). VER=${VER}`);

module.exports = { VER, allSlugs, flagshipPages, subPages, caseStudies };
