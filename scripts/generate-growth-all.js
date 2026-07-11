const fs = require('fs');
const path = require('path');
const { renderServicePage, renderCaseStudy, VER } = require('./growth-page-template');
const { flagshipPages, subPages, caseStudies } = require('./growth-content');
const { enrichPage } = require('./growth-content-enrich');
const { diversifyPageMedia } = require('./growth-page-media');
const { applySeoKeywords } = require('./seo-keywords');

const root = path.join(__dirname, '..');

/** Hand-maintained case studies — do not overwrite with the growth template. */
const HAND_CRAFTED_CASE_STUDIES = new Set([
  'case-study-roof-monsters',
]);

function preparePage(p) {
  return diversifyPageMedia(applySeoKeywords(enrichPage(p)));
}

function writePage(p, render) {
  fs.writeFileSync(path.join(root, `${p.slug}.html`), render(preparePage(p)), 'utf8');
}

for (const p of flagshipPages) writePage(p, renderServicePage);
for (const p of subPages) writePage(p, renderServicePage);
const generatedCaseStudies = caseStudies.filter((c) => !HAND_CRAFTED_CASE_STUDIES.has(c.slug));
const skippedCaseStudies = caseStudies.filter((c) => HAND_CRAFTED_CASE_STUDIES.has(c.slug)).map((c) => c.slug);
for (const c of generatedCaseStudies) writePage(c, renderCaseStudy);

const allSlugs = [...flagshipPages, ...subPages, ...caseStudies].map((x) => x.slug);
console.log(`Generated ${flagshipPages.length} flagship, ${subPages.length} sub, ${generatedCaseStudies.length} case studies (${allSlugs.length} total). VER=${VER}`);
if (skippedCaseStudies.length) {
  console.log(`Skipped hand-crafted case studies: ${skippedCaseStudies.join(', ')}`);
}

module.exports = { VER, allSlugs, flagshipPages, subPages, caseStudies, HAND_CRAFTED_CASE_STUDIES };
