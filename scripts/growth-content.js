const { videos, images } = require('./growth-content-media');

const flagshipPages = [
  {
    slug: 'business-growth-systems',
    title: 'Business Growth Systems',
    meta: 'Complete business growth systems for Tampa Bay small businesses — website, local SEO, CRM outreach, automation, referral tracking, and owner dashboards.',
    eyebrow: 'Flagship service',
    h1: 'Business Growth Systems for Small & Local Companies',
    lead: 'Build the online presence, then wire leads, outreach, referrals, and ops into one stack — and grow a roster of complementary service partners who send tracked work across Tampa Bay.',
    heroIcon: 'fa-layer-group',
    heroImage: { src: images.logo.src, alt: 'Knight Logics business growth systems' },
    stats: [
      { value: '6', label: 'Connected system lanes' },
      { value: 'Live', label: 'Production workflows' },
      { value: 'Tampa Bay', label: 'Primary market focus' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Growth breaks when every tool lives in a different tab',
      text: 'Most local businesses stack a website, Gmail, spreadsheets, a CRM they never open, and social accounts nobody maintains. Leads slip through because nothing talks to anything else.',
      bullets: [
        'Outreach replies get lost in personal inboxes',
        'Referral partners have no attribution or payout clarity',
        'Owners cannot see queue depth or lead sources without logging into five tools',
        'Websites launch without SEO, schema, or follow-up infrastructure'
      ],
      media: { ...videos.crm, title: 'Growth ops in one view', text: 'Knight Command ties outreach, email, social, and referral workflows into operator tabs.' }
    },
    features: [
      { icon: 'fa-globe', label: 'Foundation', title: 'Website & conversion', text: 'Hand-coded sites with offer clarity, lead capture, analytics, and PageSpeed-first builds — not bloated page builders.' },
      { icon: 'fa-map-marker-alt', label: 'Discovery', title: 'Local visibility', text: 'Technical SEO, schema, Google Business alignment, service-area pages, and map-pack readiness tied to real geography.' },
      { icon: 'fa-paper-plane', label: 'Outbound', title: 'CRM outreach', text: 'OutreachEngine with segmented lists, branded sends, reply routing, follow-up queues, and daily caps that protect sender reputation.' },
      { icon: 'fa-cogs', label: 'Automation', title: 'Workflow automation', text: 'Email-Agent on port 5100, Social Poster on 8501, ticket intake, invoice triggers, and internal tools wired to daily ops.' },
      { icon: 'fa-qrcode', label: 'Partners', title: 'Referral tracking', text: 'QR brochures, /ref/:partner paths, Neon Postgres events, referral-dashboard payouts, and Stripe webhook settlement.' },
      { icon: 'fa-chart-line', label: 'Visibility', title: 'Owner reporting', text: 'Dashboards for queue depth, lead sources, failures, and campaign performance — readable on mobile.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Command center',
        title: 'Knight Command at /admin',
        text: 'One authenticated shell with tabs for Command Center, Referrals, Outreach CRM, Email Agent, Social Ops, Social Poster, and Logs — each embedding live services on ports 5050, 5100, 8500, and 8501.',
        bullets: ['Fewer context switches between growth tools', 'Embeds stay isolated but reachable from one login', 'Operator-first layout, not marketing fluff'],
        media: { ...videos.referral, title: 'Referral & ops embed', text: 'Referral dashboard and partner attribution inside the admin shell.' }
      },
      {
        kicker: 'Proof in market',
        title: 'Built on live Tampa Bay client work',
        text: 'Three live growth-system clients prove the stack: Faith Works at 82 land-clearing pages (faithworks lane), Screen Team at 36 enclosure pages (st lane), and Knight Group at 97 handyman pages (kg lane) — same OutreachEngine, Email-Agent, and local SEO infrastructure.',
        align: 'right',
        media: images.faithWorks
      }
    ],
    process: [
      { title: 'Audit & baseline', text: 'Website clarity, SEO, GBP alignment, lead capture gaps, and automation bottlenecks documented before build scope.' },
      { title: 'Foundation launch', text: 'Site, schema, analytics, Search Console, and conversion paths go live with measurable baselines.' },
      { title: 'Systems wiring', text: 'CRM outreach, Email-Agent, referral tracking, and job workflows connected to how your team actually sells.' },
      { title: 'Reporting & iteration', text: 'Owner dashboards, monthly review, and prioritized next moves based on queue data — not vanity metrics.' }
    ],
    idealFor: [
      'Local service companies ready to invest in systems, not just a redesign',
      'Owners who want outreach, referrals, and ops visibility in one growth stack',
      'Trades and home services selling estimates, calls, and repeat work',
      'Businesses outgrowing spreadsheets and disconnected SaaS tools'
    ],
    proof: {
      title: 'Faith Works: 82-page land clearing growth system',
      text: '82 indexable pages across Central Florida, faithworks OutreachEngine lane, schema, GA4/GSC, and GBP alignment — full growth stack alongside Screen Team and Knight Group.',
      image: images.faithWorks.src,
      imageAlt: 'Faith Works land clearing website',
      badge: 'Live client',
      href: '/case-study-faith-works',
      linkLabel: 'View Faith Works case study'
    },
    faq: [
      { q: 'Is this a website package or full operations build?', a: 'It is a connected growth system. The website is the foundation, but CRM outreach, automation, referrals, and reporting are scoped to what your business will actually use.' },
      { q: 'Do you replace our existing CRM?', a: 'Often we extend or replace lightweight CRM gaps with OutreachEngine and Email-Agent routing. We map to what you already pay for before recommending a swap.' },
      { q: 'How long until systems are live?', a: 'Foundation sites typically launch in weeks. Automation and outreach layers follow in phased milestones so your team is not overwhelmed on day one.' }
    ],
    links: [
      ['/service-websites', 'Websites & Local SEO'],
      ['/crm-outreach-lead-generation', 'CRM Outreach'],
      ['/service-ai-automation', 'Automation & Tools'],
      ['/case-study-faith-works', 'Faith Works Case Study'],
      ['/case-study-screen-team', 'Screen Team Case Study'],
      ['/case-study-knight-group', 'Knight Group Case Study'],
      ['/pricing', 'Pricing']
    ],
    pricingNote: 'Scoped by lane — website-only, outreach, automation, or full growth system. See pricing or book a consult for a written estimate.',
    cta: { title: 'Ready to plan your growth system?', text: 'Tell us what is broken, what you are trying to grow, and which tools you already use. We will recommend the leanest path forward.' }
  },
  {
    slug: 'crm-outreach-lead-generation',
    title: 'CRM Outreach & Lead Generation',
    meta: 'CRM outreach and local lead generation for Tampa Bay service businesses — OutreachEngine, segmented lists, reply tracking, and follow-up queues.',
    eyebrow: 'Lead engine',
    h1: 'CRM Outreach & Lead Generation Systems',
    lead: 'Production outreach built on OutreachEngine — Flask, SQLite, multi-brand campaigns for kl, kg, st, and faithworks lanes with scheduler-driven first_touch and followup sequences.',
    heroIcon: 'fa-paper-plane',
    stats: [
      { value: '20–40', label: 'Daily send cap range' },
      { value: '4', label: 'Brand lanes (kl/kg/st/fw)' },
      { value: 'Live', label: 'Reply routing' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Manual outreach mixes lists, templates, and sender reputation',
      text: 'Copy-pasting between spreadsheets and Gmail destroys deliverability. Replies land in personal inboxes. Follow-ups stop when someone gets busy.',
      bullets: [
        'No visibility into queue depth or next send window',
        'Bounces and bad addresses poison future campaigns',
        'Different brands share one sender by accident',
        'Follow-up timing is inconsistent or forgotten'
      ],
      media: videos.crm
    },
    features: [
      { icon: 'fa-list', label: 'Targeting', title: 'Segmented list building', text: 'Lists by trade, geography, company size, and fit — templates and sender profiles stay separated per brand.' },
      { icon: 'fa-envelope-open-text', label: 'Creative', title: 'Branded message formatting', text: 'CTA-heavy emails with service context and proof links that match how your business actually sells estimates and calls.' },
      { icon: 'fa-inbox', label: 'Replies', title: 'Reply tracking & routing', text: 'CRM replies surface in dedicated queues instead of disappearing in a normal inbox thread.' },
      { icon: 'fa-clock', label: 'Cadence', title: 'Scheduler & follow-up', text: 'first_touch and followup jobs with daily caps between 20 and 40 sends to protect domain reputation.' },
      { icon: 'fa-shield-alt', label: 'Deliverability', title: 'Bounce detection', text: 'Hard bounces flagged and suppressed before they damage future outreach windows.' },
      { icon: 'fa-chart-bar', label: 'Reporting', title: 'Lead-source dashboards', text: 'See which lists, messages, and channels produce replies and booked work.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Live workflow',
        title: 'OutreachEngine dashboard',
        text: 'Queue preview, send windows, brand switcher, and reply counts — the same interface used on Screen Team, Faith Works, and Knight Group campaigns.',
        bullets: ['Flask + SQLite backend with reliable scheduler', 'Brand mapping for kl, kg, st, and faithworks lanes', 'Failure and bounce visibility before the week is wasted'],
        media: { ...videos.crm, title: 'CRM outreach queue', text: 'Segmented sends with daily cap enforcement.' }
      }
    ],
    process: [
      { title: 'List & offer mapping', text: 'Define ICP, geography, and the service story each segment should hear.' },
      { title: 'Template & brand setup', text: 'Separate sender profiles, CTAs, and proof links per brand lane.' },
      { title: 'Scheduler configuration', text: 'first_touch and followup cadence with caps, bounce rules, and preview sends.' },
      { title: 'Reply workflow & reporting', text: 'Route replies to Email-Agent views and report lead sources weekly.' }
    ],
    idealFor: [
      'Estimate-first trades needing consistent outbound beyond referrals',
      'Businesses with multiple brands that must not share sender reputation',
      'Owners who want follow-up discipline without living in Gmail',
      'Teams already getting some inbound but need predictable pipeline'
    ],
    proof: {
      title: 'Knight Group outreach produced real booked work',
      text: 'One well-targeted KG campaign generated substantial jobs from a segmented local list — not a mockup dashboard.',
      image: images.kgHero.src,
      imageAlt: 'Knight Group handyman growth site',
      badge: 'Campaign proof',
      href: '/case-study-knight-group',
      linkLabel: 'Knight Group case study'
    },
    faq: [
      { q: 'What daily send volume do you recommend?', a: 'We typically cap between 20 and 40 sends per day per brand while warming domains and monitoring bounce rates.' },
      { q: 'Can this connect to my existing inbox?', a: 'Yes — Email-Agent on port 5100 routes CRM replies into crm_reply views separate from manual conversations.' },
      { q: 'Is OutreachEngine included or custom?', a: 'We deploy and configure OutreachEngine for your brands, lists, and follow-up rules — adapted from our live KL/KG/ST workflows.' }
    ],
    links: [
      ['/business-growth-systems', 'Business Growth Systems'],
      ['/case-study-crm-outreach-system', 'CRM Outreach Case Study'],
      ['/email-agent-automation', 'Email-Agent Automation'],
      ['/book-consultation', 'Book Consultation']
    ],
    cta: { title: 'Want a live outreach engine?', text: 'We will scope list strategy, brand separation, and reply routing for your trade and territory.' }
  },
  {
    slug: 'ticketing-invoicing-job-workflows',
    title: 'Ticketing, Invoicing & Job Workflows',
    meta: 'Field service ticketing, mobile job tracking, photo attachments, PDF reports, and Stripe invoicing for Tampa Bay vendors and property maintenance.',
    eyebrow: 'Field operations',
    h1: 'Ticketing, Invoicing & Job Workflow Systems',
    lead: 'Portal-driven field work needs one queue — ticket intake, mobile status updates, photo proof, PDF packets, and Stripe invoices without retyping between tools.',
    heroIcon: 'fa-clipboard-list',
    stats: [
      { value: '1', label: 'Ticket-to-invoice path' },
      { value: 'Mobile', label: 'Field photo capture' },
      { value: 'Stripe', label: 'Payment link sync' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Portal tickets, photos, and invoices live in disconnected tools',
      text: 'Property managers send work through vendor portals. Crews take photos on phones. Office staff rebuild invoices manually. Payment status never syncs back to the job.',
      bullets: [
        'Ticket details copied into spreadsheets or text threads',
        'Completion photos scattered across camera rolls',
        'PDF proof rebuilt for every property manager format',
        'Stripe invoices created separately from job records'
      ],
      media: images.jns
    },
    features: [
      { icon: 'fa-ticket-alt', label: 'Intake', title: 'Ticket intake queue', text: 'Vendor portal tickets, email intake, or manual job creation routed into one workflow queue with assignment rules.' },
      { icon: 'fa-mobile-alt', label: 'Field', title: 'Mobile job tracking', text: 'Status changes, notes, and crew assignment visible from phone or tablet on site.' },
      { icon: 'fa-camera', label: 'Proof', title: 'Photo attachments', text: 'Field photos tied to job ID — not lost in personal camera rolls.' },
      { icon: 'fa-file-pdf', label: 'Reports', title: 'PDF job reports', text: 'Branded completion packets with photos and notes for portals and property managers.' },
      { icon: 'fa-credit-card', label: 'Billing', title: 'Stripe invoice automation', text: 'Completed job status triggers invoice draft or payment link with status synced back to the record.' },
      { icon: 'fa-tachometer-alt', label: 'Owner view', title: 'Workflow visibility', text: 'Open jobs, overdue invoices, and bottlenecks on an owner dashboard.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Active build',
        title: 'Vendoroo-style vendor workflow',
        text: 'Active build for portal ticket intake, mobile jobs, photo capture, PDF proof, and Stripe invoices — representative of this service lane (implementation not in public repo).',
        bullets: ['Ticket queue with mobile-friendly updates', 'Photo and PDF proof per job', 'Invoice trigger on completion milestone'],
        media: images.jns
      },
      {
        kicker: 'Payments',
        title: 'Stripe from completed work',
        text: 'Payment links and paid status reflected on the job record so office staff stops chasing spreadsheets.',
        align: 'right',
        media: { ...videos.email, title: 'Ops notification flow', text: 'Status and payment events routed to the right owner view.' }
      }
    ],
    process: [
      { title: 'Intake mapping', text: 'Document how tickets arrive — portal, email, phone — and what fields crews need on site.' },
      { title: 'Mobile job flow', text: 'Status steps, photo requirements, and assignment rules your field team will actually follow.' },
      { title: 'PDF & portal formats', text: 'Branded proof packets aligned to property manager or portal upload requirements.' },
      { title: 'Invoice automation', text: 'Stripe triggers, customer delivery, and paid/overdue reporting on the job record.' }
    ],
    idealFor: [
      'Property maintenance vendors working through portal tickets',
      'Field crews that need mobile proof without a heavy FSM platform',
      'Owners tired of rebuilding invoices after every completed job',
      'Subcontractors scaling beyond text-thread job tracking'
    ],
    proof: {
      title: 'Vendoroo ticket & invoice system',
      text: 'Active internal build covering ticket intake, mobile jobs, photos, PDF reports, and Stripe invoicing — the reference implementation for this lane.',
      image: images.jns.src,
      imageAlt: 'Contractor job workflow reference',
      badge: 'Active build',
      href: '/case-study-vendoroo-ticket-invoice-system',
      linkLabel: 'Vendoroo case study'
    },
    faq: [
      { q: 'Does this replace ServiceTitan or Jobber?', a: 'We build lean workflows for portal-heavy vendors who do not need enterprise FSM — often at lower cost and tighter fit.' },
      { q: 'Can crews use phones only?', a: 'Yes — mobile job updates and photo capture are browser-first so crews are not forced into another app store install.' },
      { q: 'Is Vendoroo code available?', a: 'Vendoroo is an active build used as the reference case study; implementation details are not in the public repo.' }
    ],
    links: [
      ['/stripe-invoice-automation', 'Stripe Invoice Automation'],
      ['/job-photo-pdf-reports', 'Job Photo & PDF Reports'],
      ['/contractor-growth-systems', 'Contractor Growth Systems'],
      ['/book-consultation', 'Plan a Workflow Build']
    ],
    cta: { title: 'Planning a ticket-to-invoice workflow?', text: 'Describe your portal, crew size, and billing process — we will scope the leanest job system.' }
  },
  {
    slug: 'referral-network-systems',
    title: 'Referral Network Systems',
    meta: 'Referral tracking with QR brochures, /ref/:partner paths, Neon Postgres events, referral-dashboard payouts, and Stripe webhook settlement.',
    eyebrow: 'Partner growth',
    h1: 'Referral Network & Tracking Systems',
    lead: 'Stronger than a static referral page — partner codes, QR brochures, tracked landing paths, attribution dashboards, and payout visibility with Stripe webhook settlement.',
    heroIcon: 'fa-handshake',
    stats: [
      { value: '/ref/:partner', label: 'Tracked entry paths' },
      { value: 'Neon', label: 'Postgres event log' },
      { value: 'QR', label: 'Brochure-ready links' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Partner referrals are impossible to attribute fairly',
      text: 'Brochure QR scans, word-of-mouth, and form fills all look the same in analytics. Partners dispute who sent the lead. Payout status lives in spreadsheets.',
      bullets: [
        'No unique path per partner or trade lane',
        'Consult forms do not carry referral codes reliably',
        'Payout earned vs paid is unclear to partners',
        'Scaling a local trade network without attribution breaks trust'
      ],
      media: videos.referral
    },
    features: [
      { icon: 'fa-qrcode', label: 'Entry', title: 'QR brochures & codes', text: 'Print-ready QR links and partner codes that attribute every consult to the right source.' },
      { icon: 'fa-link', label: 'Routing', title: '/ref/:partner paths', text: 'Branded landing paths with tracked forms — not generic UTM hacks.' },
      { icon: 'fa-database', label: 'Events', title: 'Neon Postgres logging', text: 'Scan, form, and conversion events stored for reporting and dispute resolution.' },
      { icon: 'fa-tachometer-alt', label: 'Dashboard', title: 'Referral dashboard', text: '/referral-dashboard with partner visibility into leads, status, and payout progress.' },
      { icon: 'fa-money-check-alt', label: 'Payouts', title: 'Stripe webhook payouts', text: 'Earned referral fees tracked with webhook-driven payout status.' },
      { icon: 'fa-network-wired', label: 'Network', title: 'Local partner network', text: 'Framework for trusted Tampa Bay trade partners routing work responsibly.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Live system',
        title: 'Referral dashboard & partner paths',
        text: 'The same referral infrastructure behind Knight Logics partner program — QR, codes, events, and payout visibility in production.',
        media: { ...videos.referral, title: 'Partner attribution dashboard', text: 'See which partners and QR scans produce consults.' }
      }
    ],
    process: [
      { title: 'Partner rules & fees', text: 'Document attribution windows, fee structure, and who owns the customer relationship.' },
      { title: 'Codes & landing paths', text: 'Deploy /ref/:partner routes and brochure QR assets per partner.' },
      { title: 'Event logging & dashboard', text: 'Neon Postgres events and referral-dashboard views for partners and owners.' },
      { title: 'Payout workflow', text: 'Stripe webhook settlement with clear earned vs paid reporting.' }
    ],
    idealFor: [
      'Trades with complementary partners who send real work',
      'Businesses printing brochures or yard signs with QR CTAs',
      'Owners scaling referral fees without spreadsheet disputes',
      'Networks testing Knight Local Partner Network concepts'
    ],
    proof: {
      title: 'Referral network system in production',
      text: 'QR brochures, partner codes, Neon event logging, and referral-dashboard payout visibility — live behind Knight Logics partner program.',
      image: images.logo.src,
      imageAlt: 'Knight Logics referral systems',
      badge: 'Live workflow',
      href: '/case-study-referral-network-system',
      linkLabel: 'Referral system case study'
    },
    faq: [
      { q: 'How do partners check their referrals?', a: 'Partners use /referral-dashboard for lead status, attribution, and payout progress tied to their code or QR path.' },
      { q: 'What counts as a attributed lead?', a: 'Rules are documented upfront — typically tracked form submits or booked consults within the agreed window from /ref/:partner entry.' },
      { q: 'Can this work without Stripe payouts?', a: 'Yes — attribution and dashboard visibility can launch first; Stripe webhook payouts add automated settlement when you are ready.' }
    ],
    links: [
      ['/referral-program', 'Join Referral Program'],
      ['/case-study-referral-network-system', 'Referral Case Study'],
      ['/business-growth-systems', 'Growth Systems'],
      ['/automation', 'Automation Systems']
    ],
    cta: { title: 'Building a partner referral network?', text: 'We will scope codes, QR assets, dashboard access, and payout rules for your trade lane.' }
  },
  {
    slug: 'local-visibility-systems',
    title: 'Local Visibility Systems',
    meta: 'Local visibility combining technical SEO, Google Business Profile, review flows, and service-area page strategy for Tampa Bay businesses.',
    eyebrow: 'Find · trust · call',
    h1: 'Local Visibility Systems',
    lead: 'Outcome-based local discovery — show up in search, earn map trust, get calls, and align your website geography with what Google expects.',
    heroIcon: 'fa-map-marked-alt',
    heroImage: images.faithWorks,
    stats: [
      { value: '82', label: 'Pages — Faith Works example' },
      { value: 'GBP', label: 'Profile alignment' },
      { value: 'Schema', label: 'Structured data' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Local SEO fails when the site and GBP tell different stories',
      text: 'Thin city pages, missing schema, crawl blockers, and a Google Business Profile that does not match your service areas — map visibility stalls even with a decent website.',
      bullets: [
        'Service-area pages are keyword spam instead of useful geography',
        'Reviews are not requested systematically after jobs',
        'Search Console errors sit unfixed for months',
        'Internal links do not connect services to cities you actually cover'
      ],
      media: images.faithWorks
    },
    features: [
      { icon: 'fa-search', label: 'Technical', title: 'Local SEO cleanup', text: 'Crawl fixes, metadata, schema, internal links, and sitemap hygiene tied to Search Console signals.' },
      { icon: 'fa-store', label: 'Maps', title: 'Google Business Profile', text: 'Categories, services, descriptions, reviews, Q&A, posts, photos, and website alignment.' },
      { icon: 'fa-star', label: 'Reputation', title: 'Review request flow', text: 'Timing rules and GBP-aligned links after completed jobs — without spamming customers.' },
      { icon: 'fa-map', label: 'Geography', title: 'Service-area strategy', text: 'City and county pages that match real coverage — see Faith Works 82-page land clearing footprint.' },
      { icon: 'fa-chart-line', label: 'Measurement', title: 'Audit & reporting', text: 'Search Console, analytics, and next steps tied to calls and form fills.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Deep local footprint',
        title: 'Faith Works: 82 land-clearing pages',
        text: 'Wide service-area SEO for excavation and land clearing — useful geography pages, not doorway spam.',
        media: images.faithWorks
      },
      {
        kicker: 'Screen & pool trades',
        title: 'Screen Team city & service depth',
        text: 'Deep service and city pages for pool enclosure trades across Tampa Bay metros.',
        align: 'right',
        media: images.screenTeam
      }
    ],
    process: [
      { title: 'GBP & site audit', text: 'Compare profile categories, service areas, and website messaging for conflicts.' },
      { title: 'Technical fixes', text: 'Resolve crawl blockers, schema gaps, and indexing issues from Search Console.' },
      { title: 'Page architecture', text: 'Build service silos and geography pages with internal linking hubs.' },
      { title: 'Review & iteration', text: 'Launch review request timing and monthly visibility reporting.' }
    ],
    idealFor: [
      'Contractors with wide service radii needing geography depth',
      'Businesses with GBP profiles that never match the website',
      'Owners who want map-pack progress measured in calls, not rankings alone',
      'Trades investing in long-term local authority, not quick spam pages'
    ],
    proof: {
      title: 'Faith Works outdoor services SEO footprint',
      text: '82 pages of land clearing and site work geography — a reference for large service-area strategy done responsibly.',
      image: images.faithWorks.src,
      imageAlt: 'Faith Works local SEO site',
      badge: '82 pages',
      href: '/case-study-faith-works',
      linkLabel: 'Faith Works case study'
    },
    faq: [
      { q: 'How many city pages do I need?', a: 'It depends on real coverage — Screen Team uses deep Tampa Bay metros; Faith Works uses 82 pages for wide land clearing. We scope to geography you actually serve.' },
      { q: 'Do you manage GBP posting?', a: 'GBP alignment, categories, and review strategy are in scope; ongoing post cadence can be added or handled via Social Poster where appropriate.' },
      { q: 'Is this separate from the website build?', a: 'Local visibility can start with an audit or run alongside a new site — the goal is one coherent local story across site and profile.' }
    ],
    links: [
      ['/service-local-seo', 'Local SEO Services'],
      ['/service-area-page-strategy', 'Service Area Strategy'],
      ['/review-request-systems', 'Review Request Systems'],
      ['/website-growth-audit', 'Free Growth Audit']
    ],
    cta: { title: 'Want clearer local visibility?', text: 'Start with a growth audit — we will map GBP gaps, page architecture, and review opportunities.' }
  },
  {
    slug: 'website-growth-audit',
    title: 'Website & Business Growth Audit',
    meta: 'Free website and business growth audit for Tampa Bay — clarity, SEO, GBP, lead capture, automation gaps, and prioritized next steps.',
    eyebrow: 'Start here',
    h1: 'Website & Business Growth Audit',
    lead: 'More than a PageSpeed score — we review message clarity, SEO structure, GBP alignment, lead capture, follow-up, referrals, automation bottlenecks, and tracking gaps.',
    heroIcon: 'fa-magnifying-glass-chart',
    stats: [
      { value: 'Free', label: 'Initial audit tier' },
      { value: '96', label: 'Lighthouse — Knight Group' },
      { value: 'Written', label: 'Prioritized next steps' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Owners get generic SEO reports that ignore how the business sells',
      text: 'Automated scanners flag minified CSS but miss the real issues — unclear offers, broken forms, GBP mismatches, and no follow-up when leads arrive.',
      bullets: [
        'Homepage does not say who you serve or what to do next',
        'Search Console shows indexing errors nobody fixed',
        'Google Business Profile categories conflict with the website',
        'Leads arrive with no CRM or review request path'
      ],
      media: images.kgHero
    },
    features: [
      { icon: 'fa-bullseye', label: 'Message', title: 'Website clarity', text: 'Homepage offer, service structure, CTAs, and mobile usability reviewed against how you actually sell.' },
      { icon: 'fa-sitemap', label: 'Index', title: 'SEO & indexing', text: 'Technical SEO, schema, sitemap, Search Console signals, and crawl issues.' },
      { icon: 'fa-store', label: 'Maps', title: 'GBP alignment', text: 'Profile vs site comparison for categories, service areas, and trust signals.' },
      { icon: 'fa-funnel-dollar', label: 'Leads', title: 'Lead & follow-up', text: 'Forms, call paths, CRM gaps, and missed follow-up opportunities.' },
      { icon: 'fa-rocket', label: 'Growth', title: 'Systems opportunities', text: 'Referral flow, outreach readiness, automation bottlenecks, and practical recommendations.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Benchmark example',
        title: 'What good looks like — Knight Group',
        text: '97 indexable pages, Lighthouse 96/100/100, booking flow, schema, and outreach-ready structure — used as a benchmark during audits.',
        media: images.kgHero
      }
    ],
    process: [
      { title: 'Intake & access', text: 'Site URL, GBP link, analytics access if available, and how leads arrive today.' },
      { title: 'Technical & message review', text: 'Crawl, schema, speed, and conversion path documented with screenshots.' },
      { title: 'Systems gap map', text: 'CRM, email, referral, and automation opportunities ranked by impact.' },
      { title: 'Written recommendations', text: 'Prioritized next steps with optional phased build estimate.' }
    ],
    idealFor: [
      'Owners unsure whether they need a redesign or systems build',
      'Businesses launching outreach or referrals for the first time',
      'Trades comparing agency proposals without a technical baseline',
      'Anyone before signing a long-term growth contract'
    ],
    proof: {
      title: 'Audits tied to live build standards',
      text: 'Recommendations reference real Knight Logics client work — Knight Group Lighthouse 96, Screen Team geography depth, Faith Works 82-page SEO.',
      image: images.screenTeam.src,
      imageAlt: 'Screen Team local service site',
      badge: 'Live benchmarks',
      href: '/case-study-screen-team',
      linkLabel: 'Screen Team case study'
    },
    faq: [
      { q: 'Is the audit really free?', a: 'Yes — the initial website and growth audit tier is free. Deeper technical dives or competitive research may be quoted separately.' },
      { q: 'How long until I get results?', a: 'Most audits return within a few business days with written priorities — faster if analytics and Search Console access are ready.' },
      { q: 'Do you implement what you recommend?', a: 'You can hire Knight Logics for the build or use the audit with another vendor — the report is yours either way.' }
    ],
    links: [
      ['/book-consultation', 'Book Consultation'],
      ['/business-growth-systems', 'Growth Systems'],
      ['/local-visibility-systems', 'Local Visibility'],
      ['/case-study-knight-group', 'Knight Group Example']
    ],
    pricingNote: 'Free initial audit tier — implementation quoted separately based on prioritized lanes.',
    cta: { title: 'Request your growth audit', text: 'Share your site and how you get customers today. We will return prioritized fixes and system opportunities.' }
  },
  {
    slug: 'online-ordering-systems',
    title: 'E-Commerce & Online Ordering Systems',
    meta: 'E-commerce and online ordering for Tampa Bay restaurants, retailers, and product businesses — Stripe, admin editing, events, and checkout flows.',
    eyebrow: 'Commerce & ordering',
    h1: 'E-Commerce & Online Ordering Systems',
    lead: 'Flexible ordering and storefront systems — resin tables and product catalogs to restaurant events, pickup orders, and admin-editable menus without bloated platforms.',
    heroIcon: 'fa-cart-shopping',
    heroImage: images.moms,
    stats: [
      { value: 'Stripe', label: 'Checkout & payments' },
      { value: 'Admin', label: 'Editable menus & events' },
      { value: 'Hand-coded', label: 'No template lock-in' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Restaurant and retail sites stall at PDF menus and manual orders',
      text: 'Hospitality and product businesses outgrow brochure sites — but full POS platforms are expensive and rigid. Owners need ordering, events, and editable content without rebuilding every year.',
      bullets: [
        'Menu changes require a developer for every special',
        'Events and hours are buried or outdated',
        'Checkout is phone-only while competitors take online orders',
        'No room to add Toast or POS integrations later'
      ],
      media: images.moms
    },
    features: [
      { icon: 'fa-store', label: 'Retail', title: 'Custom storefronts', text: 'Hand-coded shops with Stripe, inventory logic, and conversion-focused product pages — see Mom\'s Resin Tables.' },
      { icon: 'fa-utensils', label: 'Hospitality', title: 'Restaurant & bar systems', text: 'Events, menus, ordering flows, and admin content editing — hospitality system pattern in active development.' },
      { icon: 'fa-credit-card', label: 'Payments', title: 'Checkout & Stripe', text: 'Payment links, checkout flows, and order confirmation without platform transaction bloat.' },
      { icon: 'fa-pen-to-square', label: 'Control', title: 'Admin-editable content', text: 'Menus, events, and specials your team updates without touching code.' },
      { icon: 'fa-plug', label: 'Future', title: 'Integration-ready', text: 'Architecture leaves room for Toast or POS hooks as volume grows.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Live storefront',
        title: "Mom's Resin Tables e-commerce",
        text: 'Product catalog, Stripe checkout, and brand-forward product pages for a live retail client.',
        media: images.moms
      },
      {
        kicker: 'Hospitality lane',
        title: 'Restaurant & bar ordering pattern',
        text: 'Admin-editable menus, events calendar, and Stripe-ready pickup on an owned domain — scoped in restaurant-bar-growth-systems.',
        align: 'right',
        media: images.hospitalityMenus
      }
    ],
    process: [
      { title: 'Offer & order flow', text: 'Map pickup, delivery, catering, or product checkout paths and admin edit needs.' },
      { title: 'Storefront or menu build', text: 'Hand-coded pages with Stripe and mobile-first ordering UX.' },
      { title: 'Admin patterns', text: 'Editable menus, events, and inventory areas your staff can maintain.' },
      { title: 'Launch & POS path', text: 'Go live with analytics; document future POS integration options.' }
    ],
    idealFor: [
      'Restaurants and bars needing events plus order-ahead flows',
      'Product businesses outgrowing Etsy or social-only sales',
      'Owners who want admin control without Shopify bloat',
      'Brands planning POS integration in a later phase'
    ],
    proof: {
      title: "Mom's Resin Tables live storefront",
      text: 'Hand-coded e-commerce with Stripe and product-focused conversion — a reference for retail ordering systems.',
      image: images.moms.src,
      imageAlt: "Mom's Resin Tables storefront",
      badge: 'Live client',
      href: '/case-study-moms-resin-tables',
      linkLabel: 'View storefront case study'
    },
    faq: [
      { q: 'Do you build on Shopify or WooCommerce?', a: 'We hand-code lean storefronts with Stripe for owners who want speed, control, and lower platform fees — not plugin maintenance.' },
      { q: 'Can staff update menus without calling you?', a: 'Yes — admin-editable content patterns are core to restaurant and bar builds in the hospitality lane.' },
      { q: 'What about delivery apps?', a: 'We focus on owned ordering first; third-party app integrations can be scoped if they fit your volume.' }
    ],
    links: [
      ['/restaurant-bar-growth-systems', 'Restaurant & Bar Systems'],
      ['/service-ecommerce', 'E-Commerce Development'],
      ['/case-study-hospitality-system-pattern', 'Hospitality System Pattern'],
      ['/book-consultation', 'Plan Your Storefront']
    ],
    cta: { title: 'Planning ordering or a storefront?', text: 'Tell us your menu, product catalog, and how you want customers to check out.' }
  },
  {
    slug: 'contractor-growth-systems',
    title: 'Contractor Growth Systems',
    meta: 'Contractor growth systems for Tampa Bay trades — websites, local SEO, lead capture, CRM outreach, and job workflow automation.',
    eyebrow: 'Trades & contractors',
    h1: 'Contractor & Field Trade Growth Systems',
    lead: 'Trade playbooks for Tampa Bay contractors — launch your presence, publish a case study when ready, and join a referral network where complementary trades send attributed work.',
    heroIcon: 'fa-hard-hat',
    heroImage: images.jns,
    stats: [
      { value: '11', label: 'Pages — JNS bundle' },
      { value: '97', label: 'Indexable pages — KG sitemap' },
      { value: 'Trades', label: 'Live case studies' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Contractor websites look fine but do not sell or track work',
      text: 'Template sites hide services, skip city pages, and dump form leads into email with no follow-up. Field work still runs on texts and spreadsheets.',
      bullets: [
        'Service areas do not match how far crews actually travel',
        'No CRM outreach to property managers or complementary trades',
        'Portal tickets and invoices disconnected from the website brand',
        'Referral partners have no tracked path back to your business'
      ],
      media: images.jns
    },
    features: [
      { icon: 'fa-globe', label: 'Web', title: 'Trade-focused websites', text: 'Service pages, service-area SEO, call-first CTAs, and proof aligned to estimate-first sales.' },
      { icon: 'fa-map-marker-alt', label: 'Local', title: 'Map visibility', text: 'Google Business alignment, schema, and city pages for Tampa Bay metros.' },
      { icon: 'fa-paper-plane', label: 'Leads', title: 'CRM & outreach', text: 'OutreachEngine campaigns and form tracking for managers, HOAs, and partner trades.' },
      { icon: 'fa-clipboard-list', label: 'Ops', title: 'Job workflows', text: 'Ticket intake, photos, PDF proof, and Stripe invoices for vendor portal work.' },
      { icon: 'fa-qrcode', label: 'Referrals', title: 'Partner QR systems', text: 'Track complementary trades sending recurring work.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Handyman benchmark',
        title: 'Knight Group — 97 indexable pages, Lighthouse 96/100/100',
        text: 'Booking, schema, outreach-ready structure, and KG-branded CRM campaigns.',
        media: images.kgHero
      },
      {
        kicker: 'Contractor bundle',
        title: 'JNS Construction — 11-page launch',
        text: 'Focused contractor website bundle with service clarity and conversion paths.',
        align: 'right',
        media: images.jns
      }
    ],
    process: [
      { title: 'Trade & territory mapping', text: 'Services, metros, and estimate flow documented before page architecture.' },
      { title: 'Site & local launch', text: 'Service silos, city pages, GBP alignment, and call/form CTAs.' },
      { title: 'Lead systems', text: 'CRM outreach, referral paths, and follow-up queues as needed.' },
      { title: 'Field ops layer', text: 'Job tracking, photos, and invoicing for portal-heavy vendors.' }
    ],
    idealFor: [
      'Tampa Bay trades selling estimates and phone calls',
      'Contractors with vendor portal or property manager work',
      'Owners ready to add outreach beyond word of mouth',
      'Teams outgrowing template sites from national providers'
    ],
    proof: {
      title: 'Screen Team pool enclosure depth',
      text: 'Deep service and city pages for a live screen enclosure company — the contractor local SEO reference.',
      image: images.screenTeam.src,
      imageAlt: 'Screen Team contractor website',
      badge: 'Live client',
      href: '/case-study-screen-team',
      linkLabel: 'Screen Team case study'
    },
    faq: [
      { q: 'Which trade pages do you offer?', a: 'Flagship contractor lane plus sub-pages for handyman, roofing, screen enclosure, and excavation — each scoped to trade-specific sales patterns.' },
      { q: 'Do you handle logo and photos?', a: 'We work with your assets; photo and copy guidance is part of intake. Stock-only sites are not our model.' },
      { q: 'Can you connect outreach to my trade?', a: 'Yes — OutreachEngine supports segmented lists for property managers, HOAs, and complementary trades with KG/KL/ST brand separation.' }
    ],
    links: [
      ['/handyman-business-growth-systems', 'Handyman Lane'],
      ['/electrician-business-growth-systems', 'Electrician Lane'],
      ['/roofing-business-growth-systems', 'Roofing Lane'],
      ['/case-study-jns', 'JNS Case Study'],
      ['/business-growth-systems', 'Full Growth Systems']
    ],
    cta: { title: 'Growing a contractor business?', text: 'Share your trade, service area, and how jobs arrive today — we will map site, SEO, and ops lanes.' }
  },
  {
    slug: 'home-service-business-growth-systems',
    title: 'Home Service Business Growth Systems',
    meta: 'Home service growth systems for Tampa Bay — websites, local SEO, Google Business, CRM outreach, and automation for property-facing trades.',
    eyebrow: 'Home services',
    h1: 'Home Service Trade Growth Systems',
    lead: 'For property-facing trades joining the network — fast sites, map visibility, and referral paths so electricians, painters, cleaners, and repair crews send each other tracked work.',
    heroIcon: 'fa-house-chimney',
    heroImage: images.screenTeam,
    stats: [
      { value: 'Call-first', label: 'Conversion model' },
      { value: 'GBP+SEO', label: 'Map & search' },
      { value: 'CRM', label: 'Outreach ready' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Home service leads are urgent — slow follow-up loses the job',
      text: 'Customers call three competitors. If your form sits unread or your GBP looks inactive, you never get the chance to quote. Repeat work needs review and referral systems too.',
      bullets: [
        'Mobile site hides phone number or service list',
        'After-hours leads have no intake or auto-acknowledge path',
        'Reviews stall because nobody asks at job completion',
        'Referral partners send work with zero attribution'
      ],
      media: images.screenTeam
    },
    features: [
      { icon: 'fa-phone', label: 'Convert', title: 'Conversion-first websites', text: 'Fast hand-coded sites with clear services, trust signals, and prominent call or form CTAs.' },
      { icon: 'fa-map-location-dot', label: 'Discover', title: 'Local SEO & GBP', text: 'Map-pack readiness, service-area pages, and profile cleanup.' },
      { icon: 'fa-envelope', label: 'Outbound', title: 'Lead generation', text: 'CRM outreach and landing pages for estimate-first home service sales.' },
      { icon: 'fa-robot', label: 'Ops', title: 'Operations support', text: 'Follow-up automation, referral tracking, and job workflow tools post-launch.' },
      { icon: 'fa-award', label: 'Proof', title: 'Checkable case studies', text: 'Knight Group, Screen Team, and Faith Works as live references across trades.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Enclosure reference',
        title: 'Screen Team quote-first local SEO',
        text: '36 pages across Tampa Bay metros — st lane outreach and quote CTAs for property-facing enclosure work.',
        align: 'left',
        media: images.screenTeam
      },
      {
        kicker: 'Handyman reference',
        title: 'Knight Group booking & outreach',
        text: '97 indexable pages, Lighthouse 96/100/100, booking integration, and KG outreach that produced real jobs.',
        align: 'right',
        media: images.kgHero
      },
      {
        kicker: 'Land clearing reference',
        title: 'Faith Works wide geography stack',
        text: '82 pages with metro coverage, local SEO depth, and faithworks lane outreach for outdoor services.',
        align: 'left',
        media: images.faithWorks
      }
    ],
    process: [
      { title: 'Service & area clarity', text: 'Document offers, metros, and whether you sell calls, forms, or booking.' },
      { title: 'Launch site & GBP', text: 'Conversion paths, schema, and profile alignment go live together.' },
      { title: 'Lead systems', text: 'Outreach, review requests, and referral paths scaled to your capacity.' },
      { title: 'Ops automation', text: 'Email-Agent, job tracking, and dashboards when volume justifies them.' }
    ],
    idealFor: [
      'Owner-operators and small crews in Tampa Bay home services',
      'Businesses getting calls but losing follow-up discipline',
      'Trades expanding from referrals into outbound prospecting',
      'Teams wanting one partner for site, SEO, and light ops automation'
    ],
    proof: {
      title: 'Knight Group home service growth stack',
      text: 'Handyman site with booking, schema, Lighthouse 96, and live CRM outreach — the home service benchmark.',
      image: images.kgHero.src,
      imageAlt: 'Knight Group home service website',
      badge: 'Lighthouse 96',
      href: '/case-study-knight-group',
      linkLabel: 'Knight Group case study'
    },
    faq: [
      { q: 'How is this different from contractor growth systems?', a: 'Home service lane emphasizes call-first property trades and repeat residential work; contractor lane includes heavier portal and excavation footprints.' },
      { q: 'Do you build booking calendars?', a: 'Yes when estimate flow fits — Knight Group includes booking integration as a reference pattern.' },
      { q: 'Can you run outreach for us?', a: 'We build and configure OutreachEngine; ongoing send operations can be yours or scoped as a managed lane.' }
    ],
    links: [
      ['/home-service-websites', 'Home Service Websites'],
      ['/local-visibility-systems', 'Local Visibility'],
      ['/handyman-business-growth-systems', 'Handyman Systems'],
      ['/website-growth-audit', 'Free Growth Audit']
    ],
    cta: { title: 'Growing a home service company?', text: 'Tell us your services, service area, and how customers find you today.' }
  },
  {
    slug: 'performance-partner-program',
    title: 'Performance Partner Program',
    meta: 'Performance-based partnership for Tampa Bay businesses — base fee, 90-day measurement window, clear attribution, and monthly reporting.',
    eyebrow: 'Partnership model',
    h1: 'Performance Partner Program',
    lead: 'For businesses that want shared upside with clear rules — base monthly fee, 90-day measurement window, baseline before work starts, and written scope on what counts as performance.',
    heroIcon: 'fa-chart-line',
    stats: [
      { value: '90-day', label: 'Measurement window' },
      { value: 'Written', label: 'Attribution rules' },
      { value: 'Monthly', label: 'Reporting cadence' }
    ],
    problem: {
      kicker: 'The problem',
      title: 'Agency retainers rarely tie fees to measurable outcomes',
      text: 'Owners pay monthly without knowing what changed. Performance promises stay vague. Attribution fights start when leads increase but nobody documented the baseline.',
      bullets: [
        'No baseline captured before work begins',
        'Performance metrics undefined or unmeasurable',
        'Reporting is vanity traffic instead of calls and bookings',
        'Cancellation and dispute terms unclear upfront'
      ],
      media: images.logo
    },
    features: [
      { icon: 'fa-file-contract', label: 'Structure', title: 'Base + performance fee', text: 'Predictable base for systems work with a performance component tied to agreed metrics.' },
      { icon: 'fa-calendar-check', label: 'Window', title: '90-day measurement', text: 'Baseline captured before launch; results measured inside a defined window — not moving goalposts.' },
      { icon: 'fa-bullseye', label: 'Metrics', title: 'What counts', text: 'Defined lead, call, booking, or revenue signals with attribution documented in writing.' },
      { icon: 'fa-chart-pie', label: 'Reporting', title: 'Monthly dashboard', text: 'Tracked outcomes, caps, failures, and next actions — readable by ownership.' },
      { icon: 'fa-scale-balanced', label: 'Terms', title: 'Limits & disputes', text: 'Minimum term, cancellation, monthly cap, and dispute process agreed before work starts.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Systems required',
        title: 'Performance needs tracking infrastructure',
        text: 'Partnership fit assumes growth systems exist or will be built — CRM, analytics, referral attribution, and reporting from the Business Growth Systems lane.',
        bullets: ['Knight Command-style visibility for queue and lead sources', 'Outreach and referral attribution for defensible metrics', 'Monthly owner review tied to real ops data'],
        media: { ...videos.crm, title: 'Reporting foundation', text: 'Dashboards that support performance measurement.' }
      }
    ],
    process: [
      { title: 'Fit & baseline', text: 'Audit current leads, tracking gaps, and whether metrics are measurable.' },
      { title: 'Written terms', text: 'Define base fee, performance component, attribution, caps, and window.' },
      { title: 'Systems launch', text: 'Deploy or fix tracking, outreach, and reporting before performance clock starts.' },
      { title: 'Monthly review', text: 'Report outcomes, adjust tactics, and document next 90-day priorities.' }
    ],
    idealFor: [
      'Owners who want accountability beyond a standard retainer',
      'Businesses with measurable call, form, or booking volume',
      'Teams willing to implement tracking and follow-up discipline',
      'Growth system clients ready for a long-term partnership lane'
    ],
    proof: {
      title: 'Built on measurable growth systems',
      text: 'Performance partnership assumes the same infrastructure behind Knight Group outreach and referral attribution — not marketing without instrumentation.',
      image: images.kgHero.src,
      imageAlt: 'Knight Group measurable growth',
      badge: 'Systems-first',
      href: '/case-study-knight-group',
      linkLabel: 'See measurable client work'
    },
    faq: [
      { q: 'What metrics qualify for performance?', a: 'Typically tracked calls, form submits, booked consults, or attributed revenue — defined in writing before the 90-day window starts.' },
      { q: 'Is there a minimum term?', a: 'Yes — partnership terms include minimum term, cancellation rules, and monthly caps documented in the agreement.' },
      { q: 'Can I start with a standard project instead?', a: 'Absolutely — many clients begin with website-growth-audit or business-growth-systems before exploring performance partnership fit.' }
    ],
    links: [
      ['/pricing', 'Standard Pricing'],
      ['/business-growth-systems', 'Growth Systems Scope'],
      ['/website-growth-audit', 'Free Growth Audit'],
      ['/book-consultation', 'Discuss Partnership Fit']
    ],
    pricingNote: 'Base monthly fee plus performance component — terms, caps, and attribution defined in writing before launch.',
    cta: { title: 'Exploring a performance partnership?', text: 'Book a consult with your current lead volume, tracking setup, and growth goals.' }
  }
];

const subPages = [
  {
    slug: 'ai-business-automation',
    parent: { href: '/service-ai-automation', label: 'AI Automation' },
    title: 'AI Business Automation',
    meta: 'AI business automation for Tampa Bay small businesses — practical workflow triggers, inbox assist, and guardrails tied to CRM and email ops.',
    eyebrow: 'Automation lane',
    h1: 'AI Business Automation for Real Operations',
    lead: 'Targeted automation where rules are clear — queue assistance, reply surfacing, and workflow triggers wired to OutreachEngine, Email-Agent, and Knight Command tabs.',
    heroIcon: 'fa-robot',
    problem: {
      kicker: 'The hype gap',
      title: 'Generic AI demos do not match how your office actually works',
      text: 'Off-the-shelf AI tools hallucinate on job details and bypass approval steps. Useful automation needs guardrails, logging, and hooks into CRM and email systems you already run.',
      bullets: [
        'Chatbots answer customers with wrong pricing or service areas',
        'No human approval on outbound or customer-facing actions',
        'AI siloed from CRM queues and Email-Agent routing',
        'Automation volume unchecked until sender reputation breaks'
      ],
      media: { ...videos.crm, title: 'Ops-aware automation', text: 'Triggers tied to live queue data — not disconnected chat widgets.' }
    },
    features: [
      { icon: 'fa-bolt', label: 'Triggers', title: 'Workflow triggers', text: 'Automate repetitive decisions when rules are explicit and mistake cost is low.' },
      { icon: 'fa-inbox', label: 'Inbox', title: 'Reply assist & sorting', text: 'Surface CRM replies and urgent threads inside Email-Agent views on port 5100.' },
      { icon: 'fa-file-lines', label: 'Reports', title: 'Reporting assist', text: 'Turn queue depth and campaign stats into owner-readable summaries.' },
      { icon: 'fa-user-shield', label: 'Safety', title: 'Guardrails & caps', text: 'Human approval steps, logging, and send caps so automation stays trustworthy.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Connected stack',
        title: 'Automation inside Knight Command',
        text: 'AI-assisted workflows embed alongside Outreach CRM, Email Agent, and Social Ops — not a standalone toy app.',
        media: videos.crm
      }
    ],
    process: [
      { title: 'Process audit', text: 'Identify high-volume steps with clear rules and low risk of customer-facing errors.' },
      { title: 'Integration map', text: 'Wire triggers to Flask CRM, Email-Agent, or job queues with logging.' },
      { title: 'Guardrail design', text: 'Approval steps, caps, and failure alerts before autonomous actions go live.' },
      { title: 'Measure & tune', text: 'Review time saved vs errors monthly and adjust thresholds.' }
    ],
    idealFor: [
      'Businesses already on Knight Logics CRM or Email-Agent stack',
      'Owners drowning in inbox sorting and queue triage',
      'Teams with repeatable intake rules — not ambiguous consult selling',
      'Operators who want assistive AI, not unsupervised customer chatbots'
    ],
    proof: {
      title: 'Knight Command multi-tab ops shell',
      text: 'Command Center, Outreach CRM, Email Agent, and Social Poster tabs show how automation embeds into daily operator workflows.',
      image: images.logo.src,
      imageAlt: 'Knight Logics automation stack',
      badge: 'Internal system',
      href: '/case-study-knight-command',
      linkLabel: 'Knight Command case study'
    },
    faq: [
      { q: 'Do you deploy ChatGPT wrappers?', a: 'No — we automate defined ops steps with logging and integrations. Customer-facing AI is scoped only with explicit guardrails.' },
      { q: 'What systems can AI connect to?', a: 'OutreachEngine, Email-Agent (5100), referral events, and custom job trackers — depending on your stack.' },
      { q: 'Is training included?', a: 'Yes — staff learn approval queues and when to override automated suggestions.' }
    ],
    links: [['/service-ai-automation', 'Automation Services'], ['/workflow-automation', 'Workflow Automation'], ['/email-agent-automation', 'Email-Agent Automation']],
    cta: { title: 'Where should AI save time?', text: 'Describe repetitive decisions your team makes daily — we will scope safe automation hooks.' }
  },
  {
    slug: 'internal-business-tools',
    parent: { href: '/service-ai-automation', label: 'AI Automation' },
    title: 'Internal Business Tools',
    meta: 'Custom internal tools and admin panels — dashboards, trackers, and ops utilities for small business teams.',
    eyebrow: 'Custom software',
    h1: 'Custom Internal Business Tools & Admin Panels',
    lead: 'When spreadsheets and group texts become bottlenecks, we build web-first admin panels, trackers, and role-based views your team uses every day — like Knight Command at /admin.',
    heroIcon: 'fa-table-columns',
    problem: {
      kicker: 'Spreadsheet ceiling',
      title: 'Shared spreadsheets break when more than two people touch them',
      text: 'Version conflicts, no audit trail, and fields that do not match field crew reality — internal ops need purpose-built tools, not another Google Sheet.',
      bullets: [
        'No role separation between owner, office, and field views',
        'Sensitive payout or lead data mixed in one tab',
        'Manual exports to invoice or email tools',
        'Mobile unusable for crews on site'
      ],
      media: images.logo
    },
    features: [
      { icon: 'fa-gauge-high', label: 'Admin', title: 'Admin panels', text: 'Owner and staff views with fields and actions that match your process — Command Center pattern.' },
      { icon: 'fa-list-check', label: 'Queues', title: 'Trackers & queues', text: 'Lead, job, ticket, and payout visibility in one authenticated shell.' },
      { icon: 'fa-users', label: 'Roles', title: 'Role-based views', text: 'Different screens for office staff, field crews, and ownership.' },
      { icon: 'fa-cloud', label: 'Deploy', title: 'Web-first deployment', text: 'Browser tools on desktop and mobile without app store friction.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Reference build',
        title: 'Knight Command tab architecture',
        text: 'Referrals, Outreach CRM, Email Agent, Social Ops, Social Poster, and Logs as modular embeds behind one login.',
        media: images.logo
      }
    ],
    process: [
      { title: 'Workflow interview', text: 'Map who does what, which fields matter, and what must stay owner-only.' },
      { title: 'Wireframes & roles', text: 'Sketch views per role before database or API work.' },
      { title: 'Build & embed', text: 'Deploy panels with secure auth and optional embeds to Flask or Streamlit services.' },
      { title: 'Train & iterate', text: 'Short training cycle then adjust fields based on real usage.' }
    ],
    idealFor: [
      'Owners outgrowing spreadsheets for leads, jobs, or payouts',
      'Teams running multiple localhost or cloud services needing one shell',
      'Businesses wanting referral-dashboard-style visibility for internal ops',
      'Operators preparing to scale without buying enterprise ERP'
    ],
    proof: {
      title: 'Knight Command internal admin shell',
      text: '/admin with tabs for Command Center, Referrals, Outreach CRM, Email Agent, Social Ops, Social Poster, and Logs — embeds on ports 5050, 5100, 8500, 8501.',
      image: images.logo.src,
      imageAlt: 'Knight Command admin',
      badge: 'Live internal',
      href: '/case-study-knight-command',
      linkLabel: 'View Knight Command'
    },
    faq: [
      { q: 'Do you build mobile apps?', a: 'We prioritize responsive web tools crews open in the browser — faster to ship and easier to maintain.' },
      { q: 'Can tools embed our existing software?', a: 'Yes — Knight Command embeds OutreachEngine, Email-Agent, and Social Poster instead of rebuilding them.' },
      { q: 'Who hosts the tools?', a: 'Cloud or your infrastructure depending on security needs — scoped during consult.' }
    ],
    links: [['/service-ai-automation', 'Automation Services'], ['/business-dashboard-development', 'Dashboard Development'], ['/case-study-knight-command', 'Knight Command']],
    cta: { title: 'Need an internal ops panel?', text: 'Walk us through the spreadsheet or tabs you wish one screen could replace.' }
  },
  {
    slug: 'api-integration-services',
    parent: { href: '/service-ai-automation', label: 'AI Automation' },
    title: 'API Integration Services',
    meta: 'API integrations for Stripe, Google, CRMs, webhooks, and third-party business tools — reliable event handling for growth systems.',
    eyebrow: 'Integrations',
    h1: 'API Integration Services for Business Systems',
    lead: 'Connect tools you already pay for — Stripe webhooks, Google APIs, CRM events, and referral payout triggers — so data moves once and lands in the right queue.',
    heroIcon: 'fa-plug',
    problem: {
      kicker: 'Data silos',
      title: 'Manual re-entry between Stripe, Google, and CRM wastes hours',
      text: 'Paid invoices do not update job records. Search Console data never informs site fixes. Referral payouts need Stripe webhooks — not copy-paste from dashboards.',
      bullets: [
        'Payment status checked manually in Stripe dashboard',
        'GBP and Analytics disconnected from site change workflow',
        'Webhook failures silent until customers complain',
        'Multi-brand CRM events not mapped to correct inboxes'
      ],
      media: { ...videos.email, title: 'Event routing', text: 'Email-Agent and webhook paths for business-critical events.' }
    },
    features: [
      { icon: 'fa-credit-card', label: 'Payments', title: 'Stripe & webhooks', text: 'Checkout, invoices, referral payout webhooks, and payment-status sync on job records.' },
      { icon: 'fa-google', label: 'Google', title: 'Google stack APIs', text: 'Analytics, Search Console, Business Profile, Drive, and Gmail integrations where needed.' },
      { icon: 'fa-address-book', label: 'CRM', title: 'CRM & outreach events', text: 'Lead sync, reply events, bounce flags, and campaign logging for OutreachEngine.' },
      { icon: 'fa-server', label: 'Reliability', title: 'Webhooks & retries', text: 'Event queues with retries and failure alerts — especially for referral and invoice flows.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Referral payouts',
        title: 'Stripe webhook settlement',
        text: 'Referral network system uses Stripe webhooks to track earned vs paid partner fees in Neon Postgres-backed events.',
        media: videos.referral
      }
    ],
    process: [
      { title: 'System inventory', text: 'List tools, credentials, and which direction data must flow.' },
      { title: 'Event mapping', text: 'Define webhook payloads, idempotency, and failure alerts.' },
      { title: 'Integration build', text: 'Implement and test in staging with real sample events.' },
      { title: 'Monitor & document', text: 'Runbook for failures and owner-visible last-success timestamps.' }
    ],
    idealFor: [
      'Businesses running Stripe plus custom job or referral trackers',
      'Teams connecting OutreachEngine or Email-Agent to external CRMs',
      'Owners needing Google Search Console data in growth workflows',
      'Referral programs ready for automated payout status'
    ],
    proof: {
      title: 'Referral network Stripe webhooks',
      text: 'Partner payout visibility tied to Stripe events and Neon Postgres logging — live referral infrastructure.',
      image: images.logo.src,
      imageAlt: 'API integration referral system',
      badge: 'Live integration',
      href: '/case-study-referral-network-system',
      linkLabel: 'Referral integration case study'
    },
    faq: [
      { q: 'Do you integrate Zapier instead of custom code?', a: 'We prefer direct integrations for critical paths — webhooks, CRM, and payments — with logging you control.' },
      { q: 'Can you connect Microsoft or Zoho email?', a: 'Email-Agent supports Gmail, Zoho, and Microsoft with brand mapping KL/KG/ST for routed views.' },
      { q: 'What about API rate limits?', a: 'We design queues and backoff for Google and social APIs — especially Social Poster runners.' }
    ],
    links: [['/service-ai-automation', 'Automation Services'], ['/stripe-invoice-automation', 'Stripe Automation'], ['/crm-outreach-lead-generation', 'CRM Outreach']],
    cta: { title: 'Which systems need to talk?', text: 'List your tools and manual copy-paste steps — we will map integration scope.' }
  },
  {
    slug: 'workflow-automation',
    parent: { href: '/service-ai-automation', label: 'AI Automation' },
    title: 'Workflow Automation',
    meta: 'Workflow automation for intake, assignment, follow-up, file capture, and status updates — tied to real small business operations.',
    eyebrow: 'Process automation',
    h1: 'Workflow Automation for Small Business Operations',
    lead: 'Automate weekly repetition — form to folder, ticket to crew, job complete to review request, stale lead to follow-up — with monitoring when steps fail.',
    heroIcon: 'fa-diagram-project',
    problem: {
      kicker: 'Manual repetition',
      title: 'Every job type reinvents the same ten steps',
      text: 'Intake, assign, photograph, invoice, and review request should be template-driven. When they are manual, balls drop whenever someone is on vacation.',
      bullets: [
        'Form submits sit until someone remembers to check',
        'Photo proof not attached before invoice goes out',
        'Review requests sent randomly or not at all',
        'Follow-up on stale quotes inconsistent'
      ],
      media: videos.crm
    },
    features: [
      { icon: 'fa-inbox', label: 'Intake', title: 'Intake to action', text: 'Form or ticket in → record created → owner notified → tracker updated automatically.' },
      { icon: 'fa-repeat', label: 'Follow-up', title: 'Follow-up sequences', text: 'Quote reminders, stale-lead nudges, and outreach followup scheduler jobs.' },
      { icon: 'fa-camera', label: 'Files', title: 'File capture', text: 'Photos, PDFs, and proofs attached to the correct job or ticket record.' },
      { icon: 'fa-bell', label: 'Monitor', title: 'Failure monitoring', text: 'Alerts when automation steps fail before missed revenue.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Outreach cadence',
        title: 'first_touch and followup scheduler',
        text: 'OutreachEngine scheduler drives first_touch and followup sends with daily caps and bounce detection.',
        media: videos.crm
      }
    ],
    process: [
      { title: 'Process documentation', text: 'Write the happy path for each job or lead type.' },
      { title: 'Trigger design', text: 'Define events — form, status change, timer — that start each workflow.' },
      { title: 'Build & test', text: 'Implement with failure logging and owner notifications.' },
      { title: 'Staff rollout', text: 'Simple overrides when automation needs human judgment.' }
    ],
    idealFor: [
      'Service businesses with repeating intake patterns',
      'Teams using OutreachEngine needing follow-up discipline',
      'Vendors with portal tickets and photo proof requirements',
      'Owners who want review requests timed to job completion'
    ],
    proof: {
      title: 'CRM outreach follow-up workflow',
      text: 'Scheduler-driven first_touch and followup with bounce detection — production OutreachEngine behavior.',
      image: images.kgHero.src,
      imageAlt: 'Workflow automation CRM',
      badge: 'Live scheduler',
      href: '/case-study-crm-outreach-system',
      linkLabel: 'CRM workflow case study'
    },
    faq: [
      { q: 'Is this the same as Zapier?', a: 'We build owned workflows with logging tied to your CRM and job records — better for critical ops than opaque zaps.' },
      { q: 'Can workflows send SMS?', a: 'Scoped per client — many flows start with email and in-app alerts via Email-Agent.' },
      { q: 'What if a step fails?', a: 'Failures surface in logs and owner alerts — Knight Command Logs tab pattern for ops visibility.' }
    ],
    links: [['/automation', 'Automation Overview'], ['/ticketing-invoicing-job-workflows', 'Job Workflows'], ['/review-request-systems', 'Review Requests']],
    cta: { title: 'Which process repeats every week?', text: 'Describe the steps — we will identify automation triggers with safe fallbacks.' }
  },
  {
    slug: 'business-dashboard-development',
    parent: { href: '/service-ai-automation', label: 'AI Automation' },
    title: 'Business Dashboard Development',
    meta: 'Custom business dashboards — queue depth, lead sources, outreach failures, and revenue signals for owners.',
    eyebrow: 'Visibility',
    h1: 'Business Dashboard Development & KPI Reporting',
    lead: 'One owner view for outreach queue depth, Email-Agent reply pressure, referral attribution, and job billing status — mobile-readable without opening five admin UIs.',
    heroIcon: 'fa-chart-pie',
    problem: {
      kicker: 'Blind spots',
      title: 'Owners log into five tools and still do not know what needs attention',
      text: 'CRM queue in one tab, Stripe in another, GBP in a third. Dashboards should answer: what failed, what is stale, and what produced leads this week.',
      bullets: [
        'No single view of outreach queue and follow-up due',
        'Referral partner activity invisible until disputes arise',
        'Invoice paid status not on the same screen as open jobs',
        'Desktop-only admin tools unusable from phone'
      ],
      media: { ...videos.referral, title: 'Partner dashboard', text: 'Referral-dashboard style visibility for leads and payouts.' }
    },
    features: [
      { icon: 'fa-filter', label: 'Leads', title: 'Lead & source reporting', text: 'Channels, partners, campaigns, and lists that produce consults.' },
      { icon: 'fa-heart-pulse', label: 'Health', title: 'Ops health', text: 'Queue depth, last successful send, bounce rate, and failure alerts.' },
      { icon: 'fa-dollar-sign', label: 'Revenue', title: 'Revenue signals', text: 'Quotes, booked jobs, invoices sent, and paid status where Stripe is connected.' },
      { icon: 'fa-mobile-screen', label: 'Mobile', title: 'Mobile-friendly views', text: 'Check the business from phone without complex admin UIs.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Command Center',
        title: 'Knight Command owner tab',
        text: 'Embeds outreach, email, social, and referral services behind one authenticated shell with Logs for failure review.',
        media: videos.referral
      }
    ],
    process: [
      { title: 'KPI selection', text: 'Pick metrics that drive decisions — not vanity traffic.' },
      { title: 'Data sources', text: 'Wire OutreachEngine, Neon referral events, Stripe, and job trackers.' },
      { title: 'Dashboard build', text: 'Role-based views with mobile layout priority for owners.' },
      { title: 'Review cadence', text: 'Monthly readout and threshold alerts.' }
    ],
    idealFor: [
      'Owners running outreach plus referrals simultaneously',
      'Businesses with Stripe invoicing and open job queues',
      'Teams needing partner-visible referral-dashboard views',
      'Operators replacing spreadsheet KPI tabs'
    ],
    proof: {
      title: 'Knight Command ops shell',
      text: 'Unified /admin with Command Center, referral embeds, and Logs — the internal dashboard reference.',
      image: images.logo.src,
      imageAlt: 'Business dashboard Knight Command',
      badge: 'Internal',
      href: '/case-study-knight-command',
      linkLabel: 'Knight Command case study'
    },
    faq: [
      { q: 'Can partners see their own dashboard?', a: 'Yes — referral-dashboard pattern gives partners QR, lead, and payout visibility without owner-only data.' },
      { q: 'Do you use off-the-shelf BI tools?', a: 'We build lean custom views integrated with your stack — faster than generic BI for small business ops.' },
      { q: 'How often is data refreshed?', a: 'Near real-time for webhooks and queues; nightly rollups where appropriate for reporting.' }
    ],
    links: [['/business-growth-systems', 'Growth Systems'], ['/case-study-knight-command', 'Knight Command'], ['/referral-network-systems', 'Referral Dashboards']],
    cta: { title: 'What should one screen show?', text: 'List the numbers you check every morning — we will design the owner dashboard around them.' }
  },
  {
    slug: 'email-agent-automation',
    parent: { href: '/service-ai-automation', label: 'AI Automation' },
    title: 'Email-Agent Automation',
    meta: 'Email-Agent on port 5100 — multi-inbox routing, crm_reply and formspree_lead views, Gmail/Zoho/Microsoft, brand mapping KL/KG/ST.',
    eyebrow: 'Inbox control',
    h1: 'Email-Agent Automation & Multi-Inbox Routing',
    lead: 'Unify business inboxes on port 5100 — CRM campaign replies in crm_reply views, website leads in formspree_lead, manual threads separate, with KL/KG/ST brand mapping.',
    heroIcon: 'fa-envelope',
    stats: [
      { value: '5100', label: 'Email-Agent port' },
      { value: '3', label: 'Brand maps KL/KG/ST' },
      { value: 'Multi', label: 'Gmail/Zoho/Microsoft' }
    ],
    problem: {
      kicker: 'Inbox chaos',
      title: 'Outreach replies hide in the same inbox as customer threads',
      text: 'When CRM replies, form leads, and owner conversations share one Gmail view, urgent responses get missed and bounces poison list hygiene.',
      bullets: [
        'No separation between campaign replies and manual sales email',
        'Formspree leads mixed with newsletters and spam',
        'Multi-brand inboxes cross-contaminate templates',
        'Bounces not flagged back to OutreachEngine'
      ],
      media: videos.email
    },
    features: [
      { icon: 'fa-inbox', label: 'Unify', title: 'Multi-inbox routing', text: 'Business accounts unified with folder rules on port 5100 embedded in Knight Command.' },
      { icon: 'fa-reply', label: 'CRM', title: 'crm_reply detection', text: 'Outreach replies land in dedicated CRM views for follow-up queues.' },
      { icon: 'fa-wpforms', label: 'Leads', title: 'formspree_lead views', text: 'Website form leads separated from campaign and personal traffic.' },
      { icon: 'fa-tags', label: 'Brands', title: 'KL / KG / ST mapping', text: 'Knight Logics, Knight Group, and Screen Team lanes stay isolated.' },
      { icon: 'fa-bell', label: 'Alerts', title: 'Urgent reply surfacing', text: 'Surface time-sensitive replies without living in email all day.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Live demo',
        title: 'Email-Agent routing walkthrough',
        text: 'See crm_reply vs formspree_lead separation and brand mapping in the production interface.',
        media: { ...videos.email, title: 'Email-Agent routing', text: 'Multi-inbox views on port 5100.' }
      }
    ],
    process: [
      { title: 'Inbox inventory', text: 'List accounts, brands, and who sends outreach from each.' },
      { title: 'View rules', text: 'Configure crm_reply, formspree_lead, and manual conversation paths.' },
      { title: 'Embed & auth', text: 'Deploy on 5100 with Knight Command Email Agent tab embed.' },
      { title: 'Bounce feedback', text: 'Loop bounce signals to OutreachEngine list hygiene.' }
    ],
    idealFor: [
      'Businesses running OutreachEngine across multiple brands',
      'Owners using Formspree or similar with cluttered inboxes',
      'Teams on Gmail, Zoho, or Microsoft needing one ops view',
      'Anyone losing CRM replies in personal email'
    ],
    proof: {
      title: 'CRM outreach + Email-Agent loop',
      text: 'OutreachEngine sends pair with Email-Agent reply routing — the live CRM outreach system case study.',
      image: images.kgHero.src,
      imageAlt: 'Email-Agent CRM integration',
      badge: 'Port 5100',
      href: '/case-study-crm-outreach-system',
      linkLabel: 'CRM outreach case study'
    },
    faq: [
      { q: 'Which email providers work?', a: 'Gmail, Zoho, and Microsoft are supported with per-brand credential mapping.' },
      { q: 'Is Email-Agent only for CRM?', a: 'It also routes Formspree and manual business threads — crm_reply and formspree_lead are dedicated views.' },
      { q: 'Can I access it outside Knight Command?', a: 'Port 5100 is reachable directly; Knight Command embeds it for single-sign-on operator workflow.' }
    ],
    links: [['/automation', 'Automation Systems'], ['/crm-outreach-lead-generation', 'CRM Outreach'], ['/case-study-crm-outreach-system', 'CRM Case Study']],
    cta: { title: 'Inbox slowing outreach?', text: 'We will map brands, inboxes, and reply routing rules for Email-Agent.' }
  },
  {
    slug: 'social-media-automation-systems',
    parent: { href: '/service-ai-automation', label: 'AI Automation' },
    title: 'Social Media Automation Systems',
    meta: 'Social Poster on Streamlit 8501 — queued content, X/Facebook API, GBP API, Playwright for Nextdoor/LinkedIn, failure reporting.',
    eyebrow: 'Content ops',
    h1: 'Social Media Automation Systems',
    lead: 'Social Poster on port 8501 — Streamlit queue UI, API bridge for X and Facebook, GBP API posts, Playwright runners for Nextdoor and LinkedIn, with visible failures.',
    heroIcon: 'fa-share-nodes',
    stats: [
      { value: '8501', label: 'Social Poster port' },
      { value: 'API+PW', label: 'Hybrid runners' },
      { value: 'Multi', label: 'Brand queues' }
    ],
    problem: {
      kicker: 'Silent failures',
      title: 'Scheduled posts fail quietly and nobody notices for a week',
      text: 'Manual posting does not scale across brands. Pure API tools miss platforms that need browser automation. You need queues plus failure reporting.',
      bullets: [
        'Different brands share credentials by mistake',
        'LinkedIn and Nextdoor need Playwright — APIs alone insufficient',
        'GBP posts disconnected from website campaigns',
        'No ops tab showing last successful post per platform'
      ],
      media: videos.social
    },
    features: [
      { icon: 'fa-calendar-days', label: 'Queue', title: 'Queued content', text: 'Posts scheduled per brand with clear posting windows in Streamlit 8501.' },
      { icon: 'fa-bridge', label: 'Hybrid', title: 'API + Playwright bridge', text: 'X and Facebook via API; Nextdoor and LinkedIn via Playwright runners when required.' },
      { icon: 'fa-store', label: 'GBP', title: 'Google Business posts', text: 'GBP API integration for map visibility alongside social channels.' },
      { icon: 'fa-triangle-exclamation', label: 'Alerts', title: 'Failure reporting', text: 'Know when a post fails before the content calendar gap shows publicly.' },
      { icon: 'fa-layer-group', label: 'Brands', title: 'Brand separation', text: 'KL, KG, ST companies keep isolated queues and credentials.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Live runner',
        title: 'Social Poster Streamlit UI',
        text: 'Queue management, posting windows, and failure visibility embedded in Knight Command Social Poster tab.',
        media: { ...videos.social, title: 'Social media manager', text: 'Multi-brand queue on port 8501.' }
      }
    ],
    process: [
      { title: 'Channel audit', text: 'Which platforms per brand — API vs Playwright path.' },
      { title: 'Queue setup', text: 'Templates, windows, and credential vault per brand.' },
      { title: 'Runner deploy', text: 'API bridge plus Playwright where needed; GBP API configured.' },
      { title: 'Ops embed', text: 'Social Poster tab in Knight Command with failure logs.' }
    ],
    idealFor: [
      'Multi-brand operators needing consistent posting cadence',
      'Local businesses using GBP posts plus X/Facebook',
      'Teams burned by silent third-party schedulers',
      'Owners wanting social ops next to CRM and email tabs'
    ],
    proof: {
      title: 'Social Poster production runners',
      text: 'Streamlit 8501 with API and Playwright bridge — documented in the Social Poster case study.',
      image: images.logo.src,
      imageAlt: 'Social Poster automation',
      badge: 'Port 8501',
      href: '/case-study-social-poster',
      linkLabel: 'Social Poster case study'
    },
    faq: [
      { q: 'Which platforms are supported?', a: 'X and Facebook via API, GBP via API, Nextdoor and LinkedIn via Playwright — scoped per brand at setup.' },
      { q: 'Do you create content?', a: 'Systems focus — queue and posting infrastructure. Content can be supplied by your team or scoped separately.' },
      { q: 'Where do failures show?', a: 'Social Poster UI and Knight Command Logs tab — not silent email-only alerts.' }
    ],
    links: [['/automation', 'Automation Overview'], ['/case-study-social-poster', 'Social Poster Case Study'], ['/local-visibility-systems', 'Local Visibility']],
    cta: { title: 'Need reliable social queues?', text: 'List brands and platforms — we will scope API vs Playwright runners.' }
  },
  {
    slug: 'handyman-business-growth-systems',
    parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' },
    title: 'Handyman Trade Growth Systems',
    meta: 'Handyman growth playbook — website, local SEO, booking, CRM outreach, and referral network slot for Tampa Bay estimate-first repair trades.',
    eyebrow: 'Network trade lane · Handyman',
    h1: 'Growth Systems for Handyman Companies',
    lead: 'The handyman trade lane uses Knight Group as the live reference — 97 pages, kg outreach lane, and referral-ready infrastructure. We onboard similar crews into the same stack and complementary trade network.',
    heroIcon: 'fa-hammer',
    heroImage: images.kgHero,
    problem: {
      kicker: 'Estimate-first reality',
      title: 'Handyman leads call three competitors in ten minutes',
      text: 'If your site is slow, your services are vague, or nobody follows up on form fills, you lose the visit. Repeat work needs reviews and referral tracking too.',
      bullets: [
        'Generic template hides service list and service area',
        'No booking or clear call CTA above the fold',
        'Outreach to property managers not systematic',
        'Job photos and invoices still manual'
      ],
      media: images.kgHero
    },
    features: [
      { icon: 'fa-map', label: 'Local', title: 'Service & area pages', text: 'Clear offers and Tampa Bay geography for map and search visibility.' },
      { icon: 'fa-calendar-check', label: 'Book', title: 'Booking & call CTAs', text: 'Conversion paths matching handyman estimate flow — Knight Group booking pattern.' },
      { icon: 'fa-paper-plane', label: 'Outreach', title: 'CRM & follow-up', text: 'KG-branded OutreachEngine campaigns with reply routing via Email-Agent.' },
      { icon: 'fa-camera', label: 'Jobs', title: 'Job records', text: 'Photos, invoices, and proof attached per job when ops lane is added.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Live benchmark',
        title: 'Knight Group — 97 indexable pages, Lighthouse 96/100/100',
        text: 'Handyman site with booking, schema, outreach, and performance-friendly build.',
        media: images.kgHero
      }
    ],
    process: [
      { title: 'Offer & area map', text: 'Services, metros, and call vs booking preference.' },
      { title: 'Site & GBP launch', text: '97-page local SEO architecture scaled to your crew size.' },
      { title: 'Outreach optional', text: 'Property manager and HOA lists with KG outreach patterns.' },
      { title: 'Ops add-ons', text: 'Job tracking and invoicing when portal work appears.' }
    ],
    idealFor: [
      'Owner-operator handyman companies in Tampa Bay',
      'Small crews outgrowing Nextdoor-only lead flow',
      'Handyman brands ready for property manager outreach',
      'Businesses wanting Knight Group-style technical quality'
    ],
    proof: {
      title: 'Reference build: Knight Group',
      text: '97 indexable pages, Lighthouse 96/100/100, booking, schema, and outreach that produced real booked work — the handyman lane proof for the partner network.',
      image: images.kgHero.src,
      imageAlt: 'Knight Group handyman site',
      badge: 'Lighthouse 96',
      href: '/case-study-knight-group',
      linkLabel: 'Knight Group case study'
    },
    faq: [
      { q: 'Do I need 97 pages like Knight Group?', a: 'Page count should match real service coverage and geography — Knight Group shows deep local SEO at 97 URLs, not a copy-paste package size.' },
      { q: 'Can you run KG outreach for my handyman brand?', a: 'We configure OutreachEngine with your brand lane, caps, and lists — same engine, your territory.' },
      { q: 'Is booking required?', a: 'No — some crews are call-first only; booking is added when estimate flow supports it.' }
    ],
    links: [['/case-study-knight-group', 'Knight Group Case Study'], ['/contractor-growth-systems', 'Contractor Systems'], ['/crm-outreach-lead-generation', 'CRM Outreach']],
    cta: { title: 'Join the handyman trade lane?', text: 'Share your services, metros, and how customers book you — we will scope your stack and network slot.' }
  },
  {
    slug: 'roofing-business-growth-systems',
    parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' },
    title: 'Roofing Trade Growth Systems',
    meta: 'Roofing growth playbook — trust pages, local SEO, inspection leads, and referral network onboarding for Tampa Bay roofers.',
    eyebrow: 'Network trade lane · Roofing',
    h1: 'Growth Systems for Roofing Companies',
    lead: 'Roofing trades join the same growth stack and referral network — Roof Monsters documents the vertical pattern; your launch becomes the next case study when storm-season visibility matters.',
    heroIcon: 'fa-house-chimney-crack',
    heroImage: images.caseStudyRoofing,
    problem: {
      kicker: 'Storm-season pressure',
      title: 'Roofing websites fail when trust and geography are thin',
      text: 'Homeowners pick roofers from map pack and referrals. Thin proof, missing city pages, and slow follow-up on inspection requests cost jobs when storms hit.',
      bullets: [
        'No project proof or insurance-friendly FAQ content',
        'City pages missing for metros you actually serve',
        'Inspection requests not tracked in CRM',
        'Referral partners unattributed after storms'
      ],
      media: images.caseStudyRoofing
    },
    features: [
      { icon: 'fa-shield-halved', label: 'Trust', title: 'Trust & proof pages', text: 'Projects, service areas, insurance messaging, and FAQs that match estimate-first roofing sales.' },
      { icon: 'fa-map-location-dot', label: 'SEO', title: 'Local SEO architecture', text: 'Service and city pages aligned to how roofers sell — Roof Monsters preview pattern.' },
      { icon: 'fa-clipboard-list', label: 'Leads', title: 'Lead capture & CRM', text: 'Forms, call tracking, and outreach intake for inspection requests.' },
      { icon: 'fa-handshake', label: 'Referrals', title: 'Partner referral flow', text: 'Track complementary trades and storm partner lead sources.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Preview build',
        title: 'Roof Monsters brand system',
        text: 'Roofing growth preview with local SEO structure, trust pages, and estimate-first conversion paths.',
        media: images.jns
      }
    ],
    process: [
      { title: 'Trust content map', text: 'Proof, insurance FAQs, and service definitions before city expansion.' },
      { title: 'Geo & GBP', text: 'City pages and profile alignment for storm-season metros.' },
      { title: 'Lead paths', text: 'Inspection forms, call CTAs, and CRM intake rules.' },
      { title: 'Referral & outreach', text: 'Partner QR and optional property manager outreach.' }
    ],
    idealFor: [
      'Tampa Bay roofers preparing for storm season visibility',
      'Roofing brands launching credibly before heavy ad spend',
      'Companies needing inspection lead tracking beyond voicemail',
      'Teams partnering with trades for referral attribution'
    ],
    proof: {
      title: 'Reference pattern: Roof Monsters preview',
      text: 'Roofing brand site and lead system in development — documents trust layout and estimate-first paths for the roofing lane in the partner network.',
      image: images.caseStudyRoofing.src,
      imageAlt: 'Roofing lead capture and trust pages',
      badge: 'Client preview',
      href: '/case-study-roof-monsters',
      linkLabel: 'Roof Monsters preview'
    },
    faq: [
      { q: 'Is Roof Monsters live?', a: 'It is a client preview case study — public marketing details publish when launch is approved.' },
      { q: 'Do you handle storm chasing SEO?', a: 'We build durable local structure — not short-term spam. Geography matches real service coverage.' },
      { q: 'Can outreach target property managers?', a: 'Yes — OutreachEngine supports segmented B2B lists with daily caps and reply tracking.' }
    ],
    links: [['/local-visibility-systems', 'Local Visibility'], ['/case-study-roof-monsters', 'Roof Monsters Preview'], ['/contractor-growth-systems', 'Contractor Systems']],
    cta: { title: 'Join the roofing trade lane?', text: 'Tell us your service area and how inspection requests arrive today.' }
  },
  {
    slug: 'screen-enclosure-business-growth-systems',
    parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' },
    title: 'Screen Enclosure Trade Growth Systems',
    meta: 'Screen enclosure growth playbook — service-area SEO, quote CTAs, and referral network slot for Tampa Bay pool cage trades.',
    eyebrow: 'Network trade lane · Screen enclosure',
    h1: 'Growth Systems for Screen Enclosure Companies',
    lead: 'Screen Team is the live reference for this lane — 36 pages, st outreach, and quote-first local SEO. We onboard enclosure companies into the same infrastructure and complementary trade referrals.',
    heroIcon: 'fa-water',
    heroImage: images.screenTeam,
    problem: {
      kicker: 'Quote-first trade',
      title: 'Screen enclosure leads search by city and pool type',
      text: 'Customers compare three local enclosure companies. Thin geography and missing pool cage specifics push them to competitors with clearer service pages.',
      bullets: [
        'City coverage pages missing for key Tampa Bay metros',
        'Quote forms buried below generic contractor copy',
        'GBP categories misaligned with enclosure services',
        'Screen Team-level depth feels out of reach on a budget'
      ],
      media: images.screenTeam
    },
    features: [
      { icon: 'fa-map-pin', label: 'Geo', title: 'Service-area SEO', text: 'City and service pages for Tampa Bay coverage — Screen Team depth as reference.' },
      { icon: 'fa-file-signature', label: 'Convert', title: 'Quote-first CTAs', text: 'Forms and call paths tuned for enclosure estimates.' },
      { icon: 'fa-code', label: 'Schema', title: 'Schema & GBP', text: 'LocalBusiness, FAQ, and map-pack alignment.' },
      { icon: 'fa-headset', label: 'Follow-up', title: 'Ops support', text: 'Quote tracking and ST-branded outreach after launch.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Reference build',
        title: 'Screen Team LLC — network anchor',
        text: 'Deep service and city pages for pool enclosure trades — the checkable proof for this lane and a template for your launch.',
        media: images.screenTeam
      }
    ],
    process: [
      { title: 'Service taxonomy', text: 'Pool cage, screen room, and repair offers defined per page.' },
      { title: 'Metro page build', text: 'City pages with internal links from service hubs.' },
      { title: 'GBP & schema', text: 'Profile cleanup and structured data alignment.' },
      { title: 'Lead follow-up', text: 'CRM intake and optional Screen Team-style outreach.' }
    ],
    idealFor: [
      'Screen enclosure and pool cage companies in Tampa Bay',
      'Trades competing with Screen Team on map pack',
      'Owners needing quote forms that work on mobile',
      'Teams expanding from referrals into outbound prospecting'
    ],
    proof: {
      title: 'Reference build: Screen Team',
      text: '36-page enclosure architecture with st OutreachEngine lane — live proof for the screen trade network slot.',
      image: images.screenTeam.src,
      imageAlt: 'Screen Team website',
      badge: 'Live client',
      href: '/case-study-screen-team',
      linkLabel: 'Screen Team case study'
    },
    faq: [
      { q: 'How many city pages do enclosure companies need?', a: 'Screen Team demonstrates deep Tampa Bay metro coverage — we scale page count to your actual service radius.' },
      { q: 'Is ST outreach the same engine?', a: 'Screen Team uses the OutreachEngine st brand lane with Email-Agent ST mapping.' },
      { q: 'Do you build aluminum vs screen differentiation?', a: 'Yes — service silos separate intents so customers land on the right quote path.' }
    ],
    links: [['/case-study-screen-team', 'Screen Team Case Study'], ['/contractor-growth-systems', 'Contractor Systems'], ['/service-area-page-strategy', 'Service Area Strategy']],
    cta: { title: 'Join the screen enclosure lane?', text: 'Share your metros and quote process — we will map page depth, lead flow, and network onboarding.' }
  },
  {
    slug: 'excavation-business-growth-systems',
    parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' },
    title: 'Excavation Trade Growth Systems',
    meta: 'Excavation and site-work growth playbook — wide geography SEO, project proof, and referral network slot for land clearing trades.',
    eyebrow: 'Network trade lane · Excavation',
    h1: 'Growth Systems for Excavation & Site Work',
    lead: 'Faith Works anchors the excavation lane at 82 pages with faithworks outreach — we onboard land clearing and site-work companies into the same stack and builder referral network.',
    heroIcon: 'fa-tractor',
    heroImage: images.faithWorks,
    problem: {
      kicker: 'Wide coverage',
      title: 'Excavation companies need geography depth without doorway spam',
      text: 'One homepage cannot rank for every county you serve. Faith Works demonstrates how land clearing trades build useful service-area pages at scale.',
      bullets: [
        'Single-page sites fail for multi-county excavation radius',
        'Before/after proof missing for large site work',
        'Lead forms not segmented by job type — clearing vs grading',
        'Subcontractor referrals untracked'
      ],
      media: images.faithWorks
    },
    features: [
      { icon: 'fa-map', label: 'Footprint', title: 'Large service footprint', text: 'Service and geography pages for wide coverage — Faith Works 82-page reference.' },
      { icon: 'fa-images', label: 'Proof', title: 'Project proof', text: 'Before/after galleries and capability pages for heavy site work.' },
      { icon: 'fa-route', label: 'Routing', title: 'Lead routing', text: 'Forms and call CTAs tied to job type and geography.' },
      { icon: 'fa-people-arrows', label: 'Partners', title: 'Partner referrals', text: 'Track subcontractor and partner lead sources with QR paths.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Reference build',
        title: 'Faith Works — excavation lane anchor',
        text: '82-page land clearing footprint with faithworks outreach — template for your geography and proof at scale.',
        media: images.faithWorks
      }
    ],
    process: [
      { title: 'Coverage map', text: 'Counties, job types, and proof assets inventory.' },
      { title: 'Page architecture', text: 'Hubs, silos, and internal links for geography at scale.' },
      { title: 'Lead segmentation', text: 'Separate paths for clearing, grading, and emergency work.' },
      { title: 'Referral layer', text: 'Partner codes for builders and subcontractors.' }
    ],
    idealFor: [
      'Land clearing and excavation with multi-county service areas',
      'Site work companies outgrowing single-page brochure sites',
      'Owners wanting Faith Works-style SEO without spam tactics',
      'Trades receiving partner leads needing attribution'
    ],
    proof: {
      title: 'Reference build: Faith Works',
      text: '82-page land clearing SEO across Central Florida — live proof for the excavation trade network slot.',
      image: images.faithWorks.src,
      imageAlt: 'Faith Works land clearing SEO',
      badge: '82 pages',
      href: '/case-study-faith-works',
      linkLabel: 'Faith Works case study'
    },
    faq: [
      { q: 'Is 82 pages required?', a: 'No — Faith Works is the upper reference. Page count matches counties and services you truly cover.' },
      { q: 'How do you avoid doorway page penalties?', a: 'Pages include unique local utility, proof, and internal linking — not copy-paste city swaps.' },
      { q: 'Can you integrate job photos from crews?', a: 'Yes — job workflow lane attaches field photos to records when ops system is added.' }
    ],
    links: [['/case-study-faith-works', 'Faith Works Case Study'], ['/home-service-business-growth-systems', 'Home Service Systems'], ['/service-area-page-strategy', 'Service Area Strategy']],
    cta: { title: 'Join the excavation trade lane?', text: 'Describe your coverage map and job types — we will plan geography depth and network onboarding.' }
  },
  {
    slug: 'electrician-business-growth-systems',
    parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' },
    title: 'Electrician Growth Systems',
    meta: 'Electrician growth playbook — starter and search-ready websites, local SEO, and referral network onboarding for Tampa Bay electrical contractors.',
    eyebrow: 'Open trade lane · Electricians',
    h1: 'Growth Systems for Electricians',
    lead: 'We are actively building the electrician lane in the Tampa Bay partner network — Farrell Electric shows the starter launch pattern; your build becomes the next proof page and referral slot.',
    heroIcon: 'fa-bolt',
    heroImage: { type: 'image', src: '/images/farrell-hero.webp', alt: 'Farrell Electric website hero' },
    problem: {
      kicker: 'Open lane recruitment',
      title: 'Electricians need credible web presence before referral scale',
      text: 'Homeowners and GCs pick from the map pack and partner referrals. Thin sites, missing service pages, and no tracked referral path lose jobs to competitors with clearer offers.',
      bullets: [
        'Generic templates hide residential vs commercial services',
        'No schema or Search Console baseline for local queries',
        'Complementary trades cannot send attributed referral work',
        'Follow-up on estimate requests lives in personal email'
      ],
      media: { type: 'image', src: '/images/added-media/gbp-reviews.webp', alt: 'Google Business reviews on electrician site' }
    },
    features: [
      { icon: 'fa-globe', label: 'Web', title: 'Electrician-focused websites', text: 'Service pages, trust signals, and call-first CTAs tuned to electrical estimate flow.' },
      { icon: 'fa-map-marker-alt', label: 'Local', title: 'Local SEO & GBP', text: 'Schema, service-area pages, and profile alignment for Tampa Bay metros.' },
      { icon: 'fa-qrcode', label: 'Network', title: 'Referral network slot', text: '/ref/:partner paths and QR brochures when you join complementary trade referrals.' },
      { icon: 'fa-paper-plane', label: 'Outreach', title: 'CRM outreach optional', text: 'OutreachEngine lanes for builders, property managers, and GC lists when volume justifies.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Starter reference',
        title: 'Farrell Electric preview launch',
        text: 'Multi-page electrician site with essential SEO and working contact flow — the entry pattern for the electrician lane.',
        media: images.farrellElectric
      }
    ],
    process: [
      { title: 'Offer & service map', text: 'Residential, commercial, and emergency offers documented per page.' },
      { title: 'Launch site & GBP', text: 'Conversion paths, analytics, and Search Console baseline.' },
      { title: 'Case study & lane', text: 'Publish proof on knightlogics.com when launch is ready; assign outreach and referral codes.' },
      { title: 'Network co-marketing', text: 'Cross-referrals with handyman, HVAC, and contractor partners with attribution.' }
    ],
    idealFor: [
      'Owner-operator electricians launching or upgrading web presence',
      'Electrical contractors joining a complementary trade referral network',
      'Businesses outgrowing Nextdoor-only lead flow',
      'Teams ready for search-ready or full growth-system scope'
    ],
    proof: {
      title: 'Reference build: Farrell Electric',
      text: 'Starter electrician website with service structure and contact conversion — first case study in the open electrician lane.',
      image: images.farrellElectric.src,
      imageAlt: 'Farrell Electric website',
      badge: 'Case study',
      href: '/case-study-farrell-electric',
      linkLabel: 'Farrell Electric case study'
    },
    faq: [
      { q: 'Is this only for large electrical companies?', a: 'No — Farrell Electric shows the starter path; full growth systems scale with your metros and service depth.' },
      { q: 'How does the referral network work?', a: 'Partners get tracked /ref/:partner paths and dashboard visibility — complementary trades send work with documented attribution.' },
      { q: 'Do you compete with my existing marketing?', a: 'We build your owned presence and network slot — you keep your brand domain and customer relationships.' }
    ],
    links: [['/case-study-farrell-electric', 'Farrell Electric Case Study'], ['/contractor-growth-systems', 'Contractor Systems'], ['/referral-network-systems', 'Referral Network']],
    cta: { title: 'Join the electrician trade lane?', text: 'Tell us your services and how jobs arrive today — we will scope your launch and network fit.' }
  },
  {
    slug: 'painter-business-growth-systems',
    parent: { href: '/home-service-business-growth-systems', label: 'Home Service Systems' },
    title: 'Painter Growth Systems',
    meta: 'Painter growth playbook — search-ready websites, local SEO, and referral network onboarding for Tampa Bay painting contractors.',
    eyebrow: 'Open trade lane · Painting',
    h1: 'Growth Systems for Painting Companies',
    lead: 'The painting lane is open for new partners — Sal\'s Painting demonstrates search-ready launch; we build your presence and add you to the cross-trade referral roster.',
    heroIcon: 'fa-paint-roller',
    heroImage: { type: 'image', src: '/images/sals-hero.webp', alt: "Sal's Painting website hero" },
    problem: {
      kicker: 'Open lane recruitment',
      title: 'Painters lose organic leads when service intent is vague',
      text: 'Interior, exterior, and cabinet jobs rank differently. One generic page cannot capture "painter near me" and specialty finishes. Referral partners need a credible site before sending work.',
      bullets: [
        'Portfolio and service pages missing for distinct paint intents',
        'No analytics or Search Console baseline after launch',
        'GBP categories misaligned with website services',
        'Referral work from handymen and remodelers goes untracked'
      ],
      media: { type: 'image', src: '/images/added-media/indexing.png', alt: 'Search Console indexing for painter launch' }
    },
    features: [
      { icon: 'fa-palette', label: 'Web', title: 'Painter-focused sites', text: 'Gallery, service silos, and estimate CTAs for residential and commercial painting.' },
      { icon: 'fa-magnifying-glass', label: 'SEO', title: 'Search-ready foundation', text: 'GA4, Clarity, GSC, and schema — the Sal\'s Painting starter pattern.' },
      { icon: 'fa-qrcode', label: 'Network', title: 'Referral network slot', text: 'Tracked partner paths when you exchange work with handymen, drywall, and remodel trades.' },
      { icon: 'fa-star', label: 'Reviews', title: 'Reputation lane', text: 'Review request timing tied to job completion when workflow volume justifies.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Search-ready reference',
        title: "Sal's Painting launch",
        text: 'Search-optimized painter site with analytics, schema, and brand package — template for the painting lane.',
        media: images.salsPainting
      }
    ],
    process: [
      { title: 'Service & gallery map', text: 'Interior, exterior, cabinet, and commercial offers per page.' },
      { title: 'Search-ready launch', text: 'Technical SEO, analytics, and GBP alignment from day one.' },
      { title: 'Case study publish', text: 'Proof page on knightlogics.com when you approve marketing.' },
      { title: 'Referral onboarding', text: 'QR and /ref paths for complementary trades in the network.' }
    ],
    idealFor: [
      'Painting contractors investing in organic visibility',
      'Owner-operators joining a cross-trade referral network',
      'Businesses graduating from social-only lead flow',
      'Teams wanting search-ready scope before full CRM outreach'
    ],
    proof: {
      title: "Reference build: Sal's Painting",
      text: 'Search-ready painter website with analytics and technical SEO foundation — open lane case study.',
      image: images.salsPainting.src,
      imageAlt: "Sal's Painting website",
      badge: 'Case study',
      href: '/case-study-sals-painting',
      linkLabel: "Sal's Painting case study"
    },
    faq: [
      { q: 'Is this a full 97-page build like Knight Group?', a: 'Painting scope scales to your metros — Sal\'s shows search-ready starter; deep geography follows when justified.' },
      { q: 'Can handyman partners refer painting work?', a: 'Yes — referral infrastructure attributes consults to the sending partner when both are in the network.' },
      { q: 'Do you handle brand design?', a: 'Sal\'s included brand package in scope — we can bundle similar deliverables per project.' }
    ],
    links: [['/case-study-sals-painting', "Sal's Painting Case Study"], ['/home-service-business-growth-systems', 'Home Service Systems'], ['/referral-network-systems', 'Referral Network']],
    cta: { title: 'Join the painting trade lane?', text: 'Share your services and markets — we will scope search-ready or full growth-system fit.' }
  },
  {
    slug: 'restaurant-bar-growth-systems',
    parent: { href: '/online-ordering-systems', label: 'Ordering Systems' },
    title: 'Restaurant & Bar Growth Systems',
    meta: 'Restaurant and bar websites with events, menus, ordering flows, and admin-editable content for Tampa Bay hospitality.',
    eyebrow: 'Hospitality',
    h1: 'Restaurant & Bar Business Growth Systems',
    lead: 'Events, admin-editable menus, ordering-ready architecture, and local visibility on one fast mobile site — without enterprise POS lock-in or a developer ticket for every special.',
    heroIcon: 'fa-martini-glass-citrus',
    heroImage: images.hospitalityEvents,
    stats: [
      { value: 'Events', label: 'Calendar on owned domain' },
      { value: 'Admin', label: 'Staff menu & hour edits' },
      { value: 'Stripe', label: 'Order-ready checkout' }
    ],
    problem: {
      kicker: 'Beyond PDF menus',
      title: 'Restaurants lose regulars when events and hours are hard to find',
      text: 'Static menus and Facebook-only event posts fragment your brand. Customers want tonight\'s specials, order-ahead, and accurate hours on a fast mobile site.',
      bullets: [
        'Menu updates require developer tickets',
        'Events scattered across social platforms',
        'No owned ordering path — only third-party apps',
        'GBP hours and website specials out of sync'
      ],
      media: images.hospitalityEvents
    },
    features: [
      { icon: 'fa-calendar-star', label: 'Events', title: 'Events & menus', text: 'Admin-editable specials, events, and hours — staff-friendly hospitality UX.' },
      { icon: 'fa-bag-shopping', label: 'Order', title: 'Ordering flows', text: 'Pickup or order-ahead paths without enterprise POS lock-in.' },
      { icon: 'fa-map-marker-alt', label: 'Local', title: 'Local visibility', text: 'GBP alignment, schema, and map discovery support.' },
      { icon: 'fa-plug', label: 'POS', title: 'Future POS hooks', text: 'Room for Toast or POS integration as volume grows.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Menus & ordering',
        title: 'Staff-editable specials and owned checkout',
        text: 'Kitchen and bar staff publish tonight\'s menu without an agency ticket. Stripe-ready pickup keeps orders on your domain — not only third-party marketplaces.',
        media: images.hospitalityMenus
      }
    ],
    process: [
      { title: 'Content workflow', text: 'Who updates menus, events, and hours — and how often.' },
      { title: 'Site & admin build', text: 'Hand-coded hospitality UX with editable content zones.' },
      { title: 'Ordering path', text: 'Stripe or order-ahead flow scoped to your kitchen ops.' },
      { title: 'Local launch', text: 'GBP, schema, and review request timing post-open.' }
    ],
    idealFor: [
      'Tampa Bay restaurants and bars upgrading from brochure sites',
      'Venues with weekly events needing easy admin edits',
      'Owners wanting owned ordering before app commission fatigue',
      'Hospitality brands planning POS integration later'
    ],
    proof: {
      title: 'Hospitality stack we deploy',
      text: 'Hand-coded sites with admin menus, events calendar, Stripe-ready ordering, and local visibility — scoped to how your kitchen and bar actually run.',
      image: images.hospitalityMenus.src,
      imageAlt: images.hospitalityMenus.alt,
      badge: 'System pattern',
      href: '/case-study-hospitality-system-pattern',
      linkLabel: 'View capability breakdown'
    },
    faq: [
      { q: 'Can you show a live restaurant example?', a: 'We walk prospects through the system pattern and admin workflows on a consult. Branded hospitality case studies go live only after a client approves public marketing — ask us what we can share for your vertical today.' },
      { q: 'Do you replace Toast?', a: 'We build owned web ordering first; POS integrations scoped when you are ready.' },
      { q: 'Can bartenders update specials?', a: 'Admin patterns target staff-friendly edits without code.' }
    ],
    links: [['/online-ordering-systems', 'Ordering Systems'], ['/case-study-hospitality-system-pattern', 'Hospitality System Pattern'], ['/local-visibility-systems', 'Local Visibility']],
    cta: { title: 'Planning a restaurant or bar site?', text: 'Tell us about menus, events, and how you want orders to flow.' }
  },
  {
    slug: 'startup-business-launch-systems',
    parent: { href: '/business-growth-systems', label: 'Growth Systems' },
    title: 'Startup Business Launch Systems',
    meta: 'Startup launch systems — website, local SEO, analytics, CRM basics, and growth infrastructure from day one.',
    eyebrow: 'New businesses',
    h1: 'Startup Business Launch Systems',
    lead: 'Launch with credibility, analytics, lead capture, and a clear upgrade path into full growth systems — instead of rebuilding after six months when ops get messy.',
    heroIcon: 'fa-rocket',
    heroImage: images.logo,
    problem: {
      kicker: 'Launch debt',
      title: 'Cheap launches create expensive rebuilds',
      text: 'Template sites skip schema, analytics, and CRM basics. When leads arrive, owners scramble to bolt on tools that should have been day-one infrastructure.',
      bullets: [
        'No Search Console or baseline analytics',
        'Forms dump to personal email with no CRM',
        'Brand and domain misaligned with GBP creation',
        'No documented path to outreach or automation later'
      ],
      media: images.logo
    },
    features: [
      { icon: 'fa-globe', label: 'Web', title: 'Launch website', text: 'Credibility, offer clarity, and conversion paths from day one.' },
      { icon: 'fa-chart-simple', label: 'Measure', title: 'Analytics & search', text: 'Search Console, sitemap, schema, and baseline tracking.' },
      { icon: 'fa-user-plus', label: 'Leads', title: 'Lead capture', text: 'Forms, CRM basics, and follow-up workflow hooks.' },
      { icon: 'fa-stairs', label: 'Scale', title: 'Scale path', text: 'Documented upgrade into OutreachEngine, Email-Agent, and referral systems.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Foundation',
        title: 'JNS 11-page contractor bundle pattern',
        text: 'Focused launch footprint for new trades — enough depth without overbuilding on day one.',
        media: images.jns
      }
    ],
    process: [
      { title: 'Offer & brand clarity', text: 'Positioning, domain, and core pages before feature creep.' },
      { title: 'Launch site & tracking', text: 'Analytics, schema, and form intake live at go-live.' },
      { title: 'GBP & local setup', text: 'Profile creation aligned with website geography.' },
      { title: 'Growth roadmap', text: 'Written phase-two path for outreach and automation.' }
    ],
    idealFor: [
      'New Tampa Bay local service businesses pre-launch',
      'Side hustles graduating to full-time with first marketing spend',
      'Founders who want ops-ready infrastructure, not just a logo site',
      'Startups planning referral or outreach within 6–12 months'
    ],
    proof: {
      title: 'JNS Construction launch bundle',
      text: '11-page contractor launch — focused service clarity and conversion without enterprise scope on day one.',
      image: images.jns.src,
      imageAlt: 'JNS startup contractor launch',
      badge: '11 pages',
      href: '/case-study-jns',
      linkLabel: 'JNS case study'
    },
    faq: [
      { q: 'How is this different from business-growth-systems?', a: 'Launch lane is phased foundation — full growth system adds outreach, referral, and ops embeds when volume justifies them.' },
      { q: 'Do you include logo design?', a: 'We work with your brand assets; logo design can be scoped separately if needed.' },
      { q: 'When should we add CRM outreach?', a: 'Roadmap defines triggers — usually after site, GBP, and baseline leads are stable.' }
    ],
    links: [['/service-websites', 'Website Services'], ['/website-growth-audit', 'Free Growth Audit'], ['/business-growth-systems', 'Full Growth Systems']],
    cta: { title: 'Launching a new business?', text: 'Share your offer and timeline — we will scope a foundation that scales.' }
  },
  {
    slug: 'stripe-invoice-automation',
    parent: { href: '/ticketing-invoicing-job-workflows', label: 'Job Workflows' },
    title: 'Stripe Invoice Automation',
    meta: 'Automated Stripe invoicing from completed jobs — payment links, status sync, and owner visibility for service businesses.',
    eyebrow: 'Payments',
    h1: 'Stripe Invoice Automation for Service Businesses',
    lead: 'Completed field work should create Stripe invoices or payment links automatically — with paid status synced back to the job record and referral payouts on webhook where applicable.',
    heroIcon: 'fa-file-invoice-dollar',
    problem: {
      kicker: 'Billing lag',
      title: 'Crews finish jobs days before customers see an invoice',
      text: 'Office staff retypes job details into Stripe. Payment status is checked manually. Cash flow slows and portal vendors miss billing windows.',
      bullets: [
        'Job completion not wired to invoice trigger',
        'Payment links sent without job context or photos',
        'Paid status not reflected on job tracker',
        'Referral or partner fees not tied to Stripe webhooks'
      ],
      media: { ...videos.referral, title: 'Stripe webhooks', text: 'Payment and referral payout events in one reliability model.' }
    },
    features: [
      { icon: 'fa-check-double', label: 'Trigger', title: 'Job → invoice trigger', text: 'Completed status creates invoice draft or payment link automatically.' },
      { icon: 'fa-rotate', label: 'Sync', title: 'Stripe sync', text: 'Paid, sent, and overdue reflected on the job record via webhooks.' },
      { icon: 'fa-paper-plane', label: 'Delivery', title: 'Customer delivery', text: 'Email payment link with job context and optional PDF proof.' },
      { icon: 'fa-chart-line', label: 'Report', title: 'Invoice reporting', text: 'Sent, paid, and overdue visibility on owner dashboard.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Active reference',
        title: 'Vendoroo invoice lane',
        text: 'Vendor portal workflow includes Stripe invoice creation on job completion — active build reference.',
        media: images.jns
      }
    ],
    process: [
      { title: 'Job status map', text: 'Define which status triggers invoice and what line items populate.' },
      { title: 'Stripe setup', text: 'Products, tax, and webhook endpoints with failure alerts.' },
      { title: 'Sync build', text: 'Payment status on job record and optional referral fee hooks.' },
      { title: 'Staff training', text: 'Override path for edge cases before full automation.' }
    ],
    idealFor: [
      'Field vendors billing after portal or ticket jobs',
      'Contractors using Stripe but typing invoices manually',
      'Businesses needing paid status on the same screen as open jobs',
      'Referral programs settling fees via Stripe webhooks'
    ],
    proof: {
      title: 'Vendoroo ticket & invoice system',
      text: 'Active build connecting ticket intake, mobile jobs, and Stripe invoicing — reference for this lane.',
      image: images.jns.src,
      imageAlt: 'Stripe invoice automation',
      badge: 'Active build',
      href: '/case-study-vendoroo-ticket-invoice-system',
      linkLabel: 'Vendoroo case study'
    },
    faq: [
      { q: 'Does this work with Stripe Connect?', a: 'Scoped per client — standard Stripe invoicing and webhooks are the default pattern.' },
      { q: 'Can customers pay by card and ACH?', a: 'Stripe payment link options follow your Stripe account settings.' },
      { q: 'What if job scope changes after completion?', a: 'Manual adjustment workflow remains — automation handles the happy path.' }
    ],
    links: [['/ticketing-invoicing-job-workflows', 'Job Workflows'], ['/api-integration-services', 'API Integrations'], ['/case-study-vendoroo-ticket-invoice-system', 'Vendoroo Case Study']],
    cta: { title: 'Automating Stripe invoicing?', text: 'Describe job completion flow and current billing steps.' }
  },
  {
    slug: 'job-photo-pdf-reports',
    parent: { href: '/ticketing-invoicing-job-workflows', label: 'Job Workflows' },
    title: 'Job Photo & PDF Reports',
    meta: 'Mobile job photos and PDF completion reports for property managers, vendors, and field service companies.',
    eyebrow: 'Field proof',
    h1: 'Job Photo Attachments & PDF Field Reports',
    lead: 'Field crews capture photos tied to job ID; office generates branded PDF proof packets for portals, property managers, and customers — Vendoroo active build pattern.',
    heroIcon: 'fa-file-image',
    problem: {
      kicker: 'Proof scramble',
      title: 'Completion photos live on phones until someone builds PDFs manually',
      text: 'Property managers reject vague closeouts. Portal uploads need consistent PDF formats. Crews forget photos when proof is not part of the job status flow.',
      bullets: [
        'Photos not required before job can close',
        'PDF layout rebuilt per manager format',
        'No mobile-friendly attach flow on site',
        'Customer proof links missing optional branding'
      ],
      media: images.jns
    },
    features: [
      { icon: 'fa-camera', label: 'Capture', title: 'Mobile photo capture', text: 'Browser-first photo attach tied to job ID and status on site.' },
      { icon: 'fa-file-pdf', label: 'PDF', title: 'PDF report generation', text: 'Branded completion packets with photos, notes, and timestamps.' },
      { icon: 'fa-upload', label: 'Portal', title: 'Portal-ready exports', text: 'Files structured for vendor portal upload requirements.' },
      { icon: 'fa-link', label: 'Share', title: 'Customer delivery', text: 'Optional client-facing proof links after completion.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Vendor workflow',
        title: 'Vendoroo photo & PDF lane',
        text: 'Ticket jobs with mobile updates, photo attachments, and PDF proof before invoice trigger.',
        media: images.jns
      }
    ],
    process: [
      { title: 'Proof requirements', text: 'Document portal and manager PDF expectations per job type.' },
      { title: 'Mobile capture UX', text: 'Minimal taps for crews to attach photos before closeout.' },
      { title: 'PDF templates', text: 'Branded layouts with required fields auto-filled from job record.' },
      { title: 'Delivery paths', text: 'Portal upload, email, or customer link options.' }
    ],
    idealFor: [
      'Property maintenance vendors with photo requirements',
      'Contractors submitting portal closeout packets',
      'Owners tired of rebuilding PDFs from camera rolls',
      'Teams pairing proof with Stripe invoice automation'
    ],
    proof: {
      title: 'Vendoroo mobile job proof',
      text: 'Active build for portal tickets with photos and PDF reports — not a mockup.',
      image: images.jns.src,
      imageAlt: 'Job photo PDF reports',
      badge: 'Active build',
      href: '/case-study-vendoroo-ticket-invoice-system',
      linkLabel: 'Vendoroo case study'
    },
    faq: [
      { q: 'Do crews need a native app?', a: 'Browser mobile flow is default — photos attach from phone browser on job page.' },
      { q: 'Can PDFs include before and after sections?', a: 'Templates scoped per client — sections defined during intake.' },
      { q: 'Storage and retention?', a: 'Scoped per compliance needs — typically cloud storage tied to job ID.' }
    ],
    links: [['/ticketing-invoicing-job-workflows', 'Job Workflows'], ['/contractor-growth-systems', 'Contractor Systems'], ['/stripe-invoice-automation', 'Stripe Automation']],
    cta: { title: 'Need field proof packets?', text: 'Share portal requirements and a sample PDF your managers expect.' }
  },
  {
    slug: 'review-request-systems',
    parent: { href: '/local-visibility-systems', label: 'Local Visibility' },
    title: 'Review Request Systems',
    meta: 'Review request workflows for Google Business Profile growth — timing, links, tracking, and staff triggers.',
    eyebrow: 'Reputation',
    h1: 'Automated Review Request Systems',
    lead: 'Systematic Google review requests after completed jobs — correct GBP links, timing rules, and logging without spamming customers or violating platform policies.',
    heroIcon: 'fa-star',
    problem: {
      kicker: 'Map trust',
      title: 'GBP visibility stalls when reviews are random',
      text: 'Owners ask for reviews when they remember — not when customers are happiest. Competitors with steady review flow win map pack clicks.',
      bullets: [
        'No standard timing after job completion or payment',
        'Staff send wrong GBP review links',
        'No log of who was asked and when',
        'Automated blast tools risk policy violations'
      ],
      media: images.screenTeam
    },
    features: [
      { icon: 'fa-clock', label: 'Timing', title: 'Timing rules', text: 'Send after completion or payment milestones — configurable per trade.' },
      { icon: 'fa-google', label: 'GBP', title: 'GBP-aligned links', text: 'Direct customers to the correct Google review path for your location.' },
      { icon: 'fa-clipboard-check', label: 'Track', title: 'Request logging', text: 'Log sent requests and completed reviews where visibility allows.' },
      { icon: 'fa-user-gear', label: 'Staff', title: 'Staff workflow', text: 'Simple owner or crew trigger — not fully autonomous spam.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Local proof',
        title: 'Reviews support map-pack trades',
        text: 'Screen Team and Faith Works local visibility stacks include review strategy as part of GBP alignment.',
        media: images.screenTeam
      }
    ],
    process: [
      { title: 'GBP link audit', text: 'Verify correct review URL per location and brand.' },
      { title: 'Trigger rules', text: 'Job complete, invoice paid, or manual staff button.' },
      { title: 'Message templates', text: 'Short, policy-safe copy with opt-out respect.' },
      { title: 'Reporting', text: 'Monthly review velocity vs requests sent.' }
    ],
    idealFor: [
      'Home service and contractor businesses on local visibility plans',
      'Owners with satisfied customers but flat review count',
      'Teams wanting staff-triggered requests, not blast software',
      'Multi-location brands needing correct GBP links per office'
    ],
    proof: {
      title: 'Screen Team local visibility stack',
      text: 'Deep local SEO and GBP-aligned structure for a live enclosure company — reviews part of map trust strategy.',
      image: images.screenTeam.src,
      imageAlt: 'Review request local SEO',
      badge: 'Live client',
      href: '/case-study-screen-team',
      linkLabel: 'Screen Team case study'
    },
    faq: [
      { q: 'Do you buy reviews?', a: 'Never — only ethical request timing and correct GBP links.' },
      { q: 'SMS or email requests?', a: 'Either scoped per client; messages stay short and infrequent.' },
      { q: 'Integration with job tracker?', a: 'Ideal trigger is job completion status from ticketing workflow when available.' }
    ],
    links: [['/local-visibility-systems', 'Local Visibility'], ['/service-google-business-profile', 'GBP Services'], ['/home-service-business-growth-systems', 'Home Service Systems']],
    cta: { title: 'Want steady review flow?', text: 'Tell us when customers are happiest in your job cycle — we will design timing rules.' }
  },
  {
    slug: 'service-area-page-strategy',
    parent: { href: '/local-visibility-systems', label: 'Local Visibility' },
    title: 'Service Area Page Strategy',
    meta: 'Service area page strategy — city, county, and service pages that support local search without keyword spam.',
    eyebrow: 'Local SEO',
    h1: 'Service Area Page Strategy for Local Businesses',
    lead: 'Build geography and service coverage the way Google and customers expect — hub pages, useful city content, and internal links proven on Screen Team and Faith Works builds.',
    heroIcon: 'fa-map-location-dot',
    heroImage: images.faithWorks,
    problem: {
      kicker: 'Doorway risk',
      title: 'Copy-paste city pages hurt more than they help',
      text: 'Agencies sell 50 city pages with swapped names and no proof. Google ignores them. Customers bounce. Faith Works and Screen Team show responsible scale.',
      bullets: [
        'City pages with no unique local utility or proof',
        'Service silos missing — everything crammed on homepage',
        'Internal links do not connect hubs to geography',
        'Website metros conflict with GBP service areas'
      ],
      media: images.faithWorks
    },
    features: [
      { icon: 'fa-city', label: 'Geo', title: 'City & county pages', text: 'Useful local pages tied to real service coverage and proof.' },
      { icon: 'fa-sitemap', label: 'Silos', title: 'Service silos', text: 'Separate pages for distinct offers and search intents.' },
      { icon: 'fa-link', label: 'Links', title: 'Internal linking', text: 'Hub pages, breadcrumbs, and crawl paths that make sense.' },
      { icon: 'fa-store', label: 'GBP', title: 'GBP alignment', text: 'Website geography matches profile service areas.' }
    ],
    mediaBlocks: [
      {
        kicker: 'Deep geo',
        title: 'Faith Works 82-page footprint',
        text: 'Land clearing geography at scale with unique utility per region.',
        media: images.faithWorks
      },
      {
        kicker: 'Metro depth',
        title: 'Screen Team city architecture',
        text: 'Pool enclosure metros across Tampa Bay with service-specific hubs.',
        align: 'right',
        media: images.screenTeam
      }
    ],
    process: [
      { title: 'Coverage audit', text: 'Map real service radius vs GBP claimed areas.' },
      { title: 'Hub & silo design', text: 'Service parents and geography children with link rules.' },
      { title: 'Content standards', text: 'What every city page must include — proof, FAQs, CTAs.' },
      { title: 'Launch & Search Console', text: 'Submit, monitor indexing, and fix crawl issues early.' }
    ],
    idealFor: [
      'Contractors serving multiple Tampa Bay metros',
      'Excavation and land clearing with wide counties',
      'Businesses burned by cheap city-page packages',
      'Owners aligning website and GBP geography'
    ],
    proof: {
      title: 'Faith Works service-area scale',
      text: '82 pages of responsible land clearing geography — reference for large-footprint strategy.',
      image: images.faithWorks.src,
      imageAlt: 'Service area page strategy',
      badge: '82 pages',
      href: '/case-study-faith-works',
      linkLabel: 'Faith Works case study'
    },
    faq: [
      { q: 'How many pages do I need?', a: 'Depends on coverage — Screen Team depth for metros; Faith Works scale for multi-county site work. We scope to reality.' },
      { q: 'Do you use AI to write city pages?', a: 'Pages follow human-edited standards with local utility — not bulk AI swap.' },
      { q: 'Ongoing updates?', a: 'New metros or services added with same hub linking rules.' }
    ],
    links: [['/service-local-seo', 'Local SEO Services'], ['/case-study-screen-team', 'Screen Team Example'], ['/excavation-business-growth-systems', 'Excavation Systems']],
    cta: { title: 'Planning geography pages?', text: 'Share your service radius and trades — we will propose hub and city architecture.' }
  }
];

const caseStudies = [
  {
    slug: 'case-study-knight-command',
    badge: 'Internal System',
    title: 'Knight Command',
    h1: 'Knight Command Admin & Ops Shell',
    meta: 'Knight Command at /admin — unified tabs for Command Center, Referrals, Outreach CRM, Email Agent, Social Ops, Social Poster, and Logs with service embeds.',
    lead: 'The internal ops shell behind Knight Logics growth infrastructure — one authenticated place to run referrals, outreach, email, and social workflows without juggling URLs.',
    subhead: 'Built for operator speed with modular embeds on ports 5050, 5100, 8500, and 8501.',
    heroImage: { src: images.caseStudyKnightCommand.src, alt: images.caseStudyKnightCommand.alt },
    tags: ['Internal build', 'Admin shell', 'Embeds', 'Ops tabs'],
    metrics: [
      { value: '7', label: 'Primary ops tabs' },
      { value: '4', label: 'Service embed ports' },
      { value: '/admin', label: 'Operator entry path' }
    ],
    sections: [
      {
        title: 'Problem',
        paragraphs: ['Daily growth operations sprawled across separate URLs for referral tracking, OutreachEngine CRM, Email-Agent, and Social Poster. Context switching slowed outreach review, partner support, and failure triage.'],
        bullets: ['Referral dashboard on one port, CRM on another', 'Email-Agent and social runners opened in orphan tabs', 'No unified log view when automations failed']
      },
      {
        title: 'What was built',
        paragraphs: ['Knight Command at /admin provides a tabbed shell: Command Center, Referrals, Outreach CRM, Email Agent, Social Ops, Social Poster, and Logs. Each tab embeds the live service — referral infrastructure on 5050, Email-Agent on 5100, and Streamlit Social Poster on 8501 alongside related ops views on 8500.'],
        bullets: ['Secure auth before any embed loads', 'Modular tabs so services upgrade independently', 'Logs tab for cross-system failure review']
      },
      {
        title: 'Tools & architecture',
        paragraphs: ['Web-first admin shell with iframe or proxy embeds to Flask OutreachEngine, Email-Agent, and Streamlit runners. Designed for operator workflows documented in the Business Growth Systems and Business Dashboard Development lanes.'],
        bullets: ['Command Center summary orientation', 'Referrals tab → referral-dashboard and /ref/:partner tooling', 'Outreach CRM tab → OutreachEngine queue UI']
      },
      {
        title: 'Early signal',
        paragraphs: ['Operators spend less time hunting localhost ports during daily review. New services slot into tabs instead of requiring bookmark updates across the team.'],
        bullets: ['Faster morning queue review', 'Single login for growth ops', 'Foundation for client-facing admin patterns']
      }
    ],
    stack: ['Custom admin shell', 'OutreachEngine embed', 'Email-Agent :5100', 'Social Poster :8501', 'Referral services :5050'],
    mediaBlocks: [
      {
        kicker: 'Ops embed',
        title: 'Multi-service tab layout',
        text: 'Referrals, CRM, email, and social queues reachable without leaving /admin.',
        media: images.caseStudyKnightCommand
      }
    ],
    timeline: [
      { title: 'Auth & shell', text: 'Deploy /admin with role gate and tab navigation scaffold.' },
      { title: 'CRM & email embeds', text: 'Wire OutreachEngine and Email-Agent on 5100 into dedicated tabs.' },
      { title: 'Social & referral embeds', text: 'Add Social Poster 8501 and referral dashboard 5050 paths.' },
      { title: 'Logs & hardening', text: 'Centralize failure visibility and document port map for operators.' }
    ],
    links: [
      ['/business-growth-systems', 'Growth Systems'],
      ['/business-dashboard-development', 'Dashboard Development'],
      ['/automation', 'Automation Overview']
    ],
    serviceLink: '/business-growth-systems',
    serviceLabel: 'Explore Growth Systems',
    cta: 'Ask about building a similar internal command center for your business operations.'
  },
  {
    slug: 'case-study-crm-outreach-system',
    badge: 'Internal System · Live Workflow',
    title: 'CRM Outreach System',
    h1: 'CRM Outreach Queue & Reply Tracking',
    meta: 'OutreachEngine case study — Flask SQLite CRM with kl/kg/st brands, scheduler first_touch/followup, bounce detection, and daily caps 20–40.',
    lead: 'A live outreach engine for segmented local-service campaigns — OutreachEngine with scheduler jobs, bounce detection, and Email-Agent reply routing.',
    subhead: 'Demonstrates the CRM Outreach & Lead Generation service in production on Screen Team, Faith Works, and Knight Group lanes.',
    heroImage: { src: images.caseStudyCrm.src, alt: images.caseStudyCrm.alt },
    tags: ['OutreachEngine', 'Flask SQLite', 'Reply tracking', 'Multi-brand'],
    metrics: [
      { value: '20–40', label: 'Daily send cap' },
      { value: '3', label: 'Brand lanes kl/kg/st' },
      { value: 'Live', label: 'first_touch + followup' }
    ],
    sections: [
      {
        title: 'Problem',
        paragraphs: ['Manual outreach mixed templates, lists, and sender reputations across Knight Logics client brands. Replies scattered in personal Gmail. Follow-up timing was inconsistent and bounces poisoned future sends.'],
        bullets: ['No queue preview before sends', 'KG and ST campaigns risked cross-brand template mistakes', 'Follow-up depended on someone remembering inbox checks']
      },
      {
        title: 'What was built',
        paragraphs: ['OutreachEngine — Flask app with SQLite storage — drives segmented lists, branded templates, scheduler jobs for first_touch and followup, bounce detection, and daily caps between 20 and 40 sends per brand. Replies route to Email-Agent crm_reply views on port 5100.'],
        bullets: ['Brand switcher for kl, kg, and st lanes', 'Preview and queue depth before scheduler fires', 'Bounce flags suppress bad addresses']
      },
      {
        title: 'Tools used',
        paragraphs: ['Flask + SQLite backend, custom CRM UI, scheduler integration, Email-Agent multi-inbox routing with KL/KG/ST mapping, and Knight Command Outreach CRM tab embed.'],
        bullets: ['Gmail/Zoho/Microsoft inboxes via Email-Agent', 'Campaign logging for lead-source reporting', 'Embeds on port 5050 family alongside referral tooling where co-deployed']
      },
      {
        title: 'Early signal',
        paragraphs: ['Screen Team st lane, Faith Works faithworks lane, and Knight Group kg lane each run on OutreachEngine with separate caps and templates. KG generated substantial booked work from one well-targeted message. Operators see queue health without spreadsheet tracking.'],
        bullets: ['Measurable reply rate per list', 'Follow-up cadence enforced by scheduler', 'Bounce rate visible before reputation damage']
      }
    ],
    stack: ['Flask', 'SQLite', 'OutreachEngine', 'Email-Agent', 'Scheduler', 'Bounce detection'],
    mediaBlocks: [
      {
        kicker: 'Dashboard',
        title: 'Queue preview & send windows',
        text: 'Production CRM interface used on real Tampa Bay campaigns.',
        media: { ...videos.crm, title: 'CRM outreach dashboard', text: 'Segmented lists with cap enforcement.' }
      }
    ],
    timeline: [
      { title: 'List segmentation', text: 'Import and tag lists by trade, geography, and brand fit.' },
      { title: 'Template & cap setup', text: 'Per-brand templates with 20–40 daily send limits.' },
      { title: 'Scheduler jobs', text: 'Configure first_touch and followup with bounce rules.' },
      { title: 'Reply routing', text: 'Connect Email-Agent crm_reply views and reporting.' }
    ],
    proof: {
      title: 'Knight Group campaign results',
      text: 'KG-branded outreach produced real jobs — the business proof behind the CRM engine, not a demo dataset.',
      image: images.kgHero.src,
      imageAlt: 'Knight Group outreach proof',
      badge: 'KG campaign',
      href: '/case-study-knight-group',
      linkLabel: 'Knight Group case study'
    },
    links: [
      ['/crm-outreach-lead-generation', 'CRM Outreach Service'],
      ['/email-agent-automation', 'Email-Agent Automation'],
      ['/case-study-knight-group', 'Knight Group Proof']
    ],
    serviceLink: '/crm-outreach-lead-generation',
    serviceLabel: 'CRM Outreach Service',
    cta: 'We can adapt OutreachEngine for your trade, territory, and brand separation requirements.'
  },
  {
    slug: 'case-study-vendoroo-ticket-invoice-system',
    badge: 'Active Build · Internal Workflow',
    title: 'Vendoroo Ticket & Invoice System',
    h1: 'Vendor Portal Ticket Intake & Invoice Automation',
    meta: 'Vendoroo-style ticket intake, mobile job tracking, photos, PDF reports, and Stripe invoices — active build reference (not in public repo).',
    lead: 'Field-service workflow for portal tickets — intake queue, mobile status updates, photo proof, PDF packets, and Stripe invoice triggers in one system.',
    subhead: 'Represents the Ticketing, Invoicing & Job Workflows flagship offer.',
    heroImage: { src: images.caseStudyVendoroo.src, alt: images.caseStudyVendoroo.alt },
    tags: ['Ticket intake', 'Mobile jobs', 'PDF proof', 'Stripe invoices'],
    metrics: [
      { value: '1', label: 'Ticket-to-invoice path' },
      { value: 'Mobile', label: 'Field updates' },
      { value: 'Active', label: 'Build status' }
    ],
    sections: [
      {
        title: 'Problem',
        paragraphs: ['Property maintenance vendors received portal tickets, completed work in the field, and then rebuilt proof and invoices manually. Photos sat on phones. PDFs were recreated per manager format. Stripe invoices were typed separately from job records.'],
        bullets: ['Ticket details copied into side systems', 'No required photo step before closeout', 'Billing lag after job completion', 'Payment status not on job screen']
      },
      {
        title: 'What was built',
        paragraphs: ['Active Vendoroo-style build: ticket intake queue, mobile-friendly job updates, photo attachments per job ID, branded PDF completion reports, and Stripe invoice or payment link triggers on completion milestones. Implementation is an internal reference — code is not in the public repository.'],
        bullets: ['Assignment and status workflow for field crews', 'PDF export structured for portal upload', 'Webhook sync for paid invoice status']
      },
      {
        title: 'Tools used',
        paragraphs: ['Custom job tracker UI, mobile browser photo capture, PDF generation service, Stripe payment links, and optional Email-Agent notifications on status changes.'],
        bullets: ['Stripe invoice automation lane integration', 'Job photo PDF reports sub-service patterns', 'Owner dashboard for open vs billed jobs']
      },
      {
        title: 'Early signal',
        paragraphs: ['Cleaner vendor workflow with less manual re-entry after each portal job. Office staff sees photo proof before invoice goes out. Field crews follow a consistent closeout path.'],
        bullets: ['Reduced billing delay', 'Fewer portal rejections on proof format', 'Foundation for similar client vendor builds']
      }
    ],
    stack: ['Custom job tracker', 'PDF generation', 'Stripe', 'Mobile web capture'],
    mediaBlocks: [
      {
        kicker: 'Field ops',
        title: 'Ticket queue to mobile proof',
        text: 'Representative workflow for portal-driven maintenance vendors.',
        media: images.caseStudyVendoroo
      }
    ],
    timeline: [
      { title: 'Ticket intake', text: 'Queue portal and manual ticket sources into one record model.' },
      { title: 'Mobile job flow', text: 'Status steps and required photo capture on site.' },
      { title: 'PDF proof', text: 'Branded completion packet generation per job.' },
      { title: 'Stripe trigger', text: 'Invoice on completion with paid status sync.' }
    ],
    links: [
      ['/ticketing-invoicing-job-workflows', 'Job Workflow Service'],
      ['/stripe-invoice-automation', 'Stripe Automation'],
      ['/job-photo-pdf-reports', 'Photo & PDF Reports']
    ],
    serviceLink: '/ticketing-invoicing-job-workflows',
    serviceLabel: 'Job Workflow Service',
    cta: 'Ideal for property maintenance vendors and portal-driven field work needing ticket-to-invoice discipline.'
  },
  {
    slug: 'case-study-hospitality-system-pattern',
    badge: 'Capability Pattern · Pending Client Approval',
    title: 'Hospitality System Pattern',
    h1: 'Restaurant Events, Menu & Ordering System Pattern',
    meta: 'Hospitality growth system pattern — events, admin-editable menus, ordering infrastructure, and local visibility. Client case studies publish after approval and site transfer.',
    lead: 'How Knight Logics builds restaurant and bar sites — admin-editable menus and events, ordering-ready architecture, and hospitality UX without a bloated POS platform. No client branding until ownership approves public marketing.',
    subhead: 'Capability documentation until hospitality case studies are cleared for publication.',
    heroImage: { src: images.hospitalityEvents.src, alt: images.hospitalityEvents.alt },
    tags: ['Restaurant', 'Events', 'Ordering', 'Admin editable'],
    metrics: [
      { value: 'Pattern', label: 'Documented stack' },
      { value: 'Admin', label: 'Editable menus' },
      { value: 'Ordering', label: 'Flow ready' }
    ],
    sections: [
      {
        title: 'Problem',
        paragraphs: ['Menu specials, events, and hours outgrow a basic brochure site. Social-only event posts fragment the brand. Ownership needs staff-friendly content updates and a path to order-ahead without immediate Toast integration.'],
        bullets: ['PDF menus stale within days', 'Events not discoverable on owned website', 'No pickup or order-ahead on brand domain', 'GBP hours and specials misaligned']
      },
      {
        title: 'What we build',
        paragraphs: ['Hand-coded hospitality sites with admin-editable menus and events, mobile-first layout, ordering flow preparation, and local visibility alignment. Architecture leaves hooks for future POS integration when kitchen volume justifies it.'],
        bullets: ['Content admin patterns for non-developer staff', 'Event calendar UX on owned domain', 'Stripe-ready ordering path scoped to ops']
      },
      {
        title: 'Tools used',
        paragraphs: ['Hand-coded site, admin content patterns, schema for local discovery, and ordering flow components shared with the online-ordering-systems lane.'],
        bullets: ['Restaurant-bar-growth-systems service template', 'Local visibility and review strategy at launch', 'Fictional UI mockups until client photography is approved']
      },
      {
        title: 'Publication status',
        paragraphs: ['Hospitality client case studies — including live URLs, metrics, and branded photography — publish only after client approval and site hosting transfer. This page documents the reusable system pattern in the meantime.'],
        bullets: ['No client names on public marketing until sign-off', 'Ordering flow tested in staging environments', 'GBP alignment scheduled pre-launch for approved clients']
      }
    ],
    stack: ['Hand-coded HTML/CSS/JS', 'Admin content patterns', 'Stripe-ready checkout', 'LocalBusiness schema'],
    links: [
      ['/restaurant-bar-growth-systems', 'Restaurant Systems'],
      ['/online-ordering-systems', 'Ordering Systems'],
      ['/local-visibility-systems', 'Local Visibility']
    ],
    serviceLink: '/restaurant-bar-growth-systems',
    serviceLabel: 'Restaurant Systems',
    cta: 'Planning a restaurant or bar site with events and ordering? Start with a consult on content workflow and kitchen ops.'
  },
  {
    slug: 'case-study-roof-monsters',
    badge: 'Client Preview',
    title: 'Roof Monsters',
    h1: 'Roofing Brand Site & Lead System Preview',
    meta: 'Roof Monsters roofing brand website and local lead system in development — trust pages, service-area SEO, and estimate-first CTAs.',
    lead: 'Roofing growth system preview for Tampa Bay — local SEO structure, insurance-friendly trust pages, and estimate-first lead capture tuned for storm-season markets.',
    subhead: 'Labeled preview until public launch is approved by the client.',
    heroImage: { src: images.caseStudyRoofing.src, alt: images.caseStudyRoofing.alt },
    tags: ['Roofing', 'Local SEO', 'Lead capture', 'Preview'],
    metrics: [
      { value: 'Preview', label: 'Launch status' },
      { value: 'SEO', label: 'City + service silos' },
      { value: 'CRM-ready', label: 'Lead intake' }
    ],
    sections: [
      {
        title: 'Problem',
        paragraphs: ['Roof Monsters needed credible web presence and inspection lead paths before storm season push. Prior digital footprint did not communicate service areas, project proof, or insurance-adjacent FAQs homeowners expect.'],
        bullets: ['Thin trust content for estimate-first roofing sales', 'Missing city pages for target metros', 'Inspection requests not tracked in CRM', 'GBP and website messaging misaligned']
      },
      {
        title: 'What is being built',
        paragraphs: ['Service pages, project proof layout, insurance-friendly FAQ content, city geography pages, and estimate-first conversion paths. Lead forms wired for future OutreachEngine intake with daily caps and reply routing.'],
        bullets: ['Schema and internal linking for local discovery', 'Call and form CTAs above the fold on mobile', 'Referral partner paths planned for complementary trades']
      },
      {
        title: 'Tools used',
        paragraphs: ['Hand-coded site, LocalBusiness and FAQ schema, GBP-aligned structure, and roofing-business-growth-systems service patterns.'],
        bullets: ['roofing-business-growth-systems sub-page alignment', 'Optional CRM outreach when launch stabilizes', 'Review request timing post-job completion']
      },
      {
        title: 'Status',
        paragraphs: ['Client preview — detailed metrics and live URL marketing publish when launch is approved. Serves as the roofing vertical reference for contractor growth systems.'],
        bullets: ['Preview badge on case study until go-live', 'Content review with ownership ongoing', 'Storm-season readiness prioritized in IA']
      }
    ],
    stack: ['Hand-coded site', 'Schema.org', 'GBP alignment', 'Form intake'],
    links: [
      ['/roofing-business-growth-systems', 'Roofing Systems'],
      ['/contractor-growth-systems', 'Contractor Systems'],
      ['/local-visibility-systems', 'Local Visibility']
    ],
    serviceLink: '/roofing-business-growth-systems',
    serviceLabel: 'Roofing Systems',
    cta: 'Roofing companies can scope a similar launch system with trust pages, geography depth, and CRM-ready lead intake.'
  },
  {
    slug: 'case-study-social-poster',
    badge: 'Internal System · Live Workflow',
    title: 'Social Poster',
    h1: 'Multi-Brand Social Posting Runners',
    meta: 'Social Poster on Streamlit 8501 — queued content, X/Facebook API, GBP API, Playwright for Nextdoor/LinkedIn, failure reporting.',
    lead: 'Production social runners on port 8501 — Streamlit queue UI, API bridge for X and Facebook, GBP API posts, Playwright for Nextdoor and LinkedIn, with visible failures in Social Ops tabs.',
    subhead: 'Supports the Social Media Automation Systems service lane inside Knight Command.',
    heroImage: { src: images.caseStudySocial.src, alt: images.caseStudySocial.alt },
    tags: ['Streamlit 8501', 'Playwright', 'API bridge', 'Multi-brand'],
    metrics: [
      { value: '8501', label: 'Social Poster port' },
      { value: 'API+PW', label: 'Hybrid runners' },
      { value: 'Multi', label: 'Brand queues' }
    ],
    sections: [
      {
        title: 'Problem',
        paragraphs: ['Silent automation failures left brand accounts quiet for days. Pure API tools could not post everywhere Nextdoor and LinkedIn required browser automation. GBP posts were disconnected from the same queue as X and Facebook.'],
        bullets: ['No failure alert when scheduled post broke', 'Credentials mixed across KL, KG, and ST brands', 'LinkedIn and Nextdoor needed Playwright runners', 'GBP updates manual and inconsistent']
      },
      {
        title: 'What was built',
        paragraphs: ['Social Poster — Streamlit app on port 8501 — manages per-brand content queues, posting windows, API bridge for X and Facebook, GBP API integration, and Playwright runners for Nextdoor and LinkedIn. Embedded in Knight Command Social Poster and Social Ops tabs with Logs cross-reference.'],
        bullets: ['Isolated queues per brand lane', 'Posting window enforcement', 'Failure surfaced in UI and ops logs']
      },
      {
        title: 'Tools used',
        paragraphs: ['Streamlit UI, Python API clients, Playwright browser runners, GBP API, and Knight Command embed on 8501. Complements local-visibility-systems GBP strategy with scheduled posts.'],
        bullets: ['X and Facebook via API where stable', 'Nextdoor and LinkedIn via Playwright when required', 'Credential vault per company brand']
      },
      {
        title: 'Early signal',
        paragraphs: ['More reliable posting cadence with fewer surprise gaps. Operators see last success per platform without checking each network manually. Social Ops tab reduces context switching during weekly content review.'],
        bullets: ['Failed posts visible same day', 'Brand separation prevents wrong-account posts', 'GBP posts align with website campaigns']
      }
    ],
    stack: ['Streamlit', 'Playwright', 'X API', 'Facebook API', 'GBP API', 'Python'],
    mediaBlocks: [
      {
        kicker: 'Queue UI',
        title: 'Social Poster Streamlit dashboard',
        text: 'Multi-brand scheduling with failure reporting on port 8501.',
        media: { ...videos.social, title: 'Social media manager', text: 'Queued posts and runner status.' }
      }
    ],
    timeline: [
      { title: 'Channel mapping', text: 'API vs Playwright path per platform and brand.' },
      { title: 'Queue & credentials', text: 'Isolate KL, KG, ST queues with posting windows.' },
      { title: 'Runner deploy', text: 'API bridge plus Playwright workers and GBP API.' },
      { title: 'Knight Command embed', text: 'Social Poster tab with Logs integration.' }
    ],
    links: [
      ['/social-media-automation-systems', 'Social Automation'],
      ['/case-study-knight-command', 'Knight Command'],
      ['/local-visibility-systems', 'Local Visibility']
    ],
    serviceLink: '/social-media-automation-systems',
    serviceLabel: 'Social Automation',
    cta: 'Ask about Social Poster-style runners for your company accounts and GBP post cadence.'
  },
  {
    slug: 'case-study-referral-network-system',
    badge: 'Internal System · Live Workflow',
    title: 'Referral Network System',
    h1: 'Referral Codes, QR Brochures & Partner Attribution',
    meta: 'Referral tracking with /ref/:partner paths, Neon Postgres events, referral-dashboard QR/payouts, and Stripe webhook settlement.',
    lead: 'The referral infrastructure behind Knight Logics partner program — QR brochure links, partner codes, Neon Postgres event logging, dashboard visibility, and Stripe webhook payouts.',
    subhead: 'Supports Referral Network Systems and the public Referral Program.',
    heroImage: { src: images.caseStudyReferral.src, alt: images.caseStudyReferral.alt },
    tags: ['Referral codes', 'QR brochures', 'Neon Postgres', 'Stripe webhooks'],
    metrics: [
      { value: '/ref/:partner', label: 'Tracked paths' },
      { value: 'Neon', label: 'Postgres events' },
      { value: 'Stripe', label: 'Webhook payouts' }
    ],
    sections: [
      {
        title: 'Problem',
        paragraphs: ['Partner referrals were hard to attribute fairly. Brochure QR scans and word-of-mouth consults looked identical in generic analytics. Payout earned vs paid lived in spreadsheets and partner disputes slowed network growth.'],
        bullets: ['No unique landing path per partner', 'Form submits dropped referral context', 'Payout status opaque to partners', 'Scaling local trade network without trust']
      },
      {
        title: 'What was built',
        paragraphs: ['Referral network with /ref/:partner entry paths, QR brochure assets, tracked consult forms, Neon Postgres event store, /referral-dashboard for partner visibility, and Stripe webhook-driven payout status. Embeds on port 5050 family inside Knight Command Referrals tab.'],
        bullets: ['Event log for scans, forms, and conversions', 'Partner dashboard without owner-only data leaks', 'Webhook settlement for earned referral fees']
      },
      {
        title: 'Tools used',
        paragraphs: ['Custom referral dashboard, Neon Postgres, Stripe webhooks, tracked landing paths, and Knight Command embed. Documented in referral-network-systems flagship and api-integration-services lanes.'],
        bullets: ['QR assets for print brochures', 'Attribution windows defined in program terms', 'API integration for payment status sync']
      },
      {
        title: 'Early signal',
        paragraphs: ['Cleaner partner attribution before scaling Tampa Bay trade network experiments. Partners self-serve status checks instead of email disputes. Owners see which QR campaigns and codes produce consults.'],
        bullets: ['Dispute reduction on referral credit', 'Faster partner onboarding with codes', 'Data-backed network expansion decisions']
      }
    ],
    stack: ['Neon Postgres', 'Stripe webhooks', 'Custom dashboard', '/ref routing', 'QR generation'],
    mediaBlocks: [
      {
        kicker: 'Live dashboard',
        title: 'Partner attribution & payouts',
        text: 'referral-dashboard with QR tracking and Stripe settlement visibility.',
        media: { ...videos.referral, title: 'Referral system dashboard', text: 'Partner leads and payout progress.' }
      }
    ],
    timeline: [
      { title: 'Program terms', text: 'Define fees, attribution windows, and partner onboarding.' },
      { title: 'Paths & QR', text: 'Deploy /ref/:partner routes and brochure assets.' },
      { title: 'Neon events', text: 'Log scans, forms, and conversion events.' },
      { title: 'Stripe payouts', text: 'Webhook settlement and partner dashboard visibility.' }
    ],
    proof: {
      title: 'Knight Command Referrals tab',
      text: 'Referral ops embedded at /admin alongside CRM and email — single operator shell for partner support.',
      image: images.logo.src,
      imageAlt: 'Knight Command referrals embed',
      badge: 'Embedded ops',
      href: '/case-study-knight-command',
      linkLabel: 'Knight Command case study'
    },
    links: [
      ['/referral-network-systems', 'Referral Systems'],
      ['/referral-program', 'Join Referral Program'],
      ['/api-integration-services', 'API Integrations']
    ],
    serviceLink: '/referral-network-systems',
    serviceLabel: 'Referral Systems',
    cta: 'We can build referral tracking for your company or local trade partner network with QR paths and payout visibility.'
  }
];

const allSlugs = [...flagshipPages, ...subPages, ...caseStudies].map((x) => x.slug);
module.exports = { VER: '20260701hero4', flagshipPages, subPages, caseStudies, allSlugs };
