/** Verified from https://www.knightgroup.com/sitemap.xml (2026-06-26) */
const KG = {
  pageCount: 97,
  sitemapUrl: 'https://www.knightgroup.com/sitemap.xml',
  liveUrl: 'https://www.knightgroup.com/',
  lighthouse: { performance: 96, accessibility: 100, seo: 100 },
  breakdown: {
    servicePages: 36,
    cityPages: 30,
    galleryPages: 8,
    policyPages: 4,
    corePages: 9,
    taskLandingPages: 10
  },
  summary: '97 indexable URLs — 36 handyman service silos, 30+ Pinellas/Pasco/Hillsborough city pages, 8 project galleries, booking/pricing surfaces, and task-specific repair landing pages.',
  shortProof: '97-page local SEO architecture with Lighthouse 96 performance, 100 SEO, booking flow, and live kg outreach lane in OutreachEngine.',
  outreachNote: 'Knight Group runs as the kg brand lane in OutreachEngine — separate templates, caps, and sender identity from Knight Logics and Screen Team.',
  geography: 'Safety Harbor hub with coverage across Pinellas, Hillsborough, and Pasco counties.',
  schema: 'LocalBusiness, FAQ, BreadcrumbList, Organization, and Review snippets validated in Rich Results.',
  bookingPath: '/booking — estimate-first conversion surface aligned to Google sitelinks and GBP actions.'
};

const KG_STATS = [
  { value: '97', label: 'Indexable pages (KG sitemap)' },
  { value: '96', label: 'Lighthouse performance' },
  { value: '36', label: 'Service silo pages' }
];

function kgMediaBlock(align = 'right') {
  return {
    kicker: 'Live client architecture',
    title: 'Knight Group — 97-page handyman growth site',
    text: `${KG.summary} Built on GitHub Pages with hand-coded HTML, separate business phone/email routing, photo galleries, and ${KG.bookingPath} for estimate intent.`,
    bullets: [
      `${KG.breakdown.cityPages}+ city handyman pages across ${KG.geography}`,
      `${KG.breakdown.servicePages} /Services/ pages for distinct repair intents`,
      `${KG.schema}`,
      KG.outreachNote
    ],
    align,
    media: { type: 'image', src: '/images/KGHero.webp', alt: 'Knight Group handyman website hero' }
  };
}

module.exports = { KG, KG_STATS, kgMediaBlock };
