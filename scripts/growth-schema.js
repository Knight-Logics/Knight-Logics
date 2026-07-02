/**
 * Structured data for generated growth / case-study pages.
 * Matches provider block used on service-websites.html.
 */

const ORG_ID = 'https://knightlogics.com/#organization';

const PROVIDER = {
  '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
  '@id': ORG_ID,
  name: 'Knight Logics',
  url: 'https://knightlogics.com/',
  image: 'https://knightlogics.com/images/KnightLogicsLogo2.png',
  telephone: '+1-813-773-5553',
  email: 'support@knightlogics.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Safety Harbor',
    addressRegion: 'FL',
    postalCode: '34695',
    addressCountry: 'US',
  },
  sameAs: [
    'https://github.com/Knight-Logics',
    'https://www.linkedin.com/company/knight-logics/',
    'https://www.facebook.com/KnightLogics/',
    'https://www.google.com/maps/place/Knight+Logics/data=!4m2!3m1!1s0x0:0x48644c12a6309a67?hl=en&ictx=111',
  ],
};

const AREA_SERVED = [
  { '@type': 'City', name: 'Tampa', containedInPlace: { '@type': 'State', name: 'Florida' } },
  { '@type': 'City', name: 'St. Petersburg', containedInPlace: { '@type': 'State', name: 'Florida' } },
  { '@type': 'City', name: 'Clearwater', containedInPlace: { '@type': 'State', name: 'Florida' } },
  { '@type': 'City', name: 'Safety Harbor', containedInPlace: { '@type': 'State', name: 'Florida' } },
  { '@type': 'City', name: 'Palm Harbor', containedInPlace: { '@type': 'State', name: 'Florida' } },
  { '@type': 'AdministrativeArea', name: 'Pinellas County', containedInPlace: { '@type': 'State', name: 'Florida' } },
  { '@type': 'AdministrativeArea', name: 'Hillsborough County', containedInPlace: { '@type': 'State', name: 'Florida' } },
];

function pageUrl(slug) {
  return `https://knightlogics.com/${slug}`;
}

function breadcrumbItems(page, opts = {}) {
  const items = [{ href: '/', label: 'Home' }];
  if (opts.caseStudy) {
    items.push({ href: '/case-studies', label: 'Case Studies' });
  } else if (page.parent) {
    items.push({ href: page.parent.href, label: page.parent.label });
  }
  items.push({ label: page.title });
  return items;
}

function buildBreadcrumbList(page, opts = {}) {
  const items = breadcrumbItems(page, opts);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://knightlogics.com${item.href}` } : {}),
    })),
  };
}

function buildWebPage(page, opts = {}) {
  const url = pageUrl(page.slug);
  return {
    '@context': 'https://schema.org',
    '@type': opts.caseStudy ? 'Article' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: opts.caseStudy ? `${page.title} Case Study` : page.title,
    description: page.meta,
    isPartOf: { '@id': 'https://knightlogics.com/#website' },
    about: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

function buildService(page) {
  const url = pageUrl(page.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.h1 || page.title,
    description: page.meta,
    serviceType: page.title,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    provider: PROVIDER,
    areaServed: AREA_SERVED,
  };
}

function buildCaseStudyCreativeWork(page) {
  const url = pageUrl(page.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${page.title} Case Study`,
    description: page.meta,
    url,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    about: page.h1 || page.title,
    inLanguage: 'en-US',
  };
}

function renderStructuredDataScripts(page, opts = {}) {
  const blocks = opts.caseStudy
    ? [buildWebPage(page, opts), buildCaseStudyCreativeWork(page), buildBreadcrumbList(page, opts)]
    : [buildWebPage(page, opts), buildService(page), buildBreadcrumbList(page, opts)];

  return blocks
    .map((block) => `<script type="application/ld+json">${JSON.stringify(block)}</script>`)
    .join('\n    ');
}

module.exports = {
  renderStructuredDataScripts,
  buildBreadcrumbList,
  buildWebPage,
  buildService,
};
