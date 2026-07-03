/** Shared media paths for growth page content */

const heroPanelPool = [
  '/images/showcase/faith-works-og-card.jpg',
  '/images/screen-team-showcase-800.webp',
  '/images/KGHero.webp',
  '/images/JNS-HomeImage.webp',
  '/images/momhero.webp',
  '/images/websitehero.webp?v=20260604perf1'
];

/** object-position for cover crops — tuned so people stay in frame */
const heroImageFocus = {
  '/images/showcase/faith-works-og-card.jpg': { desktop: '42% 38%', mobile: '44% 36%' },
  '/images/screen-team-showcase-800.webp': { desktop: '74% 48%', mobile: '82% 50%' },
  '/images/KGHero.webp': { desktop: '76% 44%', mobile: '82% 46%' },
  '/images/JNS-HomeImage.webp': { desktop: '55% 42%', mobile: '58% 44%' },
  '/images/showcase/hospitality-events-hours-mockup.webp': { desktop: '50% 42%', mobile: '50% 40%' },
  '/images/showcase/hospitality-menus-ordering-mockup.webp': { desktop: '50% 42%', mobile: '50% 40%' },
  '/images/momhero.webp': { desktop: '50% 32%', mobile: '50% 28%' },
  '/images/websitehero.webp': { desktop: '38% 36%', mobile: '42% 38%' },
  '/images/websitehero.webp?v=20260604perf1': { desktop: '38% 36%', mobile: '42% 38%' }
};

const heroMobilePriority = [
  '/images/screen-team-showcase-800.webp',
  '/images/KGHero.webp',
  '/images/websitehero.webp?v=20260604perf1',
  '/images/JNS-HomeImage.webp',
  '/images/showcase/faith-works-og-card.jpg',
  '/images/momhero.webp'
];

function normalizeHeroSrc(src) {
  if (!src) return '';
  return src.split('?')[0];
}

function getHeroFocus(src, mobile = false) {
  const key = src || '';
  const bare = normalizeHeroSrc(key);
  const entry = heroImageFocus[key] || heroImageFocus[bare];
  if (!entry) return '50% 42%';
  return mobile ? entry.mobile : entry.desktop;
}

function pickMobileHeroImage(panels, primarySrc) {
  const barePrimary = normalizeHeroSrc(primarySrc);
  if (barePrimary && (heroImageFocus[primarySrc] || heroImageFocus[barePrimary])) {
    const match = panels.find((p) => normalizeHeroSrc(p) === barePrimary);
    if (match) return match;
    if (primarySrc && !/KnightLogicsLogo/i.test(primarySrc)) return primarySrc;
  }

  for (const preferred of heroMobilePriority) {
    const found = panels.find((p) => normalizeHeroSrc(p) === normalizeHeroSrc(preferred));
    if (found) return found;
  }

  return panels[0];
}

function isLogoHero(src) {
  return !src || /KnightLogicsLogo/i.test(src);
}

function pickHeroPanels(slug, primarySrc) {
  const panels = [];
  if (!isLogoHero(primarySrc)) {
    panels.push(primarySrc);
  }

  const key = String(slug || 'page');
  const excludeMomHero = /restaurant-bar|hospitality-system/.test(key);
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 3)) % heroPanelPool.length;
  }

  for (let i = 0; panels.length < 4; i += 1) {
    const candidate = heroPanelPool[(hash + i) % heroPanelPool.length];
    if (excludeMomHero && normalizeHeroSrc(candidate) === '/images/momhero.webp') continue;
    if (!panels.includes(candidate)) panels.push(candidate);
    if (i > heroPanelPool.length * 2) break;
  }

  while (panels.length < 4) {
    const fallback = heroPanelPool[panels.length % heroPanelPool.length];
    if (excludeMomHero && normalizeHeroSrc(fallback) === '/images/momhero.webp') {
      panels.push('/images/showcase/hospitality-events-hours-mockup.webp');
    } else {
      panels.push(fallback);
    }
  }

  return panels.slice(0, 4);
}

module.exports = {
  heroPanelPool,
  heroImageFocus,
  heroMobilePriority,
  normalizeHeroSrc,
  getHeroFocus,
  pickMobileHeroImage,
  isLogoHero,
  pickHeroPanels,
  videos: {
    crm: { type: 'video', src: '/videos/automation/crm-outreach-dashboard.mp4', vtt: '/videos/automation/crm-outreach-dashboard.vtt' },
    email: { type: 'video', src: '/videos/automation/email-agent-routing.mp4', vtt: '/videos/automation/email-agent-routing.vtt' },
    social: { type: 'video', src: '/videos/automation/social-media-manager.mp4', vtt: '/videos/automation/social-media-manager.vtt' },
    referral: { type: 'video', src: '/videos/automation/referral-system-dashboard.mp4', vtt: '/videos/automation/referral-system-dashboard.vtt' }
  },
  images: {
    kgHero: { type: 'image', src: '/images/KGHero.webp', alt: 'Knight Group handyman website hero' },
    screenTeam: { type: 'image', src: '/images/screen-team-showcase-800.webp', alt: 'Screen Team LLC local service website', width: 800, height: 450 },
    faithWorks: { type: 'image', src: '/images/showcase/faith-works-og-card.jpg', alt: 'Faith Works Outdoor Services local SEO site', width: 1200, height: 630 },
    jns: { type: 'image', src: '/images/JNS-HomeImage.webp', alt: 'JNS Construction contractor website' },
    farrellElectric: { type: 'image', src: 'https://farrell-electric.github.io/farrell-electric-website/HeroImage.png', alt: 'Farrell Electric website hero', width: 1200, height: 630 },
    salsPainting: { type: 'image', src: '/images/sals-hero.webp', alt: "Sal's Painting website hero", width: 1200, height: 630 },
    moms: { type: 'image', src: '/images/momhero.webp', alt: "Mom's Resin Tables e-commerce storefront" },
    hospitality: {
      type: 'image',
      src: '/images/showcase/hospitality-menus-ordering-mockup.webp',
      alt: 'Illustration of restaurant menu specials and order-ahead checkout',
      width: 1200,
      height: 750
    },
    hospitalityEvents: {
      type: 'image',
      src: '/images/showcase/hospitality-events-hours-mockup.webp',
      alt: 'Illustration of restaurant events calendar and business hours on owned domain',
      width: 1200,
      height: 750
    },
    hospitalityMenus: {
      type: 'image',
      src: '/images/showcase/hospitality-menus-ordering-mockup.webp',
      alt: 'Illustration of admin-editable menu specials and Stripe order-ahead checkout',
      width: 1200,
      height: 750
    },
    logo: { type: 'image', src: '/images/KnightLogicsLogo2.webp', alt: 'Knight Logics growth systems' },
    caseStudyCrm: { type: 'image', src: '/images/showcase/case-study-crm-outreach-mockup.webp', alt: 'CRM outreach queue dashboard', width: 1200, height: 675 },
    caseStudyVendoroo: { type: 'image', src: '/images/showcase/case-study-vendoroo-ticket-mockup.webp', alt: 'Vendor ticket and invoice workflow', width: 1200, height: 675 },
    caseStudyKnightCommand: { type: 'image', src: '/images/showcase/case-study-knight-command-mockup.webp', alt: 'Knight Command admin shell', width: 1200, height: 675 },
    caseStudyReferral: { type: 'image', src: '/images/showcase/case-study-referral-network-mockup.webp', alt: 'Referral network attribution dashboard', width: 1200, height: 675 },
    caseStudySocial: { type: 'image', src: '/images/showcase/case-study-social-poster-mockup.webp', alt: 'Social posting queue dashboard', width: 1200, height: 675 },
    caseStudyRoofing: { type: 'image', src: '/images/showcase/case-study-roofing-lead-mockup.webp', alt: 'Roofing lead capture and trust pages', width: 1200, height: 675 },
    caseStudyKnightLogics: { type: 'image', src: '/images/showcase/case-study-knightlogics-platform-mockup.webp', alt: 'Knight Logics marketing and ops platform', width: 1200, height: 675 }
  }
};
