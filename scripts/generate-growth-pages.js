const fs = require('fs');
const path = require('path');

const VER = '20260626growth1';
const root = path.join(__dirname, '..');

const pages = [
  {
    slug: 'business-growth-systems',
    title: 'Business Growth Systems',
    meta: 'Complete business growth systems for Tampa Bay small businesses: website, local SEO, CRM outreach, automation, referral tracking, and reporting.',
    eyebrow: 'Flagship service',
    h1: 'Business Growth Systems for Small & Local Companies',
    lead: 'For businesses that do not just need a website — they need a connected system that brings in leads, tracks the work, follows up, and proves what is working.',
    stacks: [
      ['Website & conversion', 'Hand-coded site, offer clarity, lead capture, analytics, and PageSpeed-first development.'],
      ['Local visibility', 'Technical SEO, schema, Google Business alignment, service-area structure, and map-pack readiness.'],
      ['CRM outreach', 'Segmented lists, branded outreach, reply tracking, follow-up queues, and lead-source reporting.'],
      ['Workflow automation', 'Email routing, social runners, ticket intake, invoice triggers, and internal tools tied to real ops.'],
      ['Referral tracking', 'Partner QR links, referral codes, attribution, and payout visibility.'],
      ['Reporting', 'Dashboards that show queue depth, lead sources, failures, and what is actually driving work.']
    ],
    links: [
      ['/service-websites', 'Websites & Local SEO'],
      ['/crm-outreach-lead-generation', 'CRM Outreach'],
      ['/service-ai-automation', 'Automation & Tools'],
      ['/case-study-knight-group', 'Knight Group Case Study'],
      ['/pricing', 'Pricing']
    ]
  },
  {
    slug: 'crm-outreach-lead-generation',
    title: 'CRM Outreach & Lead Generation',
    meta: 'CRM outreach and local lead generation systems for Tampa Bay service businesses — segmented lists, reply tracking, and follow-up workflows.',
    eyebrow: 'Lead engine',
    h1: 'CRM Outreach & Lead Generation Systems',
    lead: 'Built and tested across real local-service campaigns — segmented outreach, branded CTA-heavy messages, reply tracking, follow-up, and lead-source reporting.',
    stacks: [
      ['List building', 'Targeted outreach lists by trade, geography, company size, and fit — without mixing templates or sender reputations.'],
      ['Message formatting', 'Branded emails with clear CTAs, service context, and proof links that match how your business actually sells.'],
      ['Reply tracking', 'Replies routed into CRM queues so follow-up does not disappear in a normal inbox.'],
      ['Follow-up workflow', 'Daily send caps, queue depth visibility, and next-action clarity for consistent outreach.'],
      ['Performance reporting', 'Lead-source dashboards that show what lists, messages, and channels are producing replies.']
    ],
    links: [
      ['/business-growth-systems', 'Business Growth Systems'],
      ['/case-study-knight-group', 'Knight Group Case Study'],
      ['/automation', 'Automation Overview'],
      ['/book-consultation', 'Book Consultation']
    ]
  },
  {
    slug: 'ticketing-invoicing-job-workflows',
    title: 'Ticketing, Invoicing & Job Workflows',
    meta: 'Field service ticketing, mobile job tracking, photo attachments, PDF reports, and automated invoicing for Tampa Bay service vendors.',
    eyebrow: 'Field operations',
    h1: 'Ticketing, Invoicing & Job Workflow Systems',
    lead: 'For service businesses that get work through portals, vendors, property managers, or field tickets and need a cleaner way to track jobs, photos, invoices, and proof.',
    stacks: [
      ['Ticket intake', 'Vendor portal tickets, email intake, or manual job creation routed into one workflow queue.'],
      ['Mobile job tracking', 'Field updates, status changes, and assignment visibility from phone or tablet.'],
      ['Photo & PDF proof', 'Photos attached to each job with PDF job reports for clients and property managers.'],
      ['Automated invoicing', 'Invoice creation from completed jobs with Stripe or payment-link support.'],
      ['Workflow visibility', 'Owner dashboards showing open jobs, overdue invoices, and bottlenecks.']
    ],
    links: [
      ['/service-ai-automation', 'Automation Services'],
      ['/contractor-growth-systems', 'Contractor Growth Systems'],
      ['/book-consultation', 'Plan a Workflow Build']
    ]
  },
  {
    slug: 'referral-network-systems',
    title: 'Referral Network Systems',
    meta: 'Referral tracking systems with QR brochures, partner landing pages, attribution, and payout visibility for Tampa Bay service businesses.',
    eyebrow: 'Partner growth',
    h1: 'Referral Network & Tracking Systems',
    lead: 'Stronger than a simple referral page — QR brochures, referral codes, partner landing pages, tracked forms, lead-source dashboards, and payout visibility.',
    stacks: [
      ['Referral codes & QR', 'Brochure-ready QR links and partner codes that attribute leads to the right source.'],
      ['Partner landing pages', 'Tracked forms and branded entry points for each partner or trade lane.'],
      ['Attribution dashboard', 'See which partners, campaigns, and QR scans are producing consults and jobs.'],
      ['Payout visibility', 'Status tracking for earned referral fees with clear rules on who owns the customer.'],
      ['Network option', 'Knight Local Partner Network concept for trusted Tampa Bay trade partners routing work responsibly.']
    ],
    links: [
      ['/referral-program', 'Join Referral Program'],
      ['/automation', 'Automation Systems'],
      ['/business-growth-systems', 'Growth Systems']
    ]
  },
  {
    slug: 'local-visibility-systems',
    title: 'Local Visibility Systems',
    meta: 'Local visibility systems combining local SEO, Google Business Profile optimization, reviews, and service-area strategy for Tampa Bay businesses.',
    eyebrow: 'Find · trust · call',
    h1: 'Local Visibility Systems',
    lead: 'Outcome-based local discovery: show up in search, earn trust on Google Maps, get calls, and align your website with what Google expects to see.',
    stacks: [
      ['Local SEO cleanup', 'Crawl blockers, metadata, schema, internal links, and service-area page structure.'],
      ['Google Business Profile', 'Categories, services, descriptions, reviews, Q&A, posts, photos, and website alignment.'],
      ['Review flow', 'Review request systems and on-site trust signals that support map-pack visibility.'],
      ['Service-area strategy', 'City and service pages that match how you actually operate — not keyword spam.'],
      ['Audit & reporting', 'Search Console, analytics, and practical next steps tied to calls and form fills.']
    ],
    links: [
      ['/service-local-seo', 'Local SEO Services'],
      ['/service-google-business-profile', 'Google Business Profile'],
      ['/website-growth-audit', 'Website & Growth Audit'],
      ['/service-websites', 'Website Services']
    ]
  },
  {
    slug: 'website-growth-audit',
    title: 'Website & Business Growth Audit',
    meta: 'Free website and business growth audit for Tampa Bay small businesses — website clarity, SEO, GBP, lead capture, automation gaps, and next steps.',
    eyebrow: 'Start here',
    h1: 'Website & Business Growth Audit',
    lead: 'More than a PageSpeed score — we review website clarity, SEO structure, GBP alignment, lead capture, follow-up process, referral opportunities, automation bottlenecks, and tracking gaps.',
    stacks: [
      ['Website clarity', 'Homepage message, offer structure, CTAs, and mobile usability.'],
      ['SEO & indexing', 'Technical SEO, schema, sitemap, Search Console signals, and crawl issues.'],
      ['GBP alignment', 'Does your Google Business Profile match your site, categories, and service areas?'],
      ['Lead & follow-up', 'Forms, call paths, CRM gaps, and missed follow-up opportunities.'],
      ['Growth opportunities', 'Referral flow, automation bottlenecks, and practical next-step recommendations.']
    ],
    links: [
      ['/free-website-audit', 'Request Free Audit Form'],
      ['/book-consultation', 'Book Consultation'],
      ['/business-growth-systems', 'Growth Systems'],
      ['/local-visibility-systems', 'Local Visibility']
    ]
  },
  {
    slug: 'online-ordering-systems',
    title: 'E-Commerce & Online Ordering Systems',
    meta: 'E-commerce and online ordering systems for Tampa Bay restaurants, retailers, and product businesses — Stripe, admin editing, events, and checkout flows.',
    eyebrow: 'Commerce & ordering',
    h1: 'E-Commerce & Online Ordering Systems',
    lead: 'Flexible ordering and storefront systems — from resin tables and product catalogs to restaurant events, pickup orders, and admin-editable menus.',
    stacks: [
      ['Custom storefronts', 'Hand-coded shops with Stripe, inventory logic, and conversion-focused product pages.'],
      ['Restaurant & bar systems', 'Events, menus, ordering flows, and admin content editing without a bloated platform.'],
      ['Checkout & payments', 'Stripe, payment links, and order confirmation workflows.'],
      ['Admin control', 'Editable menus, events, and content areas your team can update.'],
      ['Integrations later', 'Room for POS or Toast-style integrations as the business grows.']
    ],
    links: [
      ['/service-ecommerce', 'E-Commerce Development'],
      ['/case-study-moms-resin-tables', "Mom's Resin Tables Case Study"],
      ['/book-consultation', 'Plan Your Storefront']
    ]
  },
  {
    slug: 'contractor-growth-systems',
    title: 'Contractor Growth Systems',
    meta: 'Contractor growth systems for Tampa Bay trades — website design, local SEO, lead capture, CRM outreach, and job workflow automation.',
    eyebrow: 'Trades & contractors',
    h1: 'Contractor Business Growth Systems',
    lead: 'Roofing, handyman, screen enclosure, excavation, electrical, and field trades need more than a website — they need local visibility, lead capture, and systems that track the work.',
    stacks: [
      ['Trade-focused websites', 'Service pages, service-area SEO, call-first CTAs, and proof that matches how trades sell.'],
      ['Local map visibility', 'Google Business alignment, schema, and city pages for Tampa Bay metros.'],
      ['Lead capture & CRM', 'Outreach, form tracking, and follow-up for estimate-first trades.'],
      ['Job workflows', 'Ticket intake, photos, invoices, and field updates for vendor and portal work.'],
      ['Referral partners', 'QR referral systems for complementary trades in your network.']
    ],
    links: [
      ['/home-service-websites', 'Home Service Websites'],
      ['/case-study-knight-group', 'Knight Group Case Study'],
      ['/case-study-screen-team', 'Screen Team Case Study'],
      ['/business-growth-systems', 'Full Growth Systems']
    ]
  },
  {
    slug: 'home-service-business-growth-systems',
    title: 'Home Service Business Growth Systems',
    meta: 'Home service business growth systems for Tampa Bay — websites, local SEO, Google Business, CRM outreach, and automation for contractors and local trades.',
    eyebrow: 'Home services',
    h1: 'Home Service Business Growth Systems',
    lead: 'Built for the businesses that show up at the property — handyman, cleaning, painting, screen repair, HVAC-adjacent trades, and local service companies that live on calls and estimates.',
    stacks: [
      ['Conversion-first websites', 'Fast hand-coded sites with clear services, trust signals, and call or form CTAs.'],
      ['Local SEO & GBP', 'Map-pack readiness, service-area pages, and Google Business cleanup.'],
      ['Lead generation', 'CRM outreach and landing pages for estimate-first home service sales.'],
      ['Operations support', 'Follow-up automation, referral tracking, and job workflow tools after launch.'],
      ['Proof you can check', 'Live case studies across trades in Tampa Bay and Central Florida.']
    ],
    links: [
      ['/home-service-websites', 'Home Service Websites'],
      ['/local-visibility-systems', 'Local Visibility'],
      ['/case-studies', 'Case Studies'],
      ['/website-growth-audit', 'Free Growth Audit']
    ]
  },
  {
    slug: 'performance-partner-program',
    title: 'Performance Partner Program',
    meta: 'Performance-based partnership program for Tampa Bay businesses — base fee, 90-day measurement window, clear attribution rules, and monthly reporting.',
    eyebrow: 'Partnership model',
    h1: 'Performance Partner Program',
    lead: 'For businesses that want shared upside with clear rules — base monthly fee, 90-day measurement window, baseline before work starts, and written scope on what counts as performance.',
    stacks: [
      ['Base + performance fee', 'Predictable base for ongoing systems work with performance component tied to agreed metrics.'],
      ['90-day measurement', 'Baseline captured before work starts; results measured against that window — not vague promises.'],
      ['What counts', 'Defined lead, call, booking, or revenue signals with attribution rules documented upfront.'],
      ['Reporting method', 'Monthly dashboard or report showing tracked outcomes, caps, and next actions.'],
      ['Terms & limits', 'Minimum term, cancellation rules, monthly cap, and dispute process in writing before launch.']
    ],
    links: [
      ['/pricing', 'Standard Pricing'],
      ['/book-consultation', 'Discuss Partnership Fit'],
      ['/business-growth-systems', 'Growth Systems Scope']
    ]
  }
];

function renderPage(p) {
  const stacks = p.stacks.map(([h, t]) => `                <div class="kl-growth-stack-item fade-in"><h3>${h}</h3><p>${t}</p></div>`).join('\n');
  const links = p.links.map(([href, label]) => `<a href="${href}">${label}</a>`).join('\n                ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="preload" href="/header.html?v=${VER}" as="fetch" crossorigin="anonymous">
    <link rel="preload" href="/footer.html?v=${VER}" as="fetch" crossorigin="anonymous">
    <script defer src="/script.js?v=${VER}"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${p.meta}">
    <meta name="author" content="Nicholas Knight">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${p.title} | Knight Logics">
    <meta property="og:description" content="${p.meta}">
    <meta property="og:url" content="https://knightlogics.com/${p.slug}">
    <meta property="og:site_name" content="Knight Logics">
    <meta property="og:image" content="https://knightlogics.com/images/KnightLogicsLogo2.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${p.title} | Knight Logics">
    <meta name="twitter:description" content="${p.meta}">
    <title>${p.title} | Knight Logics</title>
    <link rel="canonical" href="https://knightlogics.com/${p.slug}">
    <link rel="stylesheet" href="/style.css?v=${VER}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-VX36QR7HJW');
    </script>
</head>
<body class="kl-growth-page page-${p.slug}">
    <div id="header-container"></div>

    <section class="svc-hero">
        <div class="container">
            <div class="svc-hero-inner fade-in">
                <nav class="kl-breadcrumb" aria-label="Breadcrumb">
                    <a href="/">Home</a>
                    <span>/</span>
                    <span>${p.title}</span>
                </nav>
                <span class="svc-eyebrow"><i class="fas fa-layer-group"></i> ${p.eyebrow}</span>
                <h1>${p.h1}</h1>
                <p>${p.lead}</p>
                <div class="svc-cta-row">
                    <a href="/book-consultation" class="btn-primary">Book a Consultation</a>
                    <a href="/website-growth-audit" class="btn-secondary">Free Growth Audit</a>
                </div>
            </div>
        </div>
    </section>

    <section class="svc-features">
        <div class="container">
            <div class="section-header fade-in">
                <h2>What this includes</h2>
                <p>Practical systems tied to real operations — not generic agency deliverables.</p>
            </div>
            <div class="kl-growth-stack">
${stacks}
            </div>
            <div class="kl-growth-links fade-in">
                ${links}
            </div>
        </div>
    </section>

    <section class="svc-cta-band">
        <div class="container">
            <div class="svc-cta-band-inner fade-in">
                <h2>Ready to plan your build?</h2>
                <p>Tell us what is broken, what you are trying to grow, and what systems you already use. We will recommend the leanest path forward.</p>
                <a href="/book-consultation" class="btn-primary">Book a Free Consultation</a>
            </div>
        </div>
    </section>

    <div id="footer-container"></div>
</body>
</html>`;
}

for (const p of pages) {
  const file = path.join(root, `${p.slug}.html`);
  fs.writeFileSync(file, renderPage(p), 'utf8');
  console.log('Wrote', file);
}

console.log(`Generated ${pages.length} growth service pages.`);
