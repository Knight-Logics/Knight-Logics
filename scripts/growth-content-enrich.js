const {
  KG,
  FW,
  ST,
  KG_STATS,
  FW_STATS,
  ST_STATS,
  TRIO_PROOF,
  TRIO_STATS,
  kgMediaBlock,
  clientMediaBlockForSlug,
  clientStatsForSlug,
  hasClientMediaBlock,
  primaryClientForSlug,
  CLIENT_MEDIA_SLUGS
} = require('./growth-content-client-facts');

const PROOF = {
  kg: {
    href: '/case-study-knight-group',
    image: '/images/KGHero.webp',
    imageAlt: 'Knight Group handyman website',
    title: 'Knight Group — 97-page growth architecture',
    text: `${KG.lighthouse.performance}/100/${KG.lighthouse.seo} Lighthouse scores, booking flow, and kg OutreachEngine lane with real booked work.`,
    badge: 'Live client'
  },
  screenTeam: {
    href: '/case-study-screen-team',
    image: ST.media.src,
    imageAlt: ST.media.alt,
    title: 'Screen Team — 36-page growth system',
    text: `${ST.pageCount} indexable pages for pool enclosure and screen repair across Tampa Bay — st OutreachEngine lane, Email-Agent mapping, and full growth stack.`,
    badge: 'Live client'
  },
  knightCommand: {
    href: '/case-study-knight-command',
    image: '/images/showcase/case-study-knight-command-mockup.webp',
    imageAlt: 'Knight Command admin shell with outreach, referrals, and ops tabs',
    title: 'Knight Command ops shell',
    text: 'Unified /admin tabs for CRM, email, social, referrals, and logs on ports 5050–8501.',
    badge: 'Internal system'
  },
  crmOutreach: {
    href: '/case-study-crm-outreach-system',
    image: '/images/showcase/case-study-crm-outreach-mockup.webp',
    imageAlt: 'CRM outreach queue dashboard with segmented lists and reply routing',
    title: 'OutreachEngine in production',
    text: 'Flask SQLite CRM with kl, kg, st, and faithworks brand lanes — scheduler cadence and Email-Agent reply routing on live client campaigns.',
    badge: 'Live workflow'
  },
  vendoroo: {
    href: '/case-study-vendoroo-ticket-invoice-system',
    image: '/images/showcase/case-study-vendoroo-ticket-mockup.webp',
    imageAlt: 'Vendor portal ticket intake, mobile job flow, and Stripe invoice trigger',
    title: 'Vendoroo-style ticket workflow',
    text: 'Portal intake, mobile proof, PDF packets, and Stripe invoice triggers in one path.',
    badge: 'Active build'
  },
  referral: {
    href: '/case-study-referral-network-system',
    image: '/images/showcase/case-study-referral-network-mockup.webp',
    imageAlt: 'Referral network dashboard with QR attribution and payout visibility',
    title: 'Referral network infrastructure',
    text: '/ref/:partner paths, Neon Postgres events, QR brochures, and Stripe webhook payouts.',
    badge: 'Live workflow'
  },
  socialPoster: {
    href: '/case-study-social-poster',
    image: '/images/showcase/case-study-social-poster-mockup.webp',
    imageAlt: 'Multi-brand social posting queue with API and Playwright runners',
    title: 'Social Poster on port 8501',
    text: 'Multi-brand queues with API and Playwright runners plus GBP post integration.',
    badge: 'Live workflow'
  },
  hospitalityPattern: {
    href: '/case-study-hospitality-system-pattern',
    image: '/images/showcase/hospitality-menus-ordering-mockup.webp',
    imageAlt: 'Illustration of admin-editable menu specials and order-ahead checkout',
    title: 'Hospitality system pattern',
    text: 'Events calendar, admin-editable menus, and ordering-ready architecture — client case studies publish after approval.',
    badge: 'Pending approval'
  },
  roofMonsters: {
    href: '/case-study-roof-monsters',
    image: '/images/showcase/case-study-roofing-lead-mockup.webp',
    imageAlt: 'Roofing lead capture form with trust pages and local SEO silos',
    title: 'Roof Monsters roofing preview',
    text: 'Trust pages, city geography, and estimate-first inspection lead paths.',
    badge: 'Client preview'
  },
  faithWorks: {
    href: '/case-study-faith-works',
    image: FW.media.src,
    imageAlt: FW.media.alt,
    title: 'Faith Works — 82-page growth system',
    text: `${FW.pageCount} land clearing and forestry mulching pages across Central Florida — faithworks OutreachEngine lane, schema, GA4/GSC, and GBP alignment in the full growth stack.`,
    badge: 'Live client'
  },
  jns: {
    href: '/case-study-jns',
    image: '/images/JNS-HomeImage.webp',
    imageAlt: 'JNS Construction website',
    title: 'JNS Construction bundle',
    text: 'Focused contractor website launch with service clarity and conversion paths.',
    badge: 'Live client'
  },
  farrellElectric: {
    href: '/case-study-farrell-electric',
    image: 'https://farrell-electric.github.io/farrell-electric-website/HeroImage.png',
    imageAlt: 'Farrell Electric website',
    title: 'Farrell Electric starter launch',
    text: 'Multi-page electrician site with essential SEO and contact conversion — open lane reference.',
    badge: 'Case study'
  },
  salsPainting: {
    href: '/case-study-sals-painting',
    image: 'https://salspaintingrenovation.com/SalsHeroImage.png',
    imageAlt: "Sal's Painting website",
    title: "Sal's Painting search-ready site",
    text: 'Search-optimized painter launch with analytics, schema, and brand foundation.',
    badge: 'Case study'
  }
};

function applyKgReplacements(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/19 pages/gi, '97 indexable pages')
    .replace(/19-page/gi, '97-page');
}

function applyKgReplacementsDeep(obj) {
  if (obj == null) return obj;
  if (typeof obj === 'string') return applyKgReplacements(obj);
  if (Array.isArray(obj)) return obj.map(applyKgReplacementsDeep);
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === 'value' && v === '19' && typeof obj.label === 'string' && /knight group/i.test(obj.label)) {
        out[k] = '97';
      } else {
        out[k] = applyKgReplacementsDeep(v);
      }
    }
    return out;
  }
  return obj;
}

function hasAnyClientMediaBlock(blocks) {
  return hasClientMediaBlock(blocks, 'kg') || hasClientMediaBlock(blocks, 'fw') || hasClientMediaBlock(blocks, 'st');
}

function mergeStats(existing, extra) {
  if (!extra || !extra.length) return existing;
  if (!existing || !existing.length) return extra;
  const labels = new Set(existing.map((s) => s.label));
  return [...existing, ...extra.filter((s) => !labels.has(s.label))];
}

function deepMerge(page, enrichment) {
  const merged = applyKgReplacementsDeep(JSON.parse(JSON.stringify(page)));
  for (const key of Object.keys(enrichment)) {
    if (key === 'mediaBlocks' && enrichment.mediaBlocks) {
      merged.mediaBlocks = [...(merged.mediaBlocks || []), ...enrichment.mediaBlocks];
    } else if (key === 'stats' && enrichment.stats) {
      merged.stats = mergeStats(merged.stats, enrichment.stats);
    } else {
      merged[key] = enrichment[key];
    }
  }
  return merged;
}

function defaultProofGrid(slug) {
  const trio = [PROOF.faithWorks, PROOF.screenTeam, PROOF.kg];
  const map = {
    'business-growth-systems': [PROOF.faithWorks, PROOF.screenTeam, PROOF.kg],
    'crm-outreach-lead-generation': [PROOF.crmOutreach, PROOF.screenTeam, PROOF.faithWorks],
    'ticketing-invoicing-job-workflows': [PROOF.vendoroo, PROOF.jns, PROOF.screenTeam],
    'referral-network-systems': [PROOF.referral, PROOF.knightCommand, PROOF.faithWorks],
    'local-visibility-systems': [PROOF.faithWorks, PROOF.screenTeam, PROOF.kg],
    'website-growth-audit': [PROOF.faithWorks, PROOF.screenTeam, PROOF.kg],
    'online-ordering-systems': [PROOF.hospitalityPattern, PROOF.screenTeam, PROOF.faithWorks],
    'contractor-growth-systems': [PROOF.screenTeam, PROOF.faithWorks, PROOF.kg],
    'home-service-business-growth-systems': [PROOF.screenTeam, PROOF.faithWorks, PROOF.kg],
    'performance-partner-program': [PROOF.faithWorks, PROOF.knightCommand, PROOF.crmOutreach],
    'handyman-business-growth-systems': [PROOF.kg, PROOF.crmOutreach, PROOF.screenTeam],
    'electrician-business-growth-systems': [PROOF.farrellElectric, PROOF.kg, PROOF.screenTeam],
    'painter-business-growth-systems': [PROOF.salsPainting, PROOF.kg, PROOF.screenTeam],
    'roofing-business-growth-systems': [PROOF.roofMonsters, PROOF.faithWorks, PROOF.jns],
    'screen-enclosure-business-growth-systems': [PROOF.screenTeam, PROOF.faithWorks, PROOF.kg],
    'excavation-business-growth-systems': [PROOF.faithWorks, PROOF.screenTeam, PROOF.kg],
    'restaurant-bar-growth-systems': [PROOF.hospitalityPattern, PROOF.screenTeam, PROOF.faithWorks],
    'case-study-knight-command': [PROOF.crmOutreach, PROOF.referral, PROOF.socialPoster],
    'case-study-crm-outreach-system': [PROOF.screenTeam, PROOF.faithWorks, PROOF.kg],
    'case-study-vendoroo-ticket-invoice-system': [PROOF.jns, PROOF.vendoroo, PROOF.screenTeam],
    'case-study-referral-network-system': [PROOF.knightCommand, PROOF.faithWorks, PROOF.crmOutreach]
  };
  if (map[slug]) return map[slug];
  if (slug.startsWith('case-study-')) return [PROOF.knightCommand, PROOF.faithWorks, PROOF.screenTeam];
  return trio;
}

const enrichments = {
  'business-growth-systems': {
    context: {
      title: 'Why connected growth systems beat disconnected tools',
      paragraphs: [
        'Small and local businesses rarely fail because they lack a website — they fail because leads, follow-up, referrals, and field work live in separate tabs with no shared truth. A growth system wires the website, local discovery, outreach, automation, and reporting into lanes your team will actually open daily.',
        'Knight Logics also runs a Tampa Bay trade partner network: build the online presence, publish a case study when launch is ready, assign a referral lane, and co-market with complementary service partners through tracked QR paths and /ref/:partner attribution.',
        'Three live growth-system anchors prove the stack — Faith Works (82 land-clearing pages, faithworks lane), Screen Team (36 enclosure pages, st lane), and Knight Group (97 handyman pages, kg lane) — plus OutreachEngine, Email-Agent, Social Poster, and Knight Command at /admin.'
      ]
    },
    deliverables: [
      { title: 'Foundation & discovery', items: ['Hand-coded website with conversion paths and analytics baselines', 'Technical SEO, schema, and Google Business alignment', 'Service-area page architecture scaled to your trade and metros', 'PageSpeed-first builds without bloated page builders'] },
      { title: 'Lead & partner lanes', items: ['OutreachEngine CRM with segmented lists and daily send caps', 'Email-Agent reply routing into crm_reply views', 'Referral /ref/:partner paths with QR brochure assets', 'Review request timing tied to job completion'] },
      { title: 'Ops visibility', items: ['Knight Command-style admin embeds or owner dashboards', 'Queue depth and lead-source reporting readable on mobile', 'Monthly review cadence with prioritized next moves', 'Written scope per lane — not a one-size agency retainer'] }
    ],
    connections: {
      kicker: 'Trade network flywheel',
      title: 'Build → case study → referral lane → co-marketing',
      text: 'Each new trade partner gets a growth stack, a published proof page when ready, and a slot in the complementary referral roster. Mass outreach and partner campaigns scale as the network grows.',
      bullets: ['Website & audit → local visibility and conversion baselines', 'CRM outreach → Email-Agent reply discipline', 'Referral network → Stripe webhook settlement and partner dashboard', 'Industry trade lanes document the playbook per vertical'],
      links: [['/referral-network-systems', 'Referral Systems'], ['/contractor-growth-systems', 'Trade Lanes'], ['/case-study-referral-network-system', 'Referral Case Study']]
    },
    outcomes: [
      { title: 'Fewer lost leads', text: 'Form fills and outreach replies route into tracked queues instead of personal inboxes that get checked inconsistently.' },
      { title: 'Defensible attribution', text: 'Referral partners, outreach lists, and GBP actions tie back to consults and booked work — not vanity traffic.' },
      { title: 'Operator speed', text: 'Morning review happens in one shell with queue depth, failures, and next sends visible without hunting localhost ports.' },
      { title: 'Scalable geography', text: 'City and service silos match how customers search — Faith Works at 82 pages and Screen Team at 36 show the pattern across trades, with Knight Group at 97 for handyman depth.' }
    ],
    stats: TRIO_STATS
  },
  'crm-outreach-lead-generation': {
    context: {
      title: 'Production outreach, not spreadsheet Gmail',
      paragraphs: [
        'CRM outreach for local service businesses needs brand separation, send caps, bounce discipline, and reply routing — not copy-paste from a shared spreadsheet. OutreachEngine is the live engine behind kl, kg, st, and faithworks brand lanes.',
        'Screen Team (st lane), Faith Works (faithworks lane), and Knight Group (kg lane) each run isolated templates, caps, and sender identity. KG produced substantial booked work from one well-targeted campaign; ST and FW use the same engine at enclosure and land-clearing scale.',
        'Replies surface in Email-Agent crm_reply views on port 5100 so operators review outreach responses without mixing them into personal Gmail threads.'
      ]
    },
    deliverables: [
      { title: 'List & segmentation', items: ['ICP definition by trade, geography, and company size', 'Import and tag lists with bounce suppression rules', 'Property manager, HOA, and complementary trade segments', 'Preview sends before scheduler jobs fire'] },
      { title: 'Engine configuration', items: ['Per-brand sender profiles for kl/kg/st separation', 'first_touch and followup scheduler jobs with 20–40 daily caps', 'Template library with proof links and service context', 'Bounce detection flags before reputation damage'] },
      { title: 'Reply & reporting', items: ['Email-Agent crm_reply routing on port 5100', 'Queue depth and send window visibility in CRM UI', 'Lead-source reporting by list and message variant', 'Knight Command Outreach CRM tab embed when co-deployed'] }
    ],
    connections: {
      kicker: 'Reply path',
      title: 'OutreachEngine → Email-Agent → operator review',
      text: 'Outreach sends from OutreachEngine; replies land in Email-Agent views mapped to the correct brand lane; operators triage from Knight Command or dedicated CRM tabs.',
      bullets: ['Flask + SQLite backend with reliable scheduler', 'Brand switcher prevents cross-template mistakes', 'Failure and bounce visibility before the week is wasted', 'Live proof on Screen Team, Faith Works, and Knight Group lanes'],
      links: [['/email-agent-automation', 'Email-Agent'], ['/case-study-crm-outreach-system', 'CRM Case Study'], ['/case-study-screen-team', 'Screen Team Proof']]
    },
    outcomes: [
      { title: 'Predictable pipeline', text: 'Follow-up cadence enforced by scheduler instead of depending on someone remembering inbox checks.' },
      { title: 'Protected reputation', text: 'Daily caps and bounce suppression keep domains healthy while lists scale.' },
      { title: 'Brand-safe sends', text: 'KG, KL, and ST lanes stay isolated — templates and senders do not cross-contaminate.' },
      { title: 'Measurable replies', text: 'Reply rate per list and message variant visible for weekly operator review.' }
    ]
  },
  'ticketing-invoicing-job-workflows': {
    context: {
      title: 'One path from portal ticket to paid invoice',
      paragraphs: [
        'Property maintenance vendors and field trades often receive work through vendor portals, complete jobs on site, then rebuild proof and invoices manually. Photos sit on phones, PDFs get recreated per manager format, and Stripe invoices are typed separately from job records.',
        'The ticketing lane unifies intake queue, mobile status updates, photo attachments per job ID, branded PDF completion packets, and Stripe invoice or payment link triggers on completion milestones.',
        'The Vendoroo-style active build documents the pattern — internal reference workflow for portal-driven vendors, integrated with job-photo-pdf-reports and stripe-invoice-automation sub-lanes.'
      ]
    },
    deliverables: [
      { title: 'Intake & assignment', items: ['Vendor portal, email, and manual ticket sources into one queue', 'Assignment rules and status workflow for field crews', 'Mobile-friendly job updates from phone or tablet on site', 'Required photo step before closeout when configured'] },
      { title: 'Proof & billing', items: ['Field photos tied to job ID — not camera rolls', 'Branded PDF completion reports for portal upload', 'Stripe invoice or payment link on completion trigger', 'Webhook sync for paid invoice status on job screen'] },
      { title: 'Owner visibility', items: ['Open jobs vs billed jobs dashboard', 'Bottleneck alerts for overdue invoices', 'Optional Email-Agent notifications on status changes', 'Integration hooks for property manager portal formats'] }
    ],
    connections: {
      kicker: 'Field ops stack',
      title: 'Ticket → photo → PDF → Stripe',
      text: 'Sub-services cover specialized layers; the flagship lane scopes the full ticket-to-invoice path for portal-heavy vendors.',
      bullets: ['job-photo-pdf-reports for completion packet patterns', 'stripe-invoice-automation for payment link triggers', 'Vendoroo case study as active internal build reference', 'Contractor growth systems for trades adding ops after site launch'],
      links: [['/job-photo-pdf-reports', 'Photo & PDF Reports'], ['/stripe-invoice-automation', 'Stripe Automation'], ['/case-study-vendoroo-ticket-invoice-system', 'Vendoroo Case Study']]
    },
    outcomes: [
      { title: 'Less re-entry', text: 'Office staff stops copying ticket details into side systems and rebuilding invoices from scratch.' },
      { title: 'Faster billing', text: 'Photo proof visible before invoice goes out — reducing billing lag after job completion.' },
      { title: 'Portal compliance', text: 'PDF packets structured for manager upload formats — fewer rejections on proof.' },
      { title: 'Payment clarity', text: 'Paid status syncs back to the job record instead of living only in Stripe.' }
    ]
  },
  'referral-network-systems': {
    context: {
      title: 'Partner attribution that scales trust',
      paragraphs: [
        'Referral partners send work through brochures, word of mouth, and complementary trades — but generic analytics cannot tell you which partner earned credit. Disputes slow network growth when payout status lives in spreadsheets.',
        'The referral infrastructure uses /ref/:partner entry paths, QR brochure assets, Neon Postgres event logging, referral-dashboard partner visibility, and Stripe webhook-driven payout settlement.',
        'Knight Command embeds referral ops on the 5050 family inside the Referrals tab — partners self-serve status checks instead of email disputes with ownership.'
      ]
    },
    deliverables: [
      { title: 'Tracking infrastructure', items: ['/ref/:partner landing paths with consult form attribution', 'QR brochure assets for print and field distribution', 'Neon Postgres event store for scans, forms, and conversions', 'Attribution windows defined in written program terms'] },
      { title: 'Partner experience', items: ['referral-dashboard with earned vs paid visibility', 'Partner onboarding with unique codes and assets', 'Webhook settlement for referral fee status', 'Data boundaries — partners see their stats, not owner-only leaks'] },
      { title: 'Program operations', items: ['Knight Command Referrals tab embed', 'Stripe webhook integration for payout sync', 'Monthly owner review of top-performing partners', 'API integration hooks for CRM and invoicing lanes'] }
    ],
    connections: {
      kicker: 'Network growth',
      title: 'Referrals connect to outreach and growth systems',
      text: 'Referral partners complement outbound CRM — attribution must be defensible before scaling Tampa Bay trade network experiments.',
      bullets: ['business-growth-systems for full stack deployment', 'api-integration-services for Stripe and Neon wiring', 'performance-partner-program when shared upside fits', 'case-study-referral-network-system documents live workflow'],
      links: [['/referral-program', 'Join Referral Program'], ['/case-study-referral-network-system', 'Referral Case Study'], ['/api-integration-services', 'API Integrations']]
    },
    outcomes: [
      { title: 'Dispute reduction', text: 'Partners check earned vs paid status in dashboard instead of arguing over spreadsheet rows.' },
      { title: 'Faster onboarding', text: 'Unique codes and QR assets deploy in days — not weeks of custom dev per partner.' },
      { title: 'Data-backed expansion', text: 'Owners see which QR campaigns and partner codes produce consults before scaling network spend.' },
      { title: 'Embedded ops', text: 'Referral support happens inside Knight Command without orphan dashboard URLs.' }
    ]
  },
  'local-visibility-systems': {
    context: {
      title: 'Map-pack readiness tied to real geography',
      paragraphs: [
        'Local visibility is more than meta tags — it is Google Business Profile alignment, service-area page architecture, schema validation, internal linking, and content that matches how customers search by city and service intent.',
        'Faith Works deploys 82 indexable land-clearing pages across Polk County and Central Florida — service silos plus city and area coverage with schema, GA4/GSC, and faithworks OutreachEngine lane in the growth stack.',
        'Screen Team runs 36 indexable enclosure and screen-repair pages across Tampa Bay metros with st OutreachEngine lane and Email-Agent ST mapping.',
        'Knight Group adds the handyman reference at 97 pages — 36 service silos, 30+ city pages, Lighthouse 96 performance, and kg lane campaigns that produced real booked work.'
      ],
      note: 'Local visibility assumes a conversion-ready website — audit and fix foundation gaps before scaling city pages.'
    },
    deliverables: [
      { title: 'Technical foundation', items: ['LocalBusiness, FAQ, and BreadcrumbList schema', 'Search Console setup and indexation monitoring', 'PageSpeed-first hand-coded builds', 'Canonical and internal linking architecture'] },
      { title: 'Geography & GBP', items: ['Service-area hub and city page strategy', 'Google Business Profile cleanup and post cadence', 'Sitelink-aligned booking or estimate paths', 'Review request timing post-job completion'] },
      { title: 'Content & proof', items: ['Service silo pages for distinct repair intents', 'Project galleries and trust signals', 'GBP post alignment with website campaigns', 'service-area-page-strategy documentation for expansion'] }
    ],
    connections: {
      kicker: 'Discovery stack',
      title: 'SEO, GBP, and social post cadence',
      text: 'Local visibility connects to social-media-automation-systems for scheduled GBP posts and review-request-systems for reputation growth.',
      bullets: ['website-growth-audit for baseline before build', 'Faith Works 82-page footprint for wide geography trades', 'Screen Team 36-page depth for metro enclosure coverage', 'Knight Group 97-page handyman reference when trade fits'],
      links: [['/service-area-page-strategy', 'Service Area Strategy'], ['/review-request-systems', 'Review Requests'], ['/case-study-screen-team', 'Screen Team Example']]
    },
    outcomes: [
      { title: 'Search intent match', text: 'City and service pages align to how customers actually query — not generic national template copy.' },
      { title: 'Rich result eligibility', text: 'Schema validated for LocalBusiness, FAQ, and review snippets where content supports it.' },
      { title: 'GBP coherence', text: 'Profile hours, services, and posts match owned website messaging.' },
      { title: 'Measurable geography', text: 'Indexable page count and rankings tracked per metro — Faith Works (82), Screen Team (36), and Knight Group (97) show responsible scale by trade.' }
    ]
  },
  'website-growth-audit': {
    context: {
      title: 'Baseline before build scope',
      paragraphs: [
        'A growth audit documents what is broken, what is working, and which lanes deserve investment before anyone writes code. Most local businesses discover conversion gaps, schema issues, GBP misalignment, and automation bottlenecks they did not know existed.',
        'Audits cover website clarity, technical SEO, lead capture paths, outreach readiness, referral attribution gaps, and ops visibility — prioritized by impact and your team\'s capacity to adopt new tools.',
        TRIO_PROOF + ' Use these live baselines when comparing your foundation to a production growth stack.'
      ]
    },
    deliverables: [
      { title: 'Website & conversion review', items: ['Mobile CTA placement and offer clarity', 'Page speed and Core Web Vitals snapshot', 'Form and call tracking gaps', 'Analytics and Search Console access check'] },
      { title: 'Discovery assessment', items: ['Schema and indexation review', 'GBP alignment vs owned site', 'Service-area coverage vs actual crew radius', 'Competitor geography gap analysis'] },
      { title: 'Systems readiness', items: ['CRM and outreach maturity score', 'Referral attribution documentation', 'Automation and dashboard opportunity map', 'Written prioritized recommendation list'] }
    ],
    connections: {
      kicker: 'Audit → build path',
      title: 'Findings map to flagship lanes',
      text: 'Audit output routes to business-growth-systems, individual lanes, or trade-specific sub-pages depending on urgency and budget.',
      bullets: ['Free audit entry point before paid scope', 'Faith Works and Screen Team for large geography trades', 'Knight Group benchmark when handyman depth applies', 'No obligation to adopt full stack — lane-scoped builds available'],
      links: [['/business-growth-systems', 'Growth Systems'], ['/book-consultation', 'Book Consultation'], ['/performance-partner-program', 'Partner Program']]
    },
    outcomes: [
      { title: 'Clear priorities', text: 'Owners receive ranked fixes — not a 40-page generic SEO report.' },
      { title: 'Scoped investment', text: 'Build quotes tied to documented gaps instead of template package pricing.' },
      { title: 'Baseline captured', text: 'Metrics documented before launch — essential for performance partnerships.' },
      { title: 'Honest fit assessment', text: 'We flag when a simple site refresh is enough vs when full systems make sense.' }
    ]
  },
  'online-ordering-systems': {
    context: {
      title: 'Owned-domain ordering without POS lock-in',
      paragraphs: [
        'Restaurants and retail businesses often outgrow brochure sites but are not ready for full Toast or Square ecosystem lock-in. Ordering-ready architecture on an owned domain keeps brand control while leaving hooks for future POS integration.',
        'The hospitality lane documents a reusable system pattern — admin-editable menus and events, mobile-first layout, Stripe-ready checkout path, and local visibility alignment. Client-branded case studies publish after approval and site transfer.',
        'Hand-coded builds avoid bloated page builders that tank mobile performance during peak order windows.'
      ]
    },
    deliverables: [
      { title: 'Ordering architecture', items: ['Menu and category structure with mobile cart UX', 'Stripe-ready checkout or payment link patterns', 'Pickup vs delivery flow scoping', 'Admin-editable content for non-developer staff'] },
      { title: 'Hospitality UX', items: ['Events calendar on owned domain', 'Hours and specials sync patterns', 'LocalBusiness schema for discovery', 'Photography and brand alignment'] },
      { title: 'Launch readiness', items: ['GBP alignment before public marketing', 'Ordering flow staging and test transactions', 'Kitchen ops consultation on volume fit', 'Future POS integration hooks documented'] }
    ],
    connections: {
      kicker: 'Hospitality lane',
      title: 'Pairs with restaurant-bar-growth-systems',
      text: 'Ordering is one layer of the hospitality growth stack — events, local SEO, and review strategy launch together when client approves go-live.',
      bullets: ['restaurant-bar-growth-systems for full hospitality scope', 'case-study-hospitality-system-pattern for capability documentation', 'local-visibility-systems for GBP and schema', 'stripe-invoice-automation patterns for payment sync'],
      links: [['/restaurant-bar-growth-systems', 'Restaurant Systems'], ['/case-study-hospitality-system-pattern', 'Hospitality System Pattern'], ['/local-visibility-systems', 'Local Visibility']]
    },
    outcomes: [
      { title: 'Brand-owned checkout', text: 'Customers order on your domain — not a third-party marketplace that owns the relationship.' },
      { title: 'Staff-friendly updates', text: 'Menu and event changes without developer tickets for daily specials.' },
      { title: 'Performance-safe UX', text: 'Hand-coded mobile layout handles peak traffic without page builder bloat.' },
      { title: 'POS-ready path', text: 'Architecture documents future integration when kitchen volume justifies it.' }
    ]
  },
  'contractor-growth-systems': {
    context: {
      title: 'Trades need visibility, leads, and ops — not templates',
      paragraphs: [
        'Contractor and field trades join a repeatable playbook: launch a credible online presence, publish a case study on knightlogics.com when ready, and plug into complementary referrals with tracked attribution.',
        'Established network anchors — Screen Team (enclosure), Faith Works (excavation), Knight Group (handyman) — prove depth at 36, 82, and 97 pages. Open lanes like electricians and painters add new partners using the same infrastructure.',
        'Each trade lane page describes the stack for prospects in that vertical — not a client microsite. Reference builds show what is possible; your brand gets its own lane, outreach caps, and referral codes.'
      ]
    },
    deliverables: [
      { title: 'Trade web & SEO', items: ['Service silo pages for distinct repair intents', 'City and service-area pages for real crew radius', 'Call-first and estimate CTAs above the fold on mobile', 'LocalBusiness and FAQ schema validation'] },
      { title: 'Lead systems', items: ['OutreachEngine for property managers and complementary trades', 'Form tracking with CRM intake rules', 'Referral /ref/:partner paths for partner trades', 'Review requests at job completion'] },
      { title: 'Field ops add-ons', items: ['Ticket intake for vendor portal work', 'Job photos and PDF proof packets', 'Stripe invoice triggers on completion', 'Owner dashboard for open vs billed jobs'] }
    ],
    connections: {
      kicker: 'Trade lane index',
      title: 'Network anchors + open recruitment lanes',
      text: 'Sub-pages document each vertical playbook. Anchors have live reference builds; open lanes actively recruit electricians, painters, and adjacent trades.',
      bullets: ['screen-enclosure — Screen Team reference (36 pages)', 'excavation — Faith Works reference (82 pages)', 'handyman — Knight Group reference (97 pages)', 'electrician & painter — open lanes with case study starters'],
      links: [['/electrician-business-growth-systems', 'Electrician Lane'], ['/painter-business-growth-systems', 'Painter Lane'], ['/referral-network-systems', 'Referral Network']]
    },
    outcomes: [
      { title: 'Geography that converts', text: 'City pages match metros crews actually serve — reducing unqualified estimate requests.' },
      { title: 'Outbound beyond referrals', text: 'Property manager and HOA outreach runs on production OutreachEngine patterns.' },
      { title: 'Portal discipline', text: 'Ticket-to-invoice path available when vendor portal work dominates ops.' },
      { title: 'Trade-specific proof', text: 'Case studies per vertical — not one generic contractor portfolio page.' }
    ],
    stats: TRIO_STATS
  },
  'home-service-business-growth-systems': {
    context: {
      title: 'Property-facing trades live on urgent calls and repeat work',
      paragraphs: [
        'Home service businesses — handyman, cleaning, painting, screen repair — compete on speed. Customers call three competitors in ten minutes; slow sites, hidden phone numbers, and stale GBP profiles lose the visit before you quote.',
        'Screen Team demonstrates the residential growth stack at 36 pages — st OutreachEngine lane, quote-first CTAs, and Tampa Bay metro coverage for enclosure and screen repair.',
        'Faith Works and Knight Group round out the proof set at 82 and 97 pages respectively — wide geography vs handyman depth — all on the same OutreachEngine and Email-Agent infrastructure.'
      ]
    },
    deliverables: [
      { title: 'Conversion foundation', items: ['Fast hand-coded sites with prominent call and form CTAs', 'Service list and trust signals above the fold on mobile', 'Booking integration when estimate flow supports it', 'After-hours intake or auto-acknowledge paths'] },
      { title: 'Discovery & reputation', items: ['GBP cleanup and post cadence', 'Service-area pages for Tampa Bay metros', 'Review request systems at job completion', 'Schema for LocalBusiness and FAQ content'] },
      { title: 'Growth lanes', items: ['OutreachEngine for property managers and HOAs', 'Referral partner QR and /ref paths', 'Email-Agent follow-up routing', 'Light ops automation when volume justifies'] }
    ],
    connections: {
      kicker: 'Residential focus',
      title: 'Call-first vs contractor portal work',
      text: 'Home service lane emphasizes repeat residential and call-first conversion; contractor lane adds heavier portal and excavation footprints.',
      bullets: ['screen-enclosure-business-growth-systems for enclosure trades', 'handyman-business-growth-systems for estimate-first crews', 'local-visibility-systems for map-pack readiness', 'review-request-systems for reputation growth'],
      links: [['/screen-enclosure-business-growth-systems', 'Screen Enclosure Systems'], ['/local-visibility-systems', 'Local Visibility'], ['/case-study-screen-team', 'Screen Team Case Study']]
    },
    outcomes: [
      { title: 'Faster first response', text: 'Leads route into tracked queues — not voicemail black holes.' },
      { title: 'Map visibility', text: 'GBP and city pages aligned to how homeowners search by service and metro.' },
      { title: 'Repeat work growth', text: 'Review and referral systems capture customers who would otherwise forget your name.' },
      { title: 'Outbound optionality', text: 'Property manager outreach scales when referral-only lead flow plateaus.' }
    ],
    stats: ST_STATS
  },
  'performance-partner-program': {
    context: {
      title: 'Shared upside with written attribution rules',
      paragraphs: [
        'Monthly agency retainers rarely tie fees to measurable outcomes. Performance partnerships need a base fee for systems work, a 90-day measurement window, baseline captured before launch, and written scope on what counts as a attributable lead or booking.',
        'Partnership fit assumes tracking infrastructure exists or will be built — CRM outreach, analytics, referral attribution, and owner dashboards from the business-growth-systems lane.',
        TRIO_PROOF + ' Documented baselines on all three clients exemplify the measurement foundation performance terms require.'
      ]
    },
    deliverables: [
      { title: 'Partnership structure', items: ['Base monthly fee for systems and maintenance work', 'Performance component tied to agreed metrics', '90-day measurement window with frozen baseline', 'Minimum term, cancellation, and dispute terms in writing'] },
      { title: 'Attribution infrastructure', items: ['Call, form, booking, or revenue signal definitions', 'CRM and referral attribution wiring', 'Monthly owner dashboard with caps and failures', 'Knight Command-style visibility for queue review'] },
      { title: 'Reporting cadence', items: ['Monthly review with tracked outcomes', 'Prioritized next actions from ops data', 'Vanity metric exclusion from performance counts', 'Written changelog when scope or metrics adjust'] }
    ],
    connections: {
      kicker: 'Systems prerequisite',
      title: 'Performance requires measurable lanes',
      text: 'We do not offer performance-only deals on brochure sites without tracking — foundation and systems lanes deploy first or in parallel.',
      bullets: ['business-growth-systems as typical partnership stack', 'website-growth-audit for baseline documentation', 'referral-network-systems for partner attribution', 'crm-outreach-lead-generation for pipeline metrics'],
      links: [['/business-growth-systems', 'Growth Systems'], ['/website-growth-audit', 'Growth Audit'], ['/book-consultation', 'Book Consultation']]
    },
    outcomes: [
      { title: 'Aligned incentives', text: 'Both parties know what counts before work starts — reducing attribution fights later.' },
      { title: 'Defensible metrics', text: 'Leads and bookings tracked in systems — not guessed from analytics spikes.' },
      { title: 'Predictable base', text: 'Systems maintenance funded while performance component rewards shared upside.' },
      { title: 'Exit clarity', text: 'Cancellation and dispute process agreed upfront — not negotiated under pressure.' }
    ]
  },
  'ai-business-automation': {
    context: {
      title: 'Automation that matches daily ops — not demo chatbots',
      paragraphs: [
        'AI business automation for local companies means routing email, generating social drafts, triaging CRM replies, and connecting internal tools — not deploying a generic chatbot that nobody maintains.',
        'Knight Logics production lanes include Email-Agent on port 5100, Social Poster on 8501, OutreachEngine scheduler jobs, and Knight Command embeds that operators actually open during morning review.',
        'Automation scope stays lean: wire what your team will use weekly, document failure paths, and surface errors in Logs tabs instead of silent breakage.'
      ]
    },
    deliverables: [
      { title: 'Communication automation', items: ['Email-Agent multi-inbox routing with brand mapping', 'CRM reply triage into crm_reply views', 'Template-assisted outreach drafts with human send approval', 'Auto-acknowledge paths for after-hours form fills'] },
      { title: 'Content & social lanes', items: ['Social Poster queue with API and Playwright runners', 'GBP post scheduling aligned to campaigns', 'Failure reporting in Social Ops tabs', 'Per-brand credential isolation for KL/KG/ST'] },
      { title: 'Internal tool wiring', items: ['workflow-automation between existing SaaS and custom tools', 'api-integration-services for webhooks and data sync', 'business-dashboard-development for owner visibility', 'Documented port map and operator runbooks'] }
    ],
    connections: {
      kicker: 'Automation map',
      title: 'Sub-lanes cover specialized patterns',
      text: 'AI automation is the umbrella; email-agent, social-media, workflow, and API lanes scope individual deployments.',
      bullets: ['email-agent-automation for inbox routing depth', 'social-media-automation-systems for port 8501 runners', 'internal-business-tools for custom operator UIs', 'case-study-knight-command for embed architecture'],
      links: [['/email-agent-automation', 'Email-Agent'], ['/social-media-automation-systems', 'Social Automation'], ['/workflow-automation', 'Workflow Automation']]
    },
    outcomes: [
      { title: 'Visible failures', text: 'Broken automations surface same day in ops logs — not discovered when customers complain.' },
      { title: 'Human-in-the-loop', text: 'Outreach and social sends respect caps and approval where brand risk matters.' },
      { title: 'Less tab switching', text: 'Services embed in Knight Command instead of orphan localhost bookmarks.' },
      { title: 'Adoptable scope', text: 'Phased rollout so teams are not overwhelmed on day one.' }
    ]
  },
  'internal-business-tools': {
    context: {
      title: 'Operator UIs your team will actually open',
      paragraphs: [
        'Internal business tools are custom dashboards, intake forms, job trackers, and admin shells built for how your team sells and delivers — not off-the-shelf CRM features you never configure.',
        'Knight Command at /admin is the reference pattern: tabbed shell with embeds to referral dashboard, OutreachEngine, Email-Agent, and Social Poster on documented ports.',
        'Internal tools prioritize mobile-readable layouts, role gates, and modular upgrades so one service can deploy without rebuilding the entire admin.'
      ]
    },
    deliverables: [
      { title: 'Admin & dashboards', items: ['Authenticated /admin or operator entry paths', 'Tab or sidebar navigation to live service embeds', 'Mobile-readable queue and metric cards', 'Role-based access before embeds load'] },
      { title: 'Operational UIs', items: ['Job tracker and ticket intake interfaces', 'Partner and referral dashboard views', 'Content admin for non-developer staff', 'Failure and log aggregation tabs'] },
      { title: 'Integration layer', items: ['iframe or proxy embeds to Flask and Streamlit services', 'Webhook receivers for Stripe and portal events', 'api-integration-services for third-party sync', 'Documented port and service map for operators'] }
    ],
    connections: {
      kicker: 'Build patterns',
      title: 'Extends business-dashboard-development',
      text: 'Dashboard development scopes reporting; internal tools add interactive operator workflows and embed architecture.',
      bullets: ['business-dashboard-development for owner metrics', 'case-study-knight-command as shell reference', 'ticketing-invoicing for field job UIs', 'workflow-automation for background jobs behind UIs'],
      links: [['/business-dashboard-development', 'Dashboard Development'], ['/case-study-knight-command', 'Knight Command'], ['/api-integration-services', 'API Integrations']]
    },
    outcomes: [
      { title: 'Single login', text: 'Operators authenticate once to reach growth and ops tools.' },
      { title: 'Modular upgrades', text: 'New services slot into tabs without redesigning the entire admin.' },
      { title: 'Field usability', text: 'Job and ticket UIs work on phone browsers crews already carry.' },
      { title: 'Reduced shadow IT', text: 'Replace spreadsheets with tools wired to your actual data stores.' }
    ]
  },
  'api-integration-services': {
    context: {
      title: 'Webhooks and sync that survive production',
      paragraphs: [
        'API integration services connect Stripe, Neon Postgres, vendor portals, CRMs, and custom dashboards with webhook receivers, retry logic, and visible failure states — not one-off scripts that break silently.',
        'Referral network infrastructure depends on Stripe webhook settlement, Neon event logging, and /ref path routing. Ticketing lanes sync invoice paid status back to job records.',
        'Integrations are documented with operator runbooks so failures triage from Logs tabs instead of emergency developer calls.'
      ]
    },
    deliverables: [
      { title: 'Webhook infrastructure', items: ['Stripe payment and payout event receivers', 'Signed webhook validation and idempotency', 'Failure queue with retry and alert surfacing', 'Event log for audit and dispute resolution'] },
      { title: 'Data sync', items: ['Neon Postgres or SQLite event stores', 'CRM and form attribution piping', 'Portal ticket intake connectors', 'Third-party SaaS API clients with rate limit handling'] },
      { title: 'Operator visibility', items: ['Dashboard status for last successful sync', 'Knight Command Logs cross-reference', 'Written integration map per client', 'Staging validation before production cutover'] }
    ],
    connections: {
      kicker: 'Integration touchpoints',
      title: 'Powers referral, billing, and portal lanes',
      text: 'Most API work supports flagship lanes — referral payouts, Stripe invoices, and vendor portal intake.',
      bullets: ['referral-network-systems for Stripe + Neon pattern', 'stripe-invoice-automation for billing triggers', 'ticketing-invoicing for portal sync', 'case-study-referral-network-system as live reference'],
      links: [['/referral-network-systems', 'Referral Systems'], ['/stripe-invoice-automation', 'Stripe Automation'], ['/case-study-referral-network-system', 'Referral Case Study']]
    },
    outcomes: [
      { title: 'Reliable settlement', text: 'Referral payouts and invoice status sync without manual spreadsheet reconciliation.' },
      { title: 'Audit trail', text: 'Event logs support partner disputes and accounting review.' },
      { title: 'Faster triage', text: 'Failed webhooks visible in ops UI same day.' },
      { title: 'Portable patterns', text: 'Reusable integration templates across client deployments.' }
    ]
  },
  'workflow-automation': {
    context: {
      title: 'Background jobs that respect caps and failures',
      paragraphs: [
        'Workflow automation connects scheduler jobs, email triggers, social posting windows, invoice milestones, and internal notifications — with daily caps, bounce rules, and failure reporting built in.',
        'OutreachEngine first_touch and followup jobs, Social Poster posting windows, and Stripe completion triggers exemplify production workflow patterns already running on Knight Logics infrastructure.',
        'Automations fail visibly: Logs tabs and dashboard alerts replace silent breakage that leaves brand accounts quiet for days.'
      ]
    },
    deliverables: [
      { title: 'Scheduler & triggers', items: ['Cron or scheduler jobs with preview and cap enforcement', 'Status-change triggers for tickets and invoices', 'Follow-up cadence rules for outreach lanes', 'Posting window enforcement for social queues'] },
      { title: 'Notification paths', items: ['Email-Agent notifications on job or ticket changes', 'Operator alerts for failed runner executions', 'Optional SMS or webhook hooks to external systems', 'Digest summaries for weekly review'] },
      { title: 'Safety & governance', items: ['Daily send caps between 20 and 40 per brand', 'Bounce suppression before reputation damage', 'Idempotent webhook handling', 'Runbooks for pause and resume during incidents'] }
    ],
    connections: {
      kicker: 'Workflow map',
      title: 'Spans outreach, social, and billing',
      text: 'Workflow automation is the connective tissue between CRM, Email-Agent, Social Poster, and Stripe lanes.',
      bullets: ['crm-outreach-lead-generation for scheduler patterns', 'social-media-automation-systems for 8501 runners', 'stripe-invoice-automation for billing triggers', 'ai-business-automation as parent lane'],
      links: [['/crm-outreach-lead-generation', 'CRM Outreach'], ['/case-study-social-poster', 'Social Poster'], ['/workflow-automation', 'Automation Overview']]
    },
    outcomes: [
      { title: 'Consistent cadence', text: 'Follow-ups and posts fire on schedule — not when someone remembers.' },
      { title: 'Cap discipline', text: 'Send and post limits protect domain and account reputation.' },
      { title: 'Same-day failure visibility', text: 'Broken jobs surface in ops UI before customers notice gaps.' },
      { title: 'Composable workflows', text: 'New triggers added without rebuilding unrelated lanes.' }
    ]
  },
  'business-dashboard-development': {
    context: {
      title: 'Owner-readable metrics — not vanity traffic',
      paragraphs: [
        'Business dashboards for local operators need queue depth, lead sources, referral attribution, failed automations, and open jobs — readable on mobile during a morning coffee review.',
        'Knight Command Command Center tab orients operators to cross-system health; referral-dashboard and OutreachEngine provide lane-specific views embedded in one shell.',
        'Dashboards tie to real data stores — Neon Postgres events, OutreachEngine SQLite, Stripe webhooks — not exported CSVs refreshed manually.'
      ]
    },
    deliverables: [
      { title: 'Metric design', items: ['Lead source and conversion signal definitions', 'Queue depth and next-action cards', 'Referral earned vs paid summaries', 'Failed automation and bounce counters'] },
      { title: 'Dashboard UI', items: ['Mobile-first layout for owner review', 'Embeds inside Knight Command or standalone paths', 'Role gates for owner vs operator views', 'Monthly export or snapshot for partnerships'] },
      { title: 'Data plumbing', items: ['Queries against Neon, SQLite, or client DB', 'api-integration-services for external metrics', 'Performance-partner reporting cadence when applicable', 'Documentation of metric definitions'] }
    ],
    connections: {
      kicker: 'Visibility layer',
      title: 'Supports performance partnerships and daily ops',
      text: 'Dashboards make business-growth-systems and performance-partner-program measurable.',
      bullets: ['performance-partner-program for 90-day windows', 'case-study-knight-command for embed shell', 'referral-network-systems for partner metrics', 'crm-outreach-lead-generation for pipeline counts'],
      links: [['/performance-partner-program', 'Partner Program'], ['/case-study-knight-command', 'Knight Command'], ['/business-growth-systems', 'Growth Systems']]
    },
    outcomes: [
      { title: 'Morning clarity', text: 'Owners see what needs attention in under two minutes.' },
      { title: 'Partnership-ready', text: 'Baselines and monthly reports support performance fee terms.' },
      { title: 'Failure awareness', text: 'Bounce spikes and runner failures visible before weekly review.' },
      { title: 'Mobile adoption', text: 'Layouts designed for phone — not desktop-only BI tools.' }
    ]
  },
  'email-agent-automation': {
    context: {
      title: 'Multi-inbox routing with brand discipline',
      paragraphs: [
        'Email-Agent on port 5100 routes CRM outreach replies, manual conversations, and brand-mapped inboxes for Knight Logics, Knight Group, Screen Team, and Faith Works — separate from personal Gmail chaos.',
        'crm_reply views surface OutreachEngine responses so operators triage outreach without mixing threads into everyday email. KG campaign replies stay in the kg lane.',
        'Email-Agent complements OutreachEngine: sends originate in CRM; replies return to tracked views embedded in Knight Command Email Agent tab.'
      ]
    },
    deliverables: [
      { title: 'Inbox wiring', items: ['Gmail, Zoho, or Microsoft inbox connections', 'Brand mapping for kl, kg, and st lanes', 'crm_reply views separate from manual mail', 'Thread tagging for lead-source attribution'] },
      { title: 'Routing rules', items: ['Outreach reply detection and queue surfacing', 'Auto-acknowledge templates for after-hours intake', 'Forward rules for escalation paths', 'Bounce and failure notifications to operators'] },
      { title: 'Operator embed', items: ['Knight Command Email Agent tab on port 5100', 'Mobile-readable reply triage layout', 'Integration with OutreachEngine campaign logging', 'Runbook for daily morning review'] }
    ],
    connections: {
      kicker: 'Reply loop',
      title: 'OutreachEngine sends → Email-Agent receives',
      text: 'CRM outreach case study documents the full send-and-reply loop in production on KG and ST campaigns.',
      bullets: ['crm-outreach-lead-generation for send configuration', 'case-study-crm-outreach-system for live workflow', 'Screen Team st and Faith Works faithworks lanes as live proof', 'workflow-automation for notification triggers'],
      links: [['/crm-outreach-lead-generation', 'CRM Outreach'], ['/case-study-crm-outreach-system', 'CRM Case Study'], ['/case-study-screen-team', 'Screen Team Proof']]
    },
    outcomes: [
      { title: 'Reply discipline', text: 'Outreach responses reviewed daily from dedicated views — not buried in personal inbox.' },
      { title: 'Brand separation', text: 'KG replies do not appear in KL or ST mapped views by accident.' },
      { title: 'Faster follow-up', text: 'Operators see unread crm_reply count without searching Gmail labels.' },
      { title: 'Audit trail', text: 'Campaign logging ties replies back to list and message variant.' }
    ]
  },
  'social-media-automation-systems': {
    context: {
      title: 'Multi-brand queues with failure reporting',
      paragraphs: [
        'Social Poster on Streamlit port 8501 manages per-brand content queues, posting windows, API bridge for X and Facebook, GBP API posts, and Playwright runners for Nextdoor and LinkedIn.',
        'Pure API tools cannot post everywhere — Nextdoor and LinkedIn often need browser automation. Hybrid runners with visible failures replaced silent gaps that left accounts quiet for days.',
        'Social Ops and Social Poster tabs in Knight Command embed the queue UI with Logs cross-reference when runners break.'
      ]
    },
    deliverables: [
      { title: 'Queue & scheduling', items: ['Per-brand isolated queues for KL, KG, ST', 'Posting window enforcement by platform', 'Content preview before scheduled send', 'Failure counters per platform and brand'] },
      { title: 'Runner infrastructure', items: ['X and Facebook API clients where stable', 'Playwright workers for Nextdoor and LinkedIn', 'GBP API integration for local post cadence', 'Credential vault per company brand'] },
      { title: 'Operator experience', items: ['Streamlit dashboard on port 8501', 'Knight Command Social Poster tab embed', 'Last success timestamp per platform', 'Logs integration for failure triage'] }
    ],
    connections: {
      kicker: 'Local + social',
      title: 'GBP posts align with local-visibility strategy',
      text: 'Social automation complements local SEO — scheduled GBP posts match website campaigns.',
      bullets: ['local-visibility-systems for discovery foundation', 'case-study-social-poster documents port 8501 workflow', 'case-study-knight-command for embed pattern', 'ai-business-automation as parent lane'],
      links: [['/case-study-social-poster', 'Social Poster Case Study'], ['/local-visibility-systems', 'Local Visibility'], ['/case-study-knight-command', 'Knight Command']]
    },
    outcomes: [
      { title: 'Reliable cadence', text: 'Scheduled posts fire with fewer surprise multi-day gaps.' },
      { title: 'Wrong-account prevention', text: 'Brand isolation stops KG content posting to ST credentials.' },
      { title: 'Same-day failure visibility', text: 'Broken runners surface in UI — not discovered during weekly audit.' },
      { title: 'GBP consistency', text: 'Profile posts align with owned-site promotions.' }
    ]
  },
  'handyman-business-growth-systems': {
    context: {
      title: 'Handyman network anchor — Knight Group benchmark',
      paragraphs: [
        'This trade lane recruits handyman and general repair partners into the Knight Logics growth stack — Knight Group is the live reference build, not a template for your brand.',
        'Estimate-first handyman companies need fast sites, booking paths, property manager outreach, and optional job records — built around how small crews actually sell in Tampa Bay.',
        'Knight Group runs 97 indexable pages per knightgroup.com/sitemap.xml — 36 service silos, 30+ city pages across Pinellas, Hillsborough, and Pasco, 8 project galleries — with Lighthouse 96/100/100 and /booking estimate surface.',
        'KG runs as the kg brand lane in OutreachEngine with separate templates and caps from Knight Logics and Screen Team. One targeted campaign produced substantial booked work.'
      ],
      note: 'Page count scales to your services and metros — 97 pages is the live benchmark, not a minimum package.'
    },
    deliverables: [
      { title: 'Site & local SEO', items: ['Service silo pages for distinct repair intents', 'City handyman pages across your service radius', 'LocalBusiness, FAQ, and BreadcrumbList schema', 'Lighthouse-first hand-coded HTML on GitHub Pages'] },
      { title: 'Conversion paths', items: ['/booking estimate-first surface aligned to GBP sitelinks', 'Call-first CTAs above the fold on mobile', 'Project galleries for trust and proof', 'Separate business phone and email routing'] },
      { title: 'Growth lanes', items: ['kg OutreachEngine campaigns for property managers and HOAs', 'Email-Agent crm_reply routing for outreach responses', 'Review request timing at job completion', 'Optional ticket and invoice ops for portal work'] }
    ],
    connections: {
      kicker: 'Live benchmark',
      title: 'Knight Group architecture at full scale',
      text: 'Handyman sub-page scopes estimate-first patterns documented on the live Knight Group deployment.',
      bullets: [`${KG.breakdown.servicePages} /Services/ pages for repair intents`, `${KG.breakdown.cityPages}+ city pages — ${KG.geography}`, KG.outreachNote, 'contractor-growth-systems parent for multi-trade context'],
      links: [['/case-study-knight-group', 'Knight Group Case Study'], ['/crm-outreach-lead-generation', 'CRM Outreach'], ['/contractor-growth-systems', 'Contractor Systems']]
    },
    outcomes: [
      { title: 'Search coverage', text: '97-page architecture matches how homeowners search by service and city.' },
      { title: 'Booking intent', text: 'Estimate surface captures sitelink and GBP action traffic.' },
      { title: 'Outbound pipeline', text: 'Property manager outreach on production OutreachEngine — not manual Gmail blasts.' },
      { title: 'Technical proof', text: 'Lighthouse 96 performance with validated Rich Results schema.' }
    ],
    stats: KG_STATS
  },
  'electrician-business-growth-systems': {
    context: {
      title: 'Open electrician lane — recruit into the network',
      paragraphs: [
        'Electrical contractors need a credible owned presence before complementary trades will send attributed referral work. Thin templates and missing service pages lose map-pack clicks to competitors with clearer residential and commercial offers.',
        'Farrell Electric documents the starter launch pattern — multi-page site, essential SEO, and contact conversion — as the first case study in the open electrician lane.',
        'Joining the lane means your brand domain, outreach caps, /ref/:partner paths, and a knightlogics.com proof page when launch is ready — alongside handyman, HVAC, and GC partners in the Tampa Bay roster.'
      ]
    },
    deliverables: [
      { title: 'Site & conversion', items: ['Residential and commercial service silos', 'Emergency and estimate CTAs above the fold', 'Trust signals — license, insurance, service area', 'Analytics and Search Console baseline'] },
      { title: 'Local discovery', items: ['GBP categories aligned to website services', 'Service-area pages for metros you mobilize to', 'LocalBusiness and FAQ schema', 'Map-pack messaging consistency'] },
      { title: 'Network onboarding', items: ['Referral slot with tracked /ref/:partner paths', 'QR brochure paths for complementary trades', 'Optional OutreachEngine for builder and PM lists', 'Case study publish when you approve marketing'] }
    ],
    connections: {
      kicker: 'Open lane',
      title: 'Farrell Electric starter reference',
      text: 'First electrician case study in the recruitment lane — not a client microsite; your build becomes the next proof.',
      bullets: ['case-study-farrell-electric for launch detail', 'contractor-growth-systems parent hub', 'referral-network-systems for attribution stack', 'handyman-business-growth-systems for complementary referrals'],
      links: [['/case-study-farrell-electric', 'Farrell Electric Case Study'], ['/referral-network-systems', 'Referral Network'], ['/contractor-growth-systems', 'Contractor Systems']]
    },
    outcomes: [
      { title: 'Credible referrals', text: 'Partners send work when your site proves service scope and contact paths.' },
      { title: 'Search foundation', text: 'Schema and GSC baseline before scaling city or service depth.' },
      { title: 'Attributed network', text: '/ref paths document complementary trade sources — not verbal handoffs.' },
      { title: 'Scalable outreach', text: 'OutreachEngine lanes when builder and PM lists justify outbound.' }
    ]
  },
  'painter-business-growth-systems': {
    context: {
      title: 'Open painting lane — search-ready recruitment',
      paragraphs: [
        'Painting companies compete on portfolio clarity and service intent — interior, exterior, cabinet, and commercial jobs rank differently. One generic page cannot capture how homeowners and remodelers search.',
        "Sal's Painting demonstrates the search-ready starter — analytics, schema, brand package, and gallery structure — as the reference for new painting partners.",
        'The painting lane plugs into handyman, drywall, and remodeling referrals with tracked attribution when you join the Tampa Bay partner roster.'
      ]
    },
    deliverables: [
      { title: 'Site & portfolio', items: ['Gallery and before/after proof', 'Service silos per paint intent', 'Estimate and call CTAs on mobile', 'Brand-aligned hero and trust pages'] },
      { title: 'Search-ready stack', items: ['GA4, Clarity, and GSC from launch', 'LocalBusiness and FAQ schema', 'GBP alignment with website services', 'City pages when metros justify depth'] },
      { title: 'Network & reputation', items: ['Referral /ref/:partner onboarding', 'Review request timing at job completion', 'Case study on knightlogics.com when ready', 'Cross-trade QR paths with handyman partners'] }
    ],
    connections: {
      kicker: 'Open lane',
      title: "Sal's Painting search-ready reference",
      text: 'Starter painter launch pattern for the recruitment lane — your brand gets its own slot and proof page.',
      bullets: ['case-study-sals-painting for launch detail', 'home-service-business-growth-systems parent', 'handyman-business-growth-systems for complementary referrals', 'referral-network-systems for attribution'],
      links: [['/case-study-sals-painting', "Sal's Painting Case Study"], ['/home-service-business-growth-systems', 'Home Service Systems'], ['/referral-network-systems', 'Referral Network']]
    },
    outcomes: [
      { title: 'Intent-matched pages', text: 'Distinct silos capture interior vs exterior vs specialty searches.' },
      { title: 'Measurable launch', text: 'Analytics baseline before scaling ads or outreach.' },
      { title: 'Referral-ready', text: 'Remodelers and handymen send work when your site proves capability.' },
      { title: 'Reputation growth', text: 'Review lane ties to job completion when volume justifies.' }
    ]
  },
  'roofing-business-growth-systems': {
    context: {
      title: 'Storm-season trust before the rush',
      paragraphs: [
        'Roofing sells on trust, geography, and speed when storms hit Tampa Bay. Thin proof, missing city pages, and slow inspection follow-up cost jobs when homeowners pick from the map pack.',
        'Roof Monsters preview documents the roofing vertical pattern — trust pages, insurance-friendly FAQs, city geography, and estimate-first inspection CTAs wired for future CRM intake.',
        'OutreachEngine supports property manager and complementary trade lists when launch stabilizes — same kg/kl/st separation as other trades.'
      ]
    },
    deliverables: [
      { title: 'Trust & content', items: ['Project proof and service definitions', 'Insurance-adjacent FAQ content homeowners expect', 'Inspection request forms above the fold on mobile', 'Schema for LocalBusiness and FAQ'] },
      { title: 'Geography', items: ['City pages for storm-season metros you serve', 'Internal linking between service and area hubs', 'GBP alignment with website messaging', 'service-area-page-strategy for expansion'] },
      { title: 'Lead systems', items: ['CRM-ready form intake rules', 'Optional OutreachEngine for B2B lists', 'Referral partner QR paths', 'review-request-systems post-job'] }
    ],
    connections: {
      kicker: 'Roofing reference',
      title: 'Roof Monsters preview case study',
      text: 'Preview labeled until client approves public launch — documents IA and lead patterns for roofing vertical.',
      bullets: ['case-study-roof-monsters for preview detail', 'contractor-growth-systems parent lane', 'local-visibility-systems for map-pack readiness', 'crm-outreach-lead-generation when outbound starts'],
      links: [['/case-study-roof-monsters', 'Roof Monsters Preview'], ['/contractor-growth-systems', 'Contractor Systems'], ['/local-visibility-systems', 'Local Visibility']]
    },
    outcomes: [
      { title: 'Pre-storm credibility', text: 'Trust content live before ad spend spikes.' },
      { title: 'Geo-qualified leads', text: 'City pages reduce out-of-area inspection requests.' },
      { title: 'Tracked inspections', text: 'Form fills route to CRM — not unmanaged voicemail.' },
      { title: 'Partner attribution', text: 'Referral paths document complementary trade sources.' }
    ]
  },
  'screen-enclosure-business-growth-systems': {
    context: {
      title: 'Quote-first trade needs city and pool-type depth',
      paragraphs: [
        'Screen enclosure and pool cage companies compete on local search by city and pool type — customers compare three Tampa Bay vendors with clearer service pages winning the quote request.',
        'Screen Team demonstrates deep service and city page architecture for pool enclosure quotes — the live contractor local SEO reference in this vertical.',
        'Screen Team proves enclosure-specific geography and proof at 36 pages with st lane outreach; Faith Works covers wide Central Florida footprint at 82 pages; Knight Group patterns apply when complementary handyman work is in scope.'
      ]
    },
    deliverables: [
      { title: 'Service depth', items: ['Pool cage, screen room, and repair service silos', 'Photo proof and project galleries', 'Quote form and call CTAs tuned to enclosure sales', 'FAQ content for permit and HOA questions'] },
      { title: 'Geography', items: ['City pages across Tampa Bay metros', 'Hub pages linking services to areas served', 'GBP services aligned to website silos', 'Internal linking for crawl depth'] },
      { title: 'Lead & growth', items: ['CRM intake for quote requests', 'OutreachEngine for builder and realtor lists', 'Referral QR for complementary trades', 'Social Poster for project showcases'] }
    ],
    connections: {
      kicker: 'Live proof',
      title: 'Screen Team case study',
      text: 'Screen Team LLC site is the enclosure trade benchmark for local SEO depth and conversion clarity.',
      bullets: ['case-study-screen-team for live client proof', 'case-study-faith-works for wide geography reference', 'contractor-growth-systems parent', 'local-visibility-systems for schema and GBP'],
      links: [['/case-study-screen-team', 'Screen Team Case Study'], ['/contractor-growth-systems', 'Contractor Systems'], ['/local-visibility-systems', 'Local Visibility']]
    },
    outcomes: [
      { title: 'Quote volume quality', text: 'Clear pool-type pages attract qualified quote requests.' },
      { title: 'Metro coverage', text: 'City pages match how enclosure customers search.' },
      { title: 'Visual proof', text: 'Galleries support premium quote positioning.' },
      { title: 'B2B outreach option', text: 'Builder and realtor lists on OutreachEngine when referrals plateau.' }
    ]
  },
  'excavation-business-growth-systems': {
    context: {
      title: 'Heavy trades need proof, geography, and project scale',
      paragraphs: [
        'Excavation and site work companies sell on equipment capability, service radius, and project proof — not generic contractor templates with stock photos.',
        'Local SEO architecture covers service silos for grading, trenching, and site prep plus city pages across the metros your crews actually mobilize to.',
        'Faith Works and JNS patterns inform outdoor and construction trades; excavation scope adds project-scale proof and longer sales cycles.'
      ]
    },
    deliverables: [
      { title: 'Trade positioning', items: ['Equipment and capability service pages', 'Project photo proof and case highlights', 'Estimate and bid request forms', 'Insurance and licensing trust signals'] },
      { title: 'Geography', items: ['City and county coverage pages', 'service-area-page-strategy for rural vs urban radius', 'GBP categories aligned to excavation services', 'Schema for LocalBusiness'] },
      { title: 'Lead & ops', items: ['CRM intake for bid requests', 'Referral paths from builders and contractors', 'Optional job photo documentation', 'OutreachEngine for commercial prospect lists'] }
    ],
    connections: {
      kicker: 'Construction lane',
      title: 'Under contractor-growth-systems umbrella',
      text: 'Excavation sub-page scopes heavy trade patterns; JNS and Faith Works provide adjacent construction references.',
      bullets: ['contractor-growth-systems parent', 'service-area-page-strategy for wide-radius trades', 'case-study-jns for contractor bundle', 'local-visibility-systems for discovery'],
      links: [['/contractor-growth-systems', 'Contractor Systems'], ['/service-area-page-strategy', 'Service Area Strategy'], ['/case-study-jns', 'JNS Case Study']]
    },
    outcomes: [
      { title: 'Capability clarity', text: 'Owners see equipment and service scope before calling — reducing unqualified bids.' },
      { title: 'Radius honesty', text: 'Geography pages match mobilization reality — not national template claims.' },
      { title: 'Commercial pipeline', text: 'B2B outreach lists for builders and developers when ready.' },
      { title: 'Project proof', text: 'Photo galleries support higher-ticket estimate conversations.' }
    ]
  },
  'restaurant-bar-growth-systems': {
    context: {
      title: 'Hospitality needs owned-domain events and ordering',
      paragraphs: [
        'Restaurants and bars outgrow social-only event promotion when menus, hours, and specials change weekly. Staff need admin-editable content without developer tickets for every special.',
        'The hospitality lane covers events calendar UX, weekly hours with GBP alignment, admin menu patterns, Stripe-ready pickup flows, and local discovery schema — the same infrastructure we deploy once a venue is ready to launch.',
        'Hand-coded mobile performance matters during Friday night traffic — page builders that lag cost orders.'
      ]
    },
    deliverables: [
      { title: 'Hospitality web', items: ['Admin-editable menus and events', 'Mobile-first layout for on-the-go customers', 'Hours, location, and reservation CTAs', 'LocalBusiness and Event schema'] },
      { title: 'Ordering readiness', items: ['Stripe-ready checkout patterns', 'Pickup flow scoping with kitchen ops', 'online-ordering-systems architecture hooks', 'POS integration documentation for future'] },
      { title: 'Local discovery', items: ['GBP post cadence with Social Poster', 'Review request timing post-visit', 'local-visibility-systems alignment', 'Launch checklist before public marketing'] }
    ],
    connections: {
      kicker: 'Related services',
      title: 'Ordering, visibility, and reputation',
      text: 'Restaurant sites launch as one lane — events and menus on the site, checkout when kitchen ops justify it, GBP and reviews aligned at go-live.',
      bullets: ['online-ordering-systems for checkout depth', 'review-request-systems for reputation', 'social-media-automation for event promotion', 'local-visibility-systems for map discovery'],
      links: [['/online-ordering-systems', 'Ordering Systems'], ['/local-visibility-systems', 'Local Visibility'], ['/case-study-hospitality-system-pattern', 'Capability Breakdown']]
    },
    outcomes: [
      { title: 'Staff autonomy', text: 'Menu and event updates without waiting on agency turnaround.' },
      { title: 'Owned discovery', text: 'Events live on brand domain — not only ephemeral social posts.' },
      { title: 'Order-ready path', text: 'Architecture supports checkout when kitchen volume justifies.' },
      { title: 'GBP coherence', text: 'Hours and specials match website before launch marketing.' }
    ]
  },
  'startup-business-launch-systems': {
    context: {
      title: 'Launch lean — measure before scaling lanes',
      paragraphs: [
        'Startup and new business launches need credible web presence, clear offer, analytics baseline, and phased systems — not every automation lane on day one.',
        'Phased milestones typical path: foundation site and GBP, then CRM outreach or referrals when lead flow justifies, then ops automation when job volume demands it.',
        'Faith Works, Screen Team, and Knight Group each started with strong web and local foundation before outreach lanes scaled — the sequence matters more than feature count.'
      ]
    },
    deliverables: [
      { title: 'Launch foundation', items: ['Hand-coded site with offer clarity and lead capture', 'Analytics, Search Console, and conversion baselines', 'GBP setup and local schema', 'Brand-consistent photography and copy guidance'] },
      { title: 'Growth phase two', items: ['OutreachEngine when outbound pipeline needed', 'Referral program scaffolding when partner network forms', 'Review request workflow at first completed jobs', 'website-growth-audit follow-up at 90 days'] },
      { title: 'Scale readiness', items: ['Knight Command or dashboard patterns when ops complexity grows', 'Documentation for which lanes to add next', 'Performance-partner-program option when metrics stabilize', 'Written scope per phase — no surprise retainers'] }
    ],
    connections: {
      kicker: 'Phased growth',
      title: 'Maps to flagship lanes over time',
      text: 'Startups adopt business-growth-systems incrementally — website first, systems as revenue supports.',
      bullets: ['website-growth-audit for launch baseline', 'business-growth-systems for full stack roadmap', 'Faith Works, Screen Team, or Knight Group as trade-matched proof', 'book-consultation for scope conversation'],
      links: [['/website-growth-audit', 'Growth Audit'], ['/business-growth-systems', 'Growth Systems'], ['/book-consultation', 'Book Consultation']]
    },
    outcomes: [
      { title: 'Credible day-one presence', text: 'Launch with conversion-ready site — not a Coming Soon placeholder.' },
      { title: 'Measured expansion', text: 'Add outreach and automation when data says volume warrants it.' },
      { title: 'Avoided overbuild', text: 'No unused CRM or dashboard licenses on week one.' },
      { title: 'Documented roadmap', text: 'Clear next lane when referrals or inbound plateau.' }
    ]
  },
  'stripe-invoice-automation': {
    context: {
      title: 'Invoice triggers tied to job milestones',
      paragraphs: [
        'Stripe invoice automation connects completed job status, ticket closeout, or portal milestones to payment link or invoice draft creation — with paid status syncing back to the job record.',
        'Vendoroo-style active build uses this pattern: field completion triggers billing; webhook updates job screen when customer pays.',
        'api-integration-services provides webhook receivers with retry logic and visible failures — not one-off scripts.'
      ]
    },
    deliverables: [
      { title: 'Billing triggers', items: ['Completion status → invoice or payment link rules', 'Line item templates from job record fields', 'Customer email delivery via Stripe', 'Draft vs auto-send configuration per client'] },
      { title: 'Status sync', items: ['Stripe webhook paid event → job record update', 'Failed payment visibility on owner dashboard', 'Idempotent webhook handling', 'Audit log for accounting review'] },
      { title: 'Integration scope', items: ['ticketing-invoicing-job-workflows as parent lane', 'job-photo-pdf-reports before invoice send', 'Optional Email-Agent notify on invoice sent', 'Multi-job batch billing rules when needed'] }
    ],
    connections: {
      kicker: 'Billing lane',
      title: 'Part of ticket-to-invoice path',
      text: 'Stripe automation rarely stands alone — it closes the loop on field ops workflows.',
      bullets: ['ticketing-invoicing-job-workflows flagship', 'case-study-vendoroo-ticket-invoice-system reference', 'api-integration-services for webhooks', 'business-dashboard-development for open vs paid view'],
      links: [['/ticketing-invoicing-job-workflows', 'Job Workflows'], ['/case-study-vendoroo-ticket-invoice-system', 'Vendoroo Case Study'], ['/api-integration-services', 'API Integrations']]
    },
    outcomes: [
      { title: 'Faster cash collection', text: 'Invoices generate at closeout — not days later from manual entry.' },
      { title: 'Single job truth', text: 'Payment status visible on job screen alongside photos and notes.' },
      { title: 'Fewer billing errors', text: 'Line items pull from job record — not retyped from portal PDFs.' },
      { title: 'Webhook reliability', text: 'Paid events sync with retry and operator-visible failures.' }
    ]
  },
  'job-photo-pdf-reports': {
    context: {
      title: 'Completion proof property managers accept',
      paragraphs: [
        'Job photo PDF reports package field photos, notes, and branded headers into completion packets formatted for vendor portal upload — replacing manual rebuilds in Word or Canva after every job.',
        'Photos attach to job ID during mobile closeout — not scattered across crew camera rolls. PDF generation runs server-side with consistent layout per property manager requirements.',
        'Pairs with ticketing-invoicing-job-workflows and stripe-invoice-automation for full portal vendor closeout.'
      ]
    },
    deliverables: [
      { title: 'Field capture', items: ['Mobile browser photo upload per job ID', 'Required photo steps before status closeout', 'Caption and note fields tied to images', 'Offline-tolerant upload retry when signal returns'] },
      { title: 'PDF generation', items: ['Branded header and footer templates', 'Multi-photo layout per manager format', 'Auto-include job metadata and timestamps', 'Download and email delivery options'] },
      { title: 'Portal workflow', items: ['Export structured for vendor portal upload', 'Link PDF to Stripe invoice trigger', 'Owner dashboard for missing-proof jobs', 'case-study-vendoroo patterns as reference'] }
    ],
    connections: {
      kicker: 'Proof layer',
      title: 'Between field work and billing',
      text: 'PDF reports sit between mobile job updates and invoice send — office reviews proof before billing.',
      bullets: ['ticketing-invoicing-job-workflows parent', 'stripe-invoice-automation after proof approval', 'contractor-growth-systems for trades adding ops', 'case-study-vendoroo-ticket-invoice-system'],
      links: [['/ticketing-invoicing-job-workflows', 'Job Workflows'], ['/stripe-invoice-automation', 'Stripe Automation'], ['/case-study-vendoroo-ticket-invoice-system', 'Vendoroo Case Study']]
    },
    outcomes: [
      { title: 'Fewer portal rejections', text: 'Consistent PDF format matches manager upload requirements.' },
      { title: 'Proof before billing', text: 'Office sees photos before invoice goes out.' },
      { title: 'Crew discipline', text: 'Required capture step prevents forgotten camera roll hunts.' },
      { title: 'Audit trail', text: 'Timestamped proof attached to job record permanently.' }
    ]
  },
  'review-request-systems': {
    context: {
      title: 'Reviews asked at the right moment',
      paragraphs: [
        'Review request systems trigger SMS or email asks at job completion — when customer satisfaction is highest — instead of hoping someone remembers to mention Google weeks later.',
        'Timing integrates with job workflow status changes or manual owner trigger. Links route to Google Business Profile review flow with UTM or tracking where useful.',
        'Local visibility improves when review velocity matches real completed work — Faith Works, Screen Team, and Knight Group each include reputation as part of geography strategy.'
      ]
    },
    deliverables: [
      { title: 'Request automation', items: ['Trigger on job completion or invoice paid', 'SMS or email templates with GBP review link', 'Throttle rules to avoid duplicate asks', 'Opt-out handling for compliance'] },
      { title: 'Reputation ops', items: ['Review velocity tracking vs job volume', 'GBP post cadence alignment', 'Negative review alert routing to owner', 'Monthly reputation summary on dashboard'] },
      { title: 'Integration', items: ['workflow-automation for trigger jobs', 'ticketing-invoicing status hooks', 'local-visibility-systems for GBP foundation', 'handyman and home-service launch patterns'] }
    ],
    connections: {
      kicker: 'Reputation loop',
      title: 'Closes the local visibility stack',
      text: 'Reviews amplify city pages and GBP work from local-visibility-systems.',
      bullets: ['local-visibility-systems for schema and GBP', 'home-service-business-growth-systems for residential trades', 'workflow-automation for send timing', 'Screen Team and Faith Works GBP alignment as references'],
      links: [['/local-visibility-systems', 'Local Visibility'], ['/home-service-business-growth-systems', 'Home Service Systems'], ['/workflow-automation', 'Workflow Automation']]
    },
    outcomes: [
      { title: 'Higher review velocity', text: 'Asks fire at job completion — not random calendar reminders.' },
      { title: 'Map-pack support', text: 'Review count grows alongside geography pages.' },
      { title: 'Owner awareness', text: 'Alerts on new reviews without daily GBP manual checks.' },
      { title: 'Compliance-safe', text: 'Throttle and opt-out rules prevent spam perception.' }
    ]
  },
  'service-area-page-strategy': {
    context: {
      title: 'Hub and city architecture that matches crew radius',
      paragraphs: [
        'Service-area page strategy documents how hub pages, city landing pages, and service silos link together — scaled to how far crews actually travel, not national template city spam.',
        'Faith Works deploys 82 land-clearing pages across Polk County and Central Florida. Screen Team covers Tampa Bay enclosure metros at 36 pages. Knight Group adds 30+ handyman city pages across Pinellas, Hillsborough, and Pasco when the trade is repair-first.',
        'Screen Team proves the same pattern for pool enclosure quotes; excavation and roofing trades adapt radius and content depth accordingly.'
      ]
    },
    deliverables: [
      { title: 'Architecture planning', items: ['Hub page vs city page hierarchy', 'Service silo internal linking map', 'Cannibalization review between overlapping geos', 'Sitemap and indexation strategy'] },
      { title: 'Content templates', items: ['City page copy framework with local proof', 'Service × city matrix scoping', 'FAQ blocks per metro where relevant', 'Schema BreadcrumbList and LocalBusiness per page'] },
      { title: 'Expansion playbook', items: ['Priority metro rollout order', 'GBP service area alignment', 'Review and gallery content per region', 'Monthly indexation and ranking check'] }
    ],
    connections: {
      kicker: 'SEO depth',
      title: 'Foundation for local-visibility-systems',
      text: 'Strategy doc precedes build — audit identifies geography gaps before page production.',
      bullets: ['local-visibility-systems for full discovery lane', 'Faith Works 82-page footprint for wide geography', 'Screen Team 36-page metro depth', 'Knight Group 97-page handyman reference'],
      links: [['/local-visibility-systems', 'Local Visibility'], ['/case-study-faith-works', 'Faith Works Case Study'], ['/case-study-screen-team', 'Screen Team Example']]
    },
    outcomes: [
      { title: 'Honest geography', text: 'Pages match crew mobilization — reducing wasted estimate trips.' },
      { title: 'Crawl efficiency', text: 'Internal linking distributes authority to city intents.' },
      { title: 'Scalable rollout', text: 'Template framework adds metros without reinventing IA.' },
      { title: 'Indexation clarity', text: '97-page benchmark shows what full trade coverage looks like at scale.' }
    ]
  },
  'case-study-knight-command': {
    context: {
      title: 'One shell for daily growth operations',
      paragraphs: [
        'Knight Command at /admin consolidates tabs for Command Center, Referrals, Outreach CRM, Email Agent, Social Ops, Social Poster, and Logs — each embedding live services on ports 5050, 5100, 8500, and 8501.',
        'Before the shell, operators juggled orphan localhost URLs for referral dashboard, OutreachEngine, Email-Agent, and Social Poster — context switching slowed outreach review and failure triage.',
        'Modular tab architecture lets individual services upgrade without rebuilding the entire admin — new lanes slot in instead of requiring bookmark updates across the team.'
      ]
    },
    deliverables: [
      { title: 'Admin shell', items: ['Authenticated /admin entry with role gate', 'Tab navigation to seven primary ops views', 'Command Center orientation summary', 'Logs tab for cross-system failure review'] },
      { title: 'Service embeds', items: ['Referrals → referral infrastructure on 5050 family', 'Outreach CRM → OutreachEngine queue UI', 'Email Agent → port 5100 views', 'Social Poster → Streamlit 8501'] },
      { title: 'Operator outcomes', items: ['Single login for growth ops', 'Faster morning queue review', 'Foundation for client-facing admin patterns', 'Documented port map for onboarding'] }
    ],
    connections: {
      kicker: 'Ops hub',
      title: 'Embeds every major growth lane',
      text: 'Knight Command is internal infrastructure — not a client SKU — but documents embed patterns for business-dashboard-development and internal-business-tools.',
      bullets: ['business-growth-systems as strategic parent', 'case-study-crm-outreach-system in Outreach tab', 'case-study-referral-network-system in Referrals tab', 'case-study-social-poster in Social Poster tab'],
      links: [['/business-growth-systems', 'Growth Systems'], ['/business-dashboard-development', 'Dashboard Development'], ['/internal-business-tools', 'Internal Tools']]
    },
    outcomes: [
      { title: 'Less context switching', text: 'Operators review referrals, CRM, email, and social without leaving /admin.' },
      { title: 'Faster failure triage', text: 'Logs tab centralizes cross-runner errors.' },
      { title: 'Modular upgrades', text: 'Services deploy independently into tab slots.' },
      { title: 'Client pattern reference', text: 'Embed architecture reusable for owner dashboards on client builds.' }
    ],
    scopeNote: 'Knight Command is Knight Logics internal ops infrastructure — not a deployed client product. Case study documents architecture patterns for similar builds.',
    proofGrid: [PROOF.crmOutreach, PROOF.referral, PROOF.socialPoster]
  },
  'case-study-crm-outreach-system': {
    context: {
      title: 'OutreachEngine in production on real campaigns',
      paragraphs: [
        'OutreachEngine — Flask app with SQLite storage — drives segmented lists, branded templates, scheduler jobs for first_touch and followup, bounce detection, and daily caps between 20 and 40 sends per brand.',
        'Screen Team st lane, Faith Works faithworks lane, and Knight Group kg lane each use OutreachEngine with separate caps and templates. KG generated substantial booked work from one well-targeted message; ST and FW run the same engine at enclosure and land-clearing scale.',
        'Replies route to Email-Agent crm_reply views on port 5100; Knight Command Outreach CRM tab embeds the queue UI for daily operator review.'
      ]
    },
    deliverables: [
      { title: 'CRM engine', items: ['Flask + SQLite OutreachEngine deployment', 'Brand switcher for kl, kg, st, and faithworks lanes', 'Queue preview and send window visibility', 'Bounce flags suppress bad addresses'] },
      { title: 'Scheduler & caps', items: ['first_touch and followup job configuration', '20–40 daily send limits per brand', 'Preview sends before production windows', 'Campaign logging for lead-source reporting'] },
      { title: 'Reply integration', items: ['Email-Agent crm_reply routing', 'Knight Command embed', 'Gmail/Zoho/Microsoft inbox mapping', 'Weekly operator review cadence'] }
    ],
    connections: {
      kicker: 'Live proof',
      title: 'Live client lane results — ST, FW, and KG',
      text: 'OutreachEngine production proof spans Screen Team, Faith Works, and Knight Group — not a demo dataset.',
      bullets: ['crm-outreach-lead-generation service page', 'email-agent-automation for reply path', 'Screen Team 36-page site as st lane proof destination', 'Faith Works 82-page site as faithworks lane reference'],
      links: [['/crm-outreach-lead-generation', 'CRM Outreach Service'], ['/case-study-screen-team', 'Screen Team Proof'], ['/case-study-faith-works', 'Faith Works Proof']]
    },
    outcomes: [
      { title: 'Real pipeline', text: 'Live client lanes produce measurable reply and conversion signals across trades.' },
      { title: 'Brand-safe ops', text: 'Templates and senders isolated per kl, kg, st, and faithworks lanes.' },
      { title: 'Enforced follow-up', text: 'Scheduler replaces manual inbox remembering.' },
      { title: 'Reputation protection', text: 'Caps and bounce rules visible before damage.' }
    ],
    scopeNote: 'OutreachEngine is Knight Logics production software configured per client brand — case study describes live internal workflow, not a third-party SaaS resale.',
    proofGrid: [PROOF.screenTeam, PROOF.faithWorks, PROOF.kg]
  },
  'case-study-vendoroo-ticket-invoice-system': {
    context: {
      title: 'Portal ticket to Stripe invoice in one workflow',
      paragraphs: [
        'Property maintenance vendors receive portal tickets, complete field work, then manually rebuild proof and invoices. The Vendoroo-style active build unifies intake queue, mobile updates, photo attachments, PDF packets, and Stripe triggers.',
        'Implementation is an internal reference build — code is not in the public repository. Patterns inform ticketing-invoicing-job-workflows, job-photo-pdf-reports, and stripe-invoice-automation client scoping.',
        'Office staff reviews photo proof before invoice send; field crews follow consistent closeout path with required capture steps.'
      ]
    },
    deliverables: [
      { title: 'Ticket workflow', items: ['Portal and manual intake into one queue', 'Assignment and status steps for crews', 'Mobile-friendly job screen', 'Owner view for open vs billed'] },
      { title: 'Proof & PDF', items: ['Photo attach per job ID', 'Branded PDF completion reports', 'Portal upload format compliance', 'Missing-proof alerts'] },
      { title: 'Billing sync', items: ['Stripe invoice on completion milestone', 'Payment link alternative', 'Webhook paid status on job record', 'Email-Agent optional status notify'] }
    ],
    connections: {
      kicker: 'Field ops reference',
      title: 'Represents ticketing flagship offer',
      text: 'Active build status — patterns available for similar vendor portal clients.',
      bullets: ['ticketing-invoicing-job-workflows flagship', 'job-photo-pdf-reports sub-lane', 'stripe-invoice-automation billing layer', 'JNS as contractor web reference'],
      links: [['/ticketing-invoicing-job-workflows', 'Job Workflow Service'], ['/job-photo-pdf-reports', 'Photo & PDF Reports'], ['/stripe-invoice-automation', 'Stripe Automation']]
    },
    outcomes: [
      { title: 'Reduced re-entry', text: 'Ticket details stay in one record through closeout.' },
      { title: 'Billing speed', text: 'Invoice triggers at completion — not days of manual lag.' },
      { title: 'Portal acceptance', text: 'PDF format structured for manager requirements.' },
      { title: 'Client scoping template', text: 'Internal reference accelerates similar vendor proposals.' }
    ],
    scopeNote: 'Vendoroo-style build is an active internal workflow reference — not a publicly deployed client product or open-source repo. Demonstrates capability for portal-driven vendors.',
    proofGrid: [PROOF.jns, PROOF.screenTeam, PROOF.vendoroo]
  },
  'case-study-hospitality-system-pattern': {
    context: {
      title: 'Hospitality capability without premature client marketing',
      paragraphs: [
        'Restaurant and bar builds add admin-editable menus and events, ordering-ready Stripe architecture, and local visibility alignment — replacing PDF menus and social-only event posts.',
        'Hand-coded mobile layout targets peak traffic performance without page builder bloat. Architecture leaves POS integration hooks for when kitchen volume justifies deeper checkout integration.',
        'Client names, live URLs, and branded photography stay off public marketing until ownership approves publication and site hosting transfer.'
      ]
    },
    deliverables: [
      { title: 'Site & content', items: ['Admin-editable menu patterns', 'Events calendar on owned domain', 'Mobile-first hospitality UX', 'Approved client branding when cleared'] },
      { title: 'Ordering prep', items: ['Stripe-ready checkout scoping', 'Pickup flow staging tests', 'Kitchen ops consultation', 'POS hook documentation'] },
      { title: 'Launch checklist', items: ['GBP alignment pre-marketing', 'LocalBusiness schema', 'Review strategy at opening', 'restaurant-bar-growth-systems template alignment'] }
    ],
    connections: {
      kicker: 'Hospitality lane',
      title: 'restaurant-bar-growth-systems reference',
      text: 'Capability pattern — represents ordering and events stack for bars and restaurants until client case studies publish.',
      bullets: ['online-ordering-systems for checkout depth', 'local-visibility-systems for discovery', 'review-request-systems at launch', 'social-media-automation for event posts'],
      links: [['/restaurant-bar-growth-systems', 'Restaurant Systems'], ['/online-ordering-systems', 'Ordering Systems'], ['/case-study-hospitality-system-pattern', 'Hospitality System Pattern']]
    },
    outcomes: [
      { title: 'Staff-friendly content', text: 'Menu and event updates without developer dependency.' },
      { title: 'Owned event discovery', text: 'Calendar lives on brand domain alongside social.' },
      { title: 'Order-ready foundation', text: 'Checkout architecture tested in staging.' },
      { title: 'Ethical launch discipline', text: 'No client branding on knightlogics.com until sign-off.' }
    ],
    scopeNote: 'Capability documentation — hospitality client case studies publish only after approval and site transfer. Fictional UI mockups illustrate the stack until then.',
    proofGrid: [PROOF.hospitalityPattern, PROOF.screenTeam, PROOF.faithWorks]
  },
  'case-study-roof-monsters': {
    context: {
      title: 'Roofing brand preview for storm-season markets',
      paragraphs: [
        'Roof Monsters needed credible web presence and inspection lead paths before storm season push. Prior digital footprint lacked service areas, project proof, and insurance-adjacent FAQs homeowners expect.',
        'Build includes service pages, city geography, trust layout, estimate-first CTAs, and CRM-ready forms. Lead paths wire for future OutreachEngine intake with daily caps and reply routing.',
        'Client preview — detailed metrics and live URL marketing publish when launch is approved. Serves as roofing vertical reference for contractor-growth-systems.'
      ]
    },
    deliverables: [
      { title: 'Trust & IA', items: ['Project proof page structure', 'Insurance-friendly FAQ content', 'Service and city page architecture', 'Mobile inspection request CTAs'] },
      { title: 'Local SEO', items: ['Schema and internal linking', 'GBP messaging alignment', 'Storm-season metro prioritization', 'service-area-page-strategy for expansion'] },
      { title: 'Lead readiness', items: ['Form intake rules for CRM', 'Referral partner path planning', 'Review request timing post-job', 'Optional outreach list segmentation'] }
    ],
    connections: {
      kicker: 'Roofing vertical',
      title: 'roofing-business-growth-systems template',
      text: 'Preview case study until client approves launch — documents trade-specific patterns.',
      bullets: ['roofing-business-growth-systems sub-page', 'contractor-growth-systems parent', 'local-visibility-systems for map-pack', 'crm-outreach-lead-generation when outbound starts'],
      links: [['/roofing-business-growth-systems', 'Roofing Systems'], ['/contractor-growth-systems', 'Contractor Systems'], ['/local-visibility-systems', 'Local Visibility']]
    },
    outcomes: [
      { title: 'Pre-season credibility', text: 'Trust content ready before demand spike.' },
      { title: 'Geo-qualified leads', text: 'City pages filter inspection requests to served metros.' },
      { title: 'CRM-ready intake', text: 'Forms structured for outreach engine connection.' },
      { title: 'Vertical template', text: 'Roofing reference accelerates similar client scoping.' }
    ],
    scopeNote: 'Client preview — not publicly marketed as live until ownership approves launch. Case study describes build pattern and IA, not published performance metrics.',
    proofGrid: [PROOF.roofMonsters, PROOF.faithWorks, PROOF.jns]
  },
  'case-study-social-poster': {
    context: {
      title: 'Hybrid API and Playwright social runners',
      paragraphs: [
        'Social Poster on Streamlit port 8501 manages per-brand queues, posting windows, X and Facebook API bridge, GBP API posts, and Playwright runners for Nextdoor and LinkedIn.',
        'Silent failures previously left brand accounts quiet for days. Failure counters and Logs cross-reference give operators same-day visibility when runners break.',
        'Embedded in Knight Command Social Poster and Social Ops tabs — complements local-visibility-systems GBP strategy with scheduled post cadence.'
      ]
    },
    deliverables: [
      { title: 'Queue infrastructure', items: ['Streamlit UI on port 8501', 'Isolated KL, KG, ST brand queues', 'Posting window enforcement', 'Last success timestamp per platform'] },
      { title: 'Runner layer', items: ['X and Facebook API clients', 'Playwright workers for Nextdoor and LinkedIn', 'GBP API integration', 'Credential vault per brand'] },
      { title: 'Ops embed', items: ['Knight Command Social Poster tab', 'Logs integration for failures', 'Social Ops weekly review workflow', 'social-media-automation-systems service alignment'] }
    ],
    connections: {
      kicker: 'Social lane',
      title: 'social-media-automation-systems production proof',
      text: 'Internal system supporting multi-brand Tampa Bay client accounts.',
      bullets: ['case-study-knight-command for embed shell', 'local-visibility-systems for GBP posts', 'workflow-automation for scheduler', 'ai-business-automation parent'],
      links: [['/social-media-automation-systems', 'Social Automation'], ['/case-study-knight-command', 'Knight Command'], ['/local-visibility-systems', 'Local Visibility']]
    },
    outcomes: [
      { title: 'Reliable cadence', text: 'Fewer multi-day posting gaps across platforms.' },
      { title: 'Brand isolation', text: 'Wrong-account posts prevented by queue separation.' },
      { title: 'Failure visibility', text: 'Broken runners surface same day in UI.' },
      { title: 'GBP alignment', text: 'Scheduled posts match website campaign timing.' }
    ],
    scopeNote: 'Social Poster is Knight Logics internal production tooling on port 8501 — case study documents live workflow, not an off-the-shelf social SaaS product.',
    proofGrid: [PROOF.knightCommand, PROOF.faithWorks, PROOF.screenTeam]
  },
  'case-study-referral-network-system': {
    context: {
      title: 'Partner attribution with payout visibility',
      paragraphs: [
        'Referral network infrastructure deploys /ref/:partner entry paths, QR brochure assets, Neon Postgres event logging, referral-dashboard partner views, and Stripe webhook payout settlement.',
        'Partners previously disputed credit when payout status lived in spreadsheets. Dashboard self-service reduced email disputes and accelerated Tampa Bay trade network onboarding.',
        'Knight Command Referrals tab embeds referral ops on port 5050 family alongside CRM and email — single operator shell for partner support.'
      ]
    },
    deliverables: [
      { title: 'Attribution paths', items: ['/ref/:partner landing routes', 'QR brochure generation', 'Consult form referral context capture', 'Neon Postgres event store'] },
      { title: 'Partner dashboard', items: ['referral-dashboard earned vs paid view', 'Attribution window per program terms', 'Partner onboarding with unique codes', 'Data boundaries for partner privacy'] },
      { title: 'Settlement', items: ['Stripe webhook payout sync', 'api-integration-services receivers', 'Knight Command Referrals embed', 'referral-network-systems program alignment'] }
    ],
    connections: {
      kicker: 'Partner program',
      title: 'referral-network-systems flagship proof',
      text: 'Live workflow behind public Referral Program and partner onboarding.',
      bullets: ['referral-program public join path', 'case-study-knight-command Referrals tab', 'api-integration-services for webhooks', 'business-growth-systems full stack context'],
      links: [['/referral-network-systems', 'Referral Systems'], ['/referral-program', 'Join Referral Program'], ['/case-study-knight-command', 'Knight Command']]
    },
    outcomes: [
      { title: 'Dispute reduction', text: 'Partners verify earned vs paid without owner email chains.' },
      { title: 'Faster onboarding', text: 'Codes and QR assets deploy in days.' },
      { title: 'Network intelligence', text: 'Owners see which partners and QR campaigns produce consults.' },
      { title: 'Embedded support', text: 'Referral ops inside /admin — not orphan dashboard URLs.' }
    ],
    scopeNote: 'Referral infrastructure is production Knight Logics systems — partner program terms, fees, and payout rules are defined separately in program documentation.',
    proofGrid: [PROOF.knightCommand, PROOF.faithWorks, PROOF.crmOutreach]
  }
};

function enrichPage(page) {
  const e = enrichments[page.slug];
  const applyClientMedia = (target) => {
    if (CLIENT_MEDIA_SLUGS.includes(page.slug) && !hasAnyClientMediaBlock(target.mediaBlocks)) {
      target.mediaBlocks = [...(target.mediaBlocks || []), clientMediaBlockForSlug(page.slug, 'right')];
    }
    if (!target.stats || !target.stats.length) {
      target.stats = clientStatsForSlug(page.slug);
    }
    if (!target.proofGrid || !target.proofGrid.length) {
      target.proofGrid = defaultProofGrid(page.slug);
    }
    return target;
  };

  if (!e) {
    return applyClientMedia(applyKgReplacementsDeep(JSON.parse(JSON.stringify(page))));
  }

  const merged = deepMerge(page, e);
  if (merged.stats && merged.stats === KG_STATS && primaryClientForSlug(page.slug) !== 'kg') {
    merged.stats = clientStatsForSlug(page.slug);
  }
  return applyClientMedia(merged);
}

module.exports = { enrichments, enrichPage, CLIENT_MEDIA_SLUGS, applyKgReplacementsDeep };
