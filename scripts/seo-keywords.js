/**
 * SEO + AI-discovery copy for all generated growth/case-study pages.
 * Applied at generate time via applySeoKeywords().
 */

function trimMeta(text, max = 158) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function lines(...paras) {
  return paras.filter(Boolean);
}

/** @type {Record<string, { meta?: string, lead?: string, contextLines?: string[], terms?: string[] }>} */
const PAGE_SEO = {
  'business-growth-systems': {
    terms: ['small business growth systems', 'Tampa Bay local SEO', 'CRM outreach automation', 'referral tracking'],
    meta: 'Business growth systems for Tampa Bay — hand-coded websites, local SEO, Google Business alignment, CRM outreach, automation, and referral tracking for small businesses.',
    contextLines: lines(
      'Owners searching for small business growth systems in Tampa Bay usually need more than a brochure site — they need local SEO structure, map-pack-ready Google Business Profile alignment, and lead follow-up that does not live in one inbox.',
      'Knight Logics connects websites, outreach, referrals, and ops into phased milestones so Pinellas and Hillsborough service businesses can measure leads instead of guessing whether marketing is working.'
    ),
  },
  'contractor-growth-systems': {
    terms: ['contractor website Tampa Bay', 'contractor local SEO Florida', 'field trade lead generation'],
    meta: 'Contractor growth systems for Tampa Bay trades — service-page SEO, Google Business alignment, CRM outreach, referral tracking, and job workflows for estimate-first crews.',
    contextLines: lines(
      'Contractor website searches in Tampa, Clearwater, and St. Petersburg split by trade and neighborhood — dedicated service pages with schema and city coverage outperform a single homepage for high-intent queries.',
      'The contractor lane recruits complementary trades into a referral network with tracked attribution while anchor builds (handyman, enclosure, excavation) prove depth at 36–97 indexable pages.'
    ),
  },
  'home-service-business-growth-systems': {
    terms: ['home service marketing Tampa', 'local SEO home services', 'Google map pack home services'],
    meta: 'Home service growth systems for Tampa Bay — fast websites, local SEO, Google Business Profile, CRM outreach, reviews, and referral paths for property-facing trades.',
    contextLines: lines(
      'Home service leads are urgent — homeowners call three competitors in minutes. Map-pack visibility, call-first CTAs, and review timing separate booked jobs from missed voicemails.',
      'Electricians, painters, handymen, and enclosure trades in the network send attributed referral work when each partner has a credible owned presence and clear service pages.'
    ),
  },
  'local-visibility-systems': {
    terms: ['local SEO Tampa Bay', 'Google Business Profile optimization', 'map pack visibility'],
    meta: 'Local visibility systems — Tampa Bay local SEO, Google Business Profile optimization, service-area pages, schema, indexing, and review workflows for small businesses.',
    contextLines: lines(
      'Local visibility is not a one-time GBP cleanup — it is ongoing alignment between your website services, structured data, Search Console indexing, and the categories customers use in Google Maps.',
      'Service-area pages, FAQ schema, and internal linking help AI summaries and map-pack algorithms understand which neighborhoods and intents you actually serve across Tampa Bay.'
    ),
  },
  'website-growth-audit': {
    terms: ['free website audit Tampa', 'website growth audit', 'local SEO audit small business'],
    meta: 'Free website & growth audit for Tampa Bay businesses — technical SEO, speed, schema, Google Business alignment, and conversion path review with actionable fixes.',
    contextLines: lines(
      'A useful audit covers crawlability, Core Web Vitals, schema validity, GBP parity with the website, and whether service-intent searches have a landing page to rank.',
      'Knight Logics audits are built for owners who want a prioritized fix list — not a generic PDF — before committing to a rebuild or local SEO sprint.'
    ),
  },
  'crm-outreach-lead-generation': {
    terms: ['CRM outreach small business', 'lead generation automation Tampa', 'B2B outreach CRM'],
    meta: 'CRM outreach & lead generation systems — segmented outbound, daily caps, reply routing, and pipeline visibility for Tampa Bay service businesses.',
    contextLines: lines(
      'Outbound works when lists are segmented, sends are capped, and replies route into a tracked queue — not when a blast tool dumps responses back into personal Gmail.',
      'Production OutreachEngine lanes separate brands (kl, kg, st, faithworks) so property manager and complementary trade outreach scales without cross-contaminating templates.'
    ),
  },
  'referral-network-systems': {
    terms: ['referral tracking small business', 'partner referral network', 'referral attribution QR'],
    meta: 'Referral network systems — partner tracking, /ref attribution paths, QR brochures, and payout visibility for Tampa Bay trade and service businesses.',
    contextLines: lines(
      'Referral disputes usually mean attribution was verbal. Tracked /ref/:partner paths, QR scans, and dashboard visibility document which partner sent the consult or job.',
      'As the Tampa Bay trade roster grows, co-marketing and complementary referrals scale when each partner has a credible site and a defined lane in the network.'
    ),
  },
  'ticketing-invoicing-job-workflows': {
    terms: ['contractor job tracking software', 'ticket invoice workflow', 'field service invoicing'],
    meta: 'Ticketing, invoicing & job workflows — field photos, PDF proof, Stripe invoices, and portal closeout paths for Tampa Bay contractors and vendors.',
    contextLines: lines(
      'Portal-heavy vendors lose margin when tickets, photos, and invoices live in separate apps. A single job record with proof attachments supports faster closeout and fewer chargebacks.',
      'Workflow automation ties website lead intake to job records when volume justifies ops depth beyond spreadsheets and text threads.'
    ),
  },
  'online-ordering-systems': {
    terms: ['online ordering restaurant Tampa', 'e-commerce ordering system', 'Stripe order ahead'],
    meta: 'Online ordering & e-commerce systems — menus, order-ahead checkout, Stripe flows, and owned-domain storefronts for Tampa Bay restaurants and retailers.',
    contextLines: lines(
      'Owned-domain ordering reduces platform fees and keeps customer data on your brand — especially when menus, hours, and specials change weekly.',
      'Admin-editable menus, events, and checkout paths align with Google Business actions and repeat customer flows.'
    ),
  },
  'performance-partner-program': {
    terms: ['performance marketing partner', 'revenue share web design', 'growth partner Tampa'],
    meta: 'Performance partner program — shared upside with written attribution, baselines, and 90-day measurement windows for Tampa Bay growth system clients.',
    contextLines: lines(
      'Performance partnerships require measurable infrastructure — analytics, CRM attribution, and agreed definitions of a qualified lead before fees tie to outcomes.',
      'Knight Logics scopes partner programs after core tracking exists or will be built in the first milestone.'
    ),
  },
  'ai-business-automation': {
    terms: ['AI business automation Tampa', 'workflow automation small business', 'custom AI tools'],
    meta: 'AI business automation — workflow triggers, internal tools, and ops-aware automations tied to live CRM and queue data for Tampa Bay businesses.',
    contextLines: lines(
      'Useful automation connects to real business data — outreach queues, email routing, referral events — not disconnected chat widgets with no audit trail.',
      'Knight Logics builds automations your team can inspect, pause, and extend as volume grows.'
    ),
  },
  'workflow-automation': {
    terms: ['business workflow automation', 'webhook automation', 'small business ops automation'],
    meta: 'Workflow automation — webhooks, routing rules, notifications, and internal tools that connect website, CRM, email, and billing for small businesses.',
    contextLines: lines(
      'Workflow automation should eliminate repeatable copy-paste between systems — form fills, status changes, payout notifications, and owner alerts.',
      'Phased rollout keeps automations reliable before scaling volume.'
    ),
  },
  'email-agent-automation': {
    terms: ['email automation small business', 'multi-inbox CRM email', 'email routing automation'],
    meta: 'Email-Agent automation — multi-inbox routing, CRM reply discipline, and event notifications for Tampa Bay outreach and support teams.',
    contextLines: lines(
      'Shared inboxes break when outreach, support, and billing replies land in one undifferentiated queue. Brand-isolated routing preserves context per lane.',
      'Email-Agent maps production inboxes used by OutreachEngine and ops notifications on live client workflows.'
    ),
  },
  'social-media-automation-systems': {
    terms: ['social media automation business', 'multi-brand social posting', 'social queue dashboard'],
    meta: 'Social media automation — multi-brand posting queues, approval flows, and showcase content for Tampa Bay service businesses.',
    contextLines: lines(
      'Consistency beats viral luck for local service brands — queued posts with project proof outperform sporadic manual posting.',
      'Social automation integrates with growth proof — galleries, case studies, and referral campaigns — without replacing authentic owner voice.'
    ),
  },
  'internal-business-tools': {
    terms: ['custom internal business software', 'internal tools developer Tampa', 'business ops dashboard'],
    meta: 'Internal business tools — custom dashboards, data views, and operator interfaces when off-the-shelf SaaS does not match your workflow.',
    contextLines: lines(
      'Internal tools earn their keep when they replace weekly spreadsheet rituals with one view owners actually open.',
      'Knight Logics ships tools against live workflows — outreach, referrals, ticketing — not generic admin templates.'
    ),
  },
  'api-integration-services': {
    terms: ['API integration services', 'webhook integration small business', 'Stripe API integration'],
    meta: 'API integration services — Stripe, CRM, email, and webhook pipelines that connect your website and ops stack reliably.',
    contextLines: lines(
      'Broken integrations silently lose leads. Idempotent webhooks, logging, and retry discipline keep payment and CRM events trustworthy.',
      'Integrations are scoped to business-critical paths first — consult attribution, invoice paid, outreach reply.'
    ),
  },
  'business-dashboard-development': {
    terms: ['business dashboard development', 'owner KPI dashboard', 'growth metrics dashboard'],
    meta: 'Business dashboard development — owner views for leads, outreach, referrals, and job pipeline across Tampa Bay growth stacks.',
    contextLines: lines(
      'Dashboards should answer operator questions in under ten seconds — new leads, referral source, outreach replies waiting, jobs awaiting invoice.',
      'Knight Command-style shells unify tabs when teams outgrow five browser bookmarks.'
    ),
  },
  'handyman-business-growth-systems': {
    terms: ['handyman website Tampa Bay', 'handyman local SEO', 'handyman booking website'],
    meta: 'Handyman growth systems for Tampa Bay — estimate-first websites, city service pages, booking paths, CRM outreach, and referral network slots for repair crews.',
    contextLines: lines(
      'Handyman searches combine service intent and city — "drywall repair Clearwater" and "handyman near me" need separate silos, not one generic Services page.',
      'Knight Group proves 97-page depth with booking, kg outreach, and Lighthouse scores — the network anchor for this trade lane, not a template for your brand.'
    ),
  },
  'electrician-business-growth-systems': {
    terms: ['electrician website Tampa', 'electrical contractor SEO', 'electrician local SEO Florida'],
    meta: 'Electrician growth systems for Tampa Bay — starter and search-ready websites, local SEO, Google Business alignment, and referral network onboarding for electrical contractors.',
    contextLines: lines(
      'Electrical contractors need residential, commercial, and emergency offers documented before complementary trades will send attributed referral work.',
      'Farrell Electric shows the starter launch pattern — your build becomes the next case study and referral slot in the open electrician lane.'
    ),
  },
  'painter-business-growth-systems': {
    terms: ['painter website Tampa Bay', 'painting contractor SEO', 'house painter local SEO'],
    meta: 'Painter growth systems for Tampa Bay — search-ready websites, portfolio SEO, Google Business alignment, and referral network onboarding for painting contractors.',
    contextLines: lines(
      'Interior, exterior, cabinet, and commercial paint intents rank differently — silo pages with gallery proof capture how homeowners and remodelers actually search.',
      "Sal's Painting demonstrates search-ready analytics, schema, and brand foundation as the reference for new painting partners."
    ),
  },
  'roofing-business-growth-systems': {
    terms: ['roofing website Tampa', 'roofing contractor SEO', 'storm season roofing leads'],
    meta: 'Roofing growth systems for Tampa Bay — trust pages, inspection lead capture, city SEO, CRM intake, and referral attribution for roofing contractors.',
    contextLines: lines(
      'Storm-season roofing searches spike when trust content, insurance-adjacent FAQs, and city pages are already indexed — not after the first tropical wave.',
      'Inspection requests need CRM intake rules so map-pack clicks do not die in unmanaged voicemail.'
    ),
  },
  'screen-enclosure-business-growth-systems': {
    terms: ['screen enclosure website Tampa', 'pool cage SEO Tampa Bay', 'screen room local SEO'],
    meta: 'Screen enclosure growth systems for Tampa Bay — quote-first websites, city and pool-type SEO, Google Business alignment, and CRM follow-up for enclosure trades.',
    contextLines: lines(
      'Pool cage and screen room buyers compare three Tampa Bay quotes — city pages and pool-type silos win the form fill over generic contractor copy.',
      'Screen Team anchors this lane at 36 pages with st outreach — your enclosure brand gets its own lane, caps, and referral codes.'
    ),
  },
  'excavation-business-growth-systems': {
    terms: ['excavation website Florida', 'land clearing SEO', 'site work contractor marketing'],
    meta: 'Excavation & site-work growth systems — wide geography SEO, project proof pages, lead routing, and referral paths for land clearing and excavation trades.',
    contextLines: lines(
      'Land clearing and site-work companies sell on capability, radius, and proof — wide geography pages must include unique local utility, not copy-paste city swaps.',
      'Faith Works demonstrates 82-page Central Florida depth with faithworks outreach — the excavation network anchor.'
    ),
  },
  'restaurant-bar-growth-systems': {
    terms: ['restaurant website Tampa', 'bar events calendar website', 'restaurant online ordering'],
    meta: 'Restaurant & bar growth systems — events, menus, hours, ordering flows, and local discovery for Tampa Bay hospitality venues.',
    contextLines: lines(
      'Hospitality venues outgrow Instagram-only promotion when events, menus, and hours need daily updates on an owned domain with GBP alignment.',
      'Events calendars, admin-editable specials, and Stripe-ready ordering reduce platform dependency.'
    ),
  },
  'startup-business-launch-systems': {
    terms: ['startup website launch Tampa', 'new business website package', 'launch SEO foundation'],
    meta: 'Startup launch systems — credible first website, analytics, schema, Google Business setup, and growth foundations for new Tampa Bay businesses.',
    contextLines: lines(
      'Launch-week credibility matters — domain, email, GBP, and a conversion path should go live together instead of staggered DIY patches.',
      'Phased growth systems add outreach and referrals when the first jobs prove offer-market fit.'
    ),
  },
  'stripe-invoice-automation': {
    terms: ['Stripe invoice automation', 'online payment workflow', 'contractor Stripe billing'],
    meta: 'Stripe invoice automation — payment links, webhook routing, and owner notifications tied to job closeout for service businesses.',
    contextLines: lines(
      'Manual invoicing delays cash flow. Automated Stripe paths with webhook confirmation give owners same-day visibility when jobs complete.',
      'Invoice automation pairs with ticketing lanes when portal vendors need proof attachments before payment.'
    ),
  },
  'job-photo-pdf-reports': {
    terms: ['job photo PDF reports', 'field photo documentation', 'contractor proof PDF'],
    meta: 'Job photo PDF reports — field images, notes, and branded proof documents attached to job records for contractors and vendors.',
    contextLines: lines(
      'Before/after photo PDFs support premium positioning and reduce payment disputes on visual trades.',
      'Photo workflows attach to job tickets when crews already capture images on phones.'
    ),
  },
  'review-request-systems': {
    terms: ['Google review request automation', 'reputation management small business', 'review generation Tampa'],
    meta: 'Review request systems — timed asks at job completion, GBP review growth, and reputation workflows for Tampa Bay service businesses.',
    contextLines: lines(
      'Reviews compound map-pack visibility when requests fire at the right moment — job complete, customer satisfied, link one tap away.',
      'Reputation lanes integrate with CRM or job workflow when volume justifies automation.'
    ),
  },
  'service-area-page-strategy': {
    terms: ['service area pages SEO', 'city landing pages contractor', 'local SEO geography strategy'],
    meta: 'Service-area page strategy — city and county pages with internal linking, schema, and crawl depth for wide-radius Tampa Bay trades.',
    contextLines: lines(
      'Service-area pages succeed when each URL answers a real local query with unique proof — not doorway swaps with swapped city names.',
      'Hub-and-spoke internal linking between services and metros helps crawlers and AI summaries understand your true mobilization radius.'
    ),
  },
  'case-study-knight-command': {
    terms: ['business ops dashboard', 'Knight Command admin', 'unified CRM dashboard'],
    meta: 'Knight Command case study — unified /admin ops shell for CRM, email, social, referrals, and logs across Knight Logics production ports.',
    contextLines: lines(
      'Operators should not need six localhost ports bookmarked to run a growth stack — Knight Command consolidates tabs with shared auth and logging.',
    ),
  },
  'case-study-crm-outreach-system': {
    terms: ['CRM outreach case study', 'OutreachEngine production', 'outbound CRM automation'],
    meta: 'CRM outreach system case study — OutreachEngine with brand lanes, daily caps, and Email-Agent reply routing on live Tampa Bay campaigns.',
    contextLines: lines(
      'Live outreach proof matters more than feature lists — segmented lists, cap enforcement, and reply discipline appear in production client lanes.',
    ),
  },
  'case-study-vendoroo-ticket-invoice-system': {
    terms: ['vendor ticket invoice system', 'property management vendor workflow', 'ticket to invoice automation'],
    meta: 'Vendoroo ticket & invoice case study — portal ticket intake, field photos, and invoice closeout for property management vendors.',
    contextLines: lines(
      'Portal vendors need ticket-to-invoice discipline — photos, status, and PDF proof before billing — not email threads property managers cannot audit.',
    ),
  },
  'case-study-hospitality-system-pattern': {
    terms: ['restaurant website system', 'hospitality events website', 'menu ordering pattern'],
    meta: 'Hospitality system pattern case study — events, menus, hours, and ordering UX for restaurant and bar owned domains.',
    contextLines: lines(
      'Hospitality patterns separate weekly-changing content (menus, events) from stable brand pages so staff edits do not require developer tickets.',
    ),
  },
  'case-study-roof-monsters': {
    terms: ['roofing website preview', 'roofing lead capture', 'roofing local SEO pattern'],
    meta: 'Roof Monsters preview case study — roofing trust pages, inspection CTAs, and local SEO structure for Tampa Bay storm-season trades.',
    contextLines: lines(
      'Roofing preview builds document IA and conversion paths before public launch approval — trust, geography, and inspection intake first.',
    ),
  },
  'case-study-social-poster': {
    terms: ['social media manager automation', 'multi-brand social queue', 'social posting dashboard'],
    meta: 'Social Poster case study — multi-brand social queue, approvals, and showcase posting for service business growth stacks.',
    contextLines: lines(
      'Queued social posting keeps project proof visible between jobs — especially for trades where galleries drive quote quality.',
    ),
  },
  'case-study-referral-network-system': {
    terms: ['referral network case study', 'partner attribution system', 'referral payout tracking'],
    meta: 'Referral network case study — partner attribution, QR paths, consult tracking, and payout visibility across Tampa Bay trade partners.',
    contextLines: lines(
      'Referral networks scale when attribution is automatic — partners see leads and payouts without spreadsheet arguments.',
    ),
  },
};

function applySeoKeywords(page) {
  const seo = PAGE_SEO[page.slug];
  if (!seo) return page;

  if (seo.meta) page.meta = seo.meta;
  if (seo.lead) page.lead = seo.lead;
  if (seo.terms?.length) page.seoTerms = seo.terms;

  const additions = seo.contextLines || (seo.contextLine ? [seo.contextLine] : []);
  if (additions.length) {
    page.context = page.context || { paragraphs: [] };
    page.context.paragraphs = page.context.paragraphs || [];
    additions.forEach((line) => {
      if (!page.context.paragraphs.some((p) => p.includes(line.slice(0, 48)))) {
        page.context.paragraphs.push(line);
      }
    });
  }

  return page;
}

module.exports = { PAGE_SEO, applySeoKeywords, trimMeta };
