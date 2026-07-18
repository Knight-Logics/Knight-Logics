/**
 * Shared copy for trade-lane industry pages — recruitment into the
 * Knight Logics growth + referral network, with case studies as proof.
 */

const NETWORK_LINKS = [
  ['/referral-network-systems', 'Referral Network Systems'],
  ['/performance-partner-program', 'Performance Partner Program'],
  ['/referral-program', 'Referral Partner Program'],
  ['/business-growth-systems', 'Business Growth Systems'],
];

function tradeNetworkBlock(opts = {}) {
  const trade = opts.trade || 'local service';
  const reference = opts.reference || 'a live reference build in this trade';
  const complementary = opts.complementary || 'electricians, plumbers, painters, handymen, and enclosure trades';
  const openLane = opts.openLane !== false;

  const paragraphs = [
    `Knight Logics builds online presences and growth systems for ${trade} businesses, then plugs qualified partners into a tracked referral and co-marketing network across Tampa Bay.`,
    `This page is a trade playbook — not a client microsite. ${reference} shows what the stack looks like at launch; your build gets its own brand lane, outreach caps, and /ref/:partner attribution when you join the network.`,
  ];

  if (openLane) {
    paragraphs.push(
      `We are actively adding complementary trades (${complementary}) so partners can send real work to each other with QR paths, consult attribution, and payout visibility — not spreadsheet disputes.`
    );
  }

  return {
    title: 'Growth stack + referral network for your trade',
    paragraphs,
    bullets: [
      'Website, local SEO, and Google Business alignment as the foundation',
      'Optional CRM outreach with brand-isolated lanes (kl / kg / st / faithworks pattern)',
      'Referral tracking with /ref/:partner paths and partner dashboard visibility',
      'Case study published when your launch is ready — proof for the next trade lane',
      'Mass marketing and referral campaigns scale as the partner roster grows',
    ],
    links: NETWORK_LINKS,
    ctaLabel: 'Plan your trade lane',
    ctaHref: '/book-consultation',
    networkImage: opts.networkImage || null,
  };
}

const SLUG_NETWORK = {
  'handyman-business-growth-systems': {
    trade: 'handyman and general property repair',
    reference: 'Knight Group (97-page live benchmark)',
    complementary: 'electricians, painters, screen repair, and cleaning trades',
  },
  'screen-enclosure-business-growth-systems': {
    trade: 'screen enclosure and pool cage',
    reference: 'Screen Team (36-page live benchmark)',
    complementary: 'handymen, roofers, builders, and pool service trades',
  },
  'excavation-business-growth-systems': {
    trade: 'excavation, land clearing, and site work',
    reference: 'Faith Works (82-page live benchmark)',
    complementary: 'contractors, builders, landscapers, and utility trades',
  },
  'roofing-business-growth-systems': {
    trade: 'roofing and storm-season field trades',
    reference: 'Roof Monsters on roofmonsters.co (live network anchor)',
    complementary: 'screen enclosure, handyman, and insurance-adjacent trades',
    networkImage: {
      src: '/images/showcase/roof-monsters-homepage-wave.webp',
      alt: 'Roof Monsters homepage — Your Roof Is Our Proof',
      width: 1920,
      height: 1080,
    },
  },
  'electrician-business-growth-systems': {
    trade: 'electrical contracting',
    reference: 'Farrell Electric (starter launch case study)',
    complementary: 'handymen, HVAC, plumbers, and general contractors',
    openLane: true,
  },
  'painter-business-growth-systems': {
    trade: 'painting and finishing',
    reference: "Sal's Painting (search-ready starter case study)",
    complementary: 'handymen, drywall, pressure washing, and remodeling trades',
    openLane: true,
  },
  'contractor-growth-systems': {
    trade: 'contractor and field trades',
    reference: 'Screen Team, Faith Works, and Knight Group as live network anchors',
    complementary: 'electricians, plumbers, painters, enclosure, and site-work trades',
  },
  'home-service-business-growth-systems': {
    trade: 'home service and property-facing trades',
    reference: 'Knight Group, Screen Team, and Faith Works across residential lanes',
    complementary: 'electricians, painters, cleaners, and plumbers joining the roster',
  },
};

function tradeNetworkForSlug(slug) {
  const cfg = SLUG_NETWORK[slug];
  if (!cfg) return null;
  return tradeNetworkBlock(cfg);
}

module.exports = {
  NETWORK_LINKS,
  tradeNetworkBlock,
  tradeNetworkForSlug,
  SLUG_NETWORK,
};
