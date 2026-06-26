const fs = require('fs');
const path = require('path');

const VER = '20260626growth2';
const root = path.join(__dirname, '..');

function renderGrowthPage(p) {
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
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-VX36QR7HJW');</script>
</head>
<body class="kl-growth-page page-${p.slug}">
    <div id="header-container"></div>
    <section class="svc-hero">
        <div class="container">
            <div class="svc-hero-inner fade-in">
                <nav class="kl-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span>${p.parent ? `<a href="${p.parent.href}">${p.parent.label}</a><span>/</span>` : ''}<span>${p.title}</span></nav>
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
            <div class="section-header fade-in"><h2>What this includes</h2><p>Practical systems tied to real operations — not generic agency deliverables.</p></div>
            <div class="kl-growth-stack">${stacks}</div>
            <div class="kl-growth-links fade-in">${links}</div>
        </div>
    </section>
    <section class="svc-cta-band">
        <div class="container">
            <div class="svc-cta-band-inner fade-in">
                <h2>Ready to plan your build?</h2>
                <p>Tell us what is broken, what you are trying to grow, and what systems you already use.</p>
                <a href="/book-consultation" class="btn-primary">Book a Free Consultation</a>
            </div>
        </div>
    </section>
    <div id="footer-container"></div>
</body>
</html>`;
}

function renderCaseStudy(c) {
  const tags = c.tags.map(t => `<span class="cs-tag">${t}</span>`).join('\n                        ');
  const sections = c.sections.map(s => `<div class="kl-growth-stack-item fade-in"><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('\n                ');
  const links = c.links.map(([href, label]) => `<a href="${href}">${label}</a>`).join('\n                ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="preload" href="/header.html?v=${VER}" as="fetch" crossorigin="anonymous">
    <link rel="preload" href="/footer.html?v=${VER}" as="fetch" crossorigin="anonymous">
    <script defer src="/script.js?v=${VER}"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${c.meta}">
    <meta property="og:title" content="${c.title} Case Study | Knight Logics">
    <meta property="og:description" content="${c.meta}">
    <meta property="og:url" content="https://knightlogics.com/${c.slug}">
    <meta property="og:image" content="https://knightlogics.com/images/KnightLogicsLogo2.png">
    <title>${c.title} Case Study | Knight Logics</title>
    <link rel="canonical" href="https://knightlogics.com/${c.slug}">
    <link rel="stylesheet" href="/style.css?v=${VER}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="kl-growth-page kl-case-study-page">
    <div id="header-container"></div>
    <section class="svc-hero">
        <div class="container">
            <div class="svc-hero-inner fade-in">
                <nav class="kl-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/case-studies">Case Studies</a><span>/</span><span>${c.title}</span></nav>
                <span class="svc-eyebrow"><i class="fas fa-clipboard-check"></i> ${c.badge}</span>
                <h1>${c.h1}</h1>
                <p>${c.lead}</p>
                <div class="cs-tech-stack" style="margin-top:18px;">${tags}</div>
                <div class="svc-cta-row" style="margin-top:22px;">
                    ${c.liveUrl ? `<a href="${c.liveUrl}" class="btn-primary" target="_blank" rel="noopener">View Live Project</a>` : ''}
                    <a href="${c.serviceLink}" class="btn-secondary">${c.serviceLabel}</a>
                </div>
            </div>
        </div>
    </section>
    <section class="svc-features">
        <div class="container">
            <div class="section-header fade-in"><h2>Case study breakdown</h2><p>${c.subhead}</p></div>
            <div class="kl-growth-stack">${sections}</div>
            <div class="kl-growth-links fade-in">${links}</div>
        </div>
    </section>
    <section class="svc-cta-band">
        <div class="container">
            <div class="svc-cta-band-inner fade-in">
                <h2>Want a similar system?</h2>
                <p>${c.cta}</p>
                <a href="/book-consultation" class="btn-primary">Book a Consultation</a>
            </div>
        </div>
    </section>
    <div id="footer-container"></div>
</body>
</html>`;
}

const subPages = [
  { slug: 'ai-business-automation', parent: { href: '/service-ai-automation', label: 'AI Automation' }, title: 'AI Business Automation', eyebrow: 'Automation lane', h1: 'AI Business Automation for Real Operations', meta: 'AI business automation for Tampa Bay small businesses — practical workflows, not hype demos.', lead: 'Targeted AI where it saves real time: routing, summarization, queue assistance, and workflow triggers tied to CRM, email, and ops dashboards.', stacks: [['Workflow triggers', 'Automate repetitive decisions when the rules are clear and the cost of mistakes is low.'], ['Inbox & reply assist', 'Sort, label, and surface replies that need human attention.'], ['Reporting assist', 'Turn queue data into owner-readable summaries and alerts.'], ['Guardrails', 'Human approval steps, logging, and caps so automation stays trustworthy.']], links: [['/service-ai-automation', 'Automation Services'], ['/email-agent-automation', 'Email-Agent Automation'], ['/workflow-automation', 'Workflow Automation']] },
  { slug: 'internal-business-tools', parent: { href: '/service-ai-automation', label: 'AI Automation' }, title: 'Internal Business Tools', eyebrow: 'Custom software', h1: 'Custom Internal Business Tools & Admin Panels', meta: 'Custom internal tools and admin panels for small businesses — dashboards, trackers, and ops utilities.', lead: 'When spreadsheets and manual checklists become bottlenecks, we turn repeated processes into tools your team can actually use every day.', stacks: [['Admin panels', 'Owner and staff views with the fields and actions that match your process.'], ['Trackers & queues', 'Lead, job, ticket, and payout visibility in one place.'], ['Role-based views', 'Different screens for office staff, field crews, and ownership.'], ['Deployment', 'Web-first tools that work on desktop and mobile browsers.']], links: [['/service-ai-automation', 'Automation Services'], ['/business-dashboard-development', 'Dashboard Development'], ['/ticketing-invoicing-job-workflows', 'Job Workflows']] },
  { slug: 'api-integration-services', parent: { href: '/service-ai-automation', label: 'AI Automation' }, title: 'API Integration Services', eyebrow: 'Integrations', h1: 'API Integration Services for Business Systems', meta: 'API integrations for Stripe, Google, CRMs, webhooks, and third-party business tools.', lead: 'Connect the tools you already pay for so data moves automatically instead of being retyped between systems.', stacks: [['Stripe & payments', 'Checkout, invoices, webhooks, and payment-status sync.'], ['Google stack', 'Analytics, Search Console, Business Profile, Drive, and Gmail APIs.'], ['CRM & outreach', 'Lead sync, reply events, and campaign logging.'], ['Webhooks & queues', 'Reliable event handling with retries and failure alerts.']], links: [['/service-ai-automation', 'Automation Services'], ['/stripe-invoice-automation', 'Stripe Invoice Automation'], ['/crm-outreach-lead-generation', 'CRM Outreach']] },
  { slug: 'workflow-automation', parent: { href: '/service-ai-automation', label: 'AI Automation' }, title: 'Workflow Automation', eyebrow: 'Process automation', h1: 'Workflow Automation for Small Business Operations', meta: 'Workflow automation for repetitive business processes — forms, notifications, routing, and status updates.', lead: 'Automate the steps that happen every week: intake, assignment, follow-up, file capture, and status changes.', stacks: [['Intake to action', 'Form or ticket in → folder created → owner notified → tracker updated.'], ['Follow-up sequences', 'Review requests, quote reminders, and stale-lead nudges.'], ['File capture', 'Photos, PDFs, and proofs attached to the right job record.'], ['Monitoring', 'Failures surface before they become missed opportunities.']], links: [['/automation', 'Automation Overview'], ['/ticketing-invoicing-job-workflows', 'Ticketing Workflows']] },
  { slug: 'business-dashboard-development', parent: { href: '/service-ai-automation', label: 'AI Automation' }, title: 'Business Dashboard Development', eyebrow: 'Visibility', h1: 'Business Dashboard Development & KPI Reporting', meta: 'Custom business dashboards for owners — queue depth, lead sources, failures, and revenue signals.', lead: 'Owner visibility without logging into five different tools — one dashboard that shows what needs attention next.', stacks: [['Lead & source reporting', 'See which channels, partners, and campaigns produce work.'], ['Ops health', 'Queue depth, last successful action, and failure alerts.'], ['Revenue signals', 'Quotes, booked jobs, invoices sent, and paid status where available.'], ['Mobile-friendly views', 'Check the business from phone without opening complex admin UIs.']], links: [['/business-growth-systems', 'Growth Systems'], ['/case-study-knight-command', 'Knight Command Case Study']] },
  { slug: 'email-agent-automation', parent: { href: '/service-ai-automation', label: 'AI Automation' }, title: 'Email-Agent Automation', eyebrow: 'Inbox control', h1: 'Email-Agent Automation & Multi-Inbox Routing', meta: 'Email-Agent automation — multi-inbox routing, CRM reply sorting, and alert workflows for business email.', lead: 'Bring business inboxes into one interface and separate CRM replies from manual conversations, bounces, and noise.', stacks: [['Multi-inbox routing', 'Business accounts unified with clear folder rules.'], ['CRM reply detection', 'Outreach replies land in the right queue automatically.'], ['Manual vs automated', 'Keep human conversations separate from campaign traffic.'], ['Alerting', 'Surface urgent replies without living inside email all day.']], links: [['/automation', 'Automation Systems'], ['/case-study-crm-outreach-system', 'CRM Outreach Case Study']] },
  { slug: 'social-media-automation-systems', parent: { href: '/service-ai-automation', label: 'AI Automation' }, title: 'Social Media Automation Systems', eyebrow: 'Content ops', h1: 'Social Media Automation Systems', meta: 'Social media automation with queued content, posting windows, API and Playwright runners, and failure reporting.', lead: 'Keep company accounts active with scheduled content, brand-specific queues, and failure reporting instead of silent automation problems.', stacks: [['Queued content', 'Posts scheduled per brand with clear windows.'], ['API + browser runners', 'Use the right method per platform and use case.'], ['Failure reporting', 'Know when a post fails before the week is wasted.'], ['Brand separation', 'Different companies, templates, and credentials stay isolated.']], links: [['/automation', 'Automation Overview'], ['/case-study-social-poster', 'Social Poster Case Study']] },
  { slug: 'handyman-business-growth-systems', parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' }, title: 'Handyman Business Growth Systems', eyebrow: 'Home services', h1: 'Handyman Business Growth Systems', meta: 'Handyman business growth systems — website, local SEO, booking, CRM outreach, and job tracking.', lead: 'Built for estimate-first local trades that need calls, booking flow, and ops support behind the website.', stacks: [['Service & area pages', 'Clear offers and local structure for map and search visibility.'], ['Booking & call CTAs', 'Conversion paths that match how handyman jobs are sold.'], ['CRM & follow-up', 'Outreach, reply tracking, and quote follow-up workflows.'], ['Job records', 'Photos, invoices, and proof attached to each job.']], links: [['/case-study-knight-group', 'Knight Group Case Study'], ['/contractor-growth-systems', 'Contractor Systems']] },
  { slug: 'roofing-business-growth-systems', parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' }, title: 'Roofing Business Growth Systems', eyebrow: 'Roofing trades', h1: 'Roofing Business Growth Systems', meta: 'Roofing website design, local SEO, lead systems, and workflow automation for Tampa Bay roofers.', lead: 'Roofing companies need storm-season visibility, trust signals, and lead tracking — not just a brochure site.', stacks: [['Trust & proof pages', 'Projects, service areas, insurance-friendly messaging, and FAQs.'], ['Local SEO architecture', 'Service and city pages aligned to how roofers actually sell.'], ['Lead capture', 'Forms, call tracking, and CRM intake for estimate requests.'], ['Referral & partner flow', 'Track partner leads and repeat referral sources.']], links: [['/local-visibility-systems', 'Local Visibility'], ['/case-study-roof-monsters', 'Roof Monsters Preview']] },
  { slug: 'screen-enclosure-business-growth-systems', parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' }, title: 'Screen Enclosure Growth Systems', eyebrow: 'Pool & screen trades', h1: 'Screen Enclosure Business Growth Systems', meta: 'Screen enclosure and pool cage business growth systems for Tampa Bay — local SEO, quotes, and lead flow.', lead: 'Pool enclosure trades live on service-area SEO, quote forms, and phone calls — we build systems around that reality.', stacks: [['Service-area SEO', 'City and service pages for Tampa Bay coverage.'], ['Quote-first CTAs', 'Forms and call paths tuned for enclosure estimates.'], ['Schema & GBP', 'LocalBusiness, FAQ, and map-pack alignment.'], ['Ops support', 'Quote tracking and follow-up after the site launches.']], links: [['/case-study-screen-team', 'Screen Team Case Study'], ['/contractor-growth-systems', 'Contractor Systems']] },
  { slug: 'excavation-business-growth-systems', parent: { href: '/contractor-growth-systems', label: 'Contractor Systems' }, title: 'Excavation Business Growth Systems', eyebrow: 'Site work trades', h1: 'Excavation & Site Work Growth Systems', meta: 'Excavation and site work business growth systems — local SEO, lead capture, and referral tracking.', lead: 'Land clearing, grading, and excavation companies need large service footprints and clear proof — not generic contractor templates.', stacks: [['Large service footprint', 'Service and geography pages for wide coverage areas.'], ['Project proof', 'Before/after galleries and capability pages.'], ['Lead routing', 'Forms and call CTAs tied to job type and geography.'], ['Partner referrals', 'Track subcontractor and partner lead sources.']], links: [['/case-study-faith-works', 'Faith Works Case Study'], ['/home-service-business-growth-systems', 'Home Service Systems']] },
  { slug: 'restaurant-bar-growth-systems', parent: { href: '/online-ordering-systems', label: 'Ordering Systems' }, title: 'Restaurant & Bar Growth Systems', eyebrow: 'Hospitality', h1: 'Restaurant & Bar Business Growth Systems', meta: 'Restaurant and bar websites with events, menus, ordering flows, and admin-editable content.', lead: 'Hospitality businesses need more than a menu PDF — events, ordering, local visibility, and easy content updates.', stacks: [['Events & menus', 'Admin-editable content for specials, events, and hours.'], ['Ordering flows', 'Pickup or order-ahead paths without bloated platforms.'], ['Local visibility', 'GBP alignment, schema, and map discovery support.'], ['Future POS hooks', 'Room to integrate Toast or POS later without rebuilding.']], links: [['/online-ordering-systems', 'Ordering Systems'], ['/case-study-whistle-stop', 'Whistle Stop Preview']] },
  { slug: 'startup-business-launch-systems', parent: { href: '/business-growth-systems', label: 'Growth Systems' }, title: 'Startup Business Launch Systems', eyebrow: 'New businesses', h1: 'Startup Business Launch Systems', meta: 'Startup launch systems — website, local SEO, analytics, CRM basics, and growth infrastructure from day one.', lead: 'Launch with the right foundation instead of rebuilding after six months when leads and ops get messy.', stacks: [['Launch website', 'Credibility, offer clarity, and conversion paths from day one.'], ['Analytics & search', 'Search Console, sitemap, schema, and baseline tracking.'], ['Lead capture', 'Forms, CRM basics, and follow-up workflow.'], ['Scale path', 'Clear upgrade route into full growth systems.']], links: [['/service-websites', 'Website Services'], ['/website-growth-audit', 'Free Growth Audit']] },
  { slug: 'stripe-invoice-automation', parent: { href: '/ticketing-invoicing-job-workflows', label: 'Job Workflows' }, title: 'Stripe Invoice Automation', eyebrow: 'Payments', h1: 'Stripe Invoice Automation for Service Businesses', meta: 'Automated Stripe invoicing from completed jobs — payment links, status sync, and owner visibility.', lead: 'Turn completed field work into sent invoices without manual re-entry between job trackers and payment tools.', stacks: [['Job → invoice trigger', 'Completed job status creates invoice draft or payment link.'], ['Stripe sync', 'Payment status reflected back on the job record.'], ['Customer delivery', 'Email or SMS payment link with job context.'], ['Reporting', 'Sent, paid, and overdue invoice visibility.']], links: [['/ticketing-invoicing-job-workflows', 'Job Workflows'], ['/case-study-vendoroo-ticket-invoice-system', 'Vendoroo Case Study']] },
  { slug: 'job-photo-pdf-reports', parent: { href: '/ticketing-invoicing-job-workflows', label: 'Job Workflows' }, title: 'Job Photo & PDF Reports', eyebrow: 'Field proof', h1: 'Job Photo Attachments & PDF Field Reports', meta: 'Mobile job photos and PDF completion reports for property managers, vendors, and field service companies.', lead: 'Attach photos and generate PDF proof packets per job for portals, property managers, and customers.', stacks: [['Mobile photo capture', 'Field photos tied to job ID and status.'], ['PDF report generation', 'Branded completion packets with photos and notes.'], ['Portal-ready exports', 'Files structured for vendor portal upload.'], ['Customer delivery', 'Optional client-facing proof links.']], links: [['/ticketing-invoicing-job-workflows', 'Job Workflows'], ['/contractor-growth-systems', 'Contractor Systems']] },
  { slug: 'review-request-systems', parent: { href: '/local-visibility-systems', label: 'Local Visibility' }, title: 'Review Request Systems', eyebrow: 'Reputation', h1: 'Automated Review Request Systems', meta: 'Review request workflows for Google Business Profile growth — timing, links, and tracking.', lead: 'Systematic review requests after completed jobs — without spamming customers or breaking platform rules.', stacks: [['Timing rules', 'Send requests after job completion or payment milestones.'], ['GBP-aligned links', 'Direct customers to the correct Google review path.'], ['Tracking', 'Log sent requests and completed reviews where visible.'], ['Staff workflow', 'Simple owner or crew trigger options.']], links: [['/local-visibility-systems', 'Local Visibility'], ['/service-google-business-profile', 'GBP Services']] },
  { slug: 'service-area-page-strategy', parent: { href: '/local-visibility-systems', label: 'Local Visibility' }, title: 'Service Area Page Strategy', eyebrow: 'Local SEO', h1: 'Service Area Page Strategy for Local Businesses', meta: 'Service area page strategy — city, county, and service pages that support local search without keyword spam.', lead: 'Build geography and service coverage the way Google and customers actually expect — clear, useful, and internally linked.', stacks: [['City & county pages', 'Useful local pages tied to real service coverage.'], ['Service silos', 'Separate pages for distinct offers and intents.'], ['Internal linking', 'Hub pages, breadcrumbs, and crawl paths that make sense.'], ['GBP alignment', 'Website geography matches profile service areas.']], links: [['/service-local-seo', 'Local SEO Services'], ['/case-study-faith-works', 'Faith Works Example']] }
];

const caseStudies = [
  { slug: 'case-study-knight-command', badge: 'Internal System', title: 'Knight Command', h1: 'Knight Command Admin & Ops Shell', meta: 'Internal case study: Knight Command admin shell for referrals, outreach, local services, and ops tabs.', lead: 'Knight Command is the internal ops shell behind Knight Logics growth infrastructure — one place to reach referrals, outreach, and local service workflows.', subhead: 'Built for operator speed, not public marketing fluff.', tags: ['Internal build', 'Admin shell', 'Embeds', 'Ops tabs'], sections: [['Problem', 'Too many separate tools and URLs for daily growth operations.'], ['What was built', 'Unified admin shell with embed routes for referrals, outreach, and local services.'], ['Tools used', 'Secure auth, cloud routing, and modular tab architecture.'], ['Early signal', 'Faster daily ops with fewer context switches between systems.']], links: [['/business-growth-systems', 'Growth Systems'], ['/automation', 'Automation Overview']], serviceLink: '/business-growth-systems', serviceLabel: 'Explore Growth Systems', cta: 'Ask about building a similar internal command center for your business.' },
  { slug: 'case-study-crm-outreach-system', badge: 'Internal System · Live Workflow', title: 'CRM Outreach System', h1: 'CRM Outreach Queue & Reply Tracking', meta: 'Case study: CRM outreach system with segmented lists, send queues, and reply tracking used on real campaigns.', lead: 'A live outreach engine used for segmented local-service campaigns — not a mockup dashboard.', subhead: 'Demonstrates the CRM Outreach & Lead Generation service in production.', tags: ['CRM queue', 'Email outreach', 'Reply tracking', 'Dashboards'], sections: [['Problem', 'Manual outreach mixed templates, lists, and sender reputations.'], ['What was built', 'Segmented lists, daily send queues, preview, and reply routing.'], ['Tools used', 'Custom CRM UI, email routing, reliability dashboards.'], ['Early signal', 'Knight Group generated substantial work from one well-targeted outreach message.']], links: [['/crm-outreach-lead-generation', 'CRM Outreach Service'], ['/automation', 'Automation Overview']], serviceLink: '/crm-outreach-lead-generation', serviceLabel: 'CRM Outreach Service', cta: 'We can adapt this outreach engine for your trade and territory.' },
  { slug: 'case-study-vendoroo-ticket-invoice-system', badge: 'Active Build · Internal Workflow', title: 'Vendoroo Ticket & Invoice System', h1: 'Vendor Portal Ticket Intake & Invoice Automation', meta: 'Case study: Vendoroo-style ticket intake, mobile job tracking, photos, PDF reports, and Stripe invoicing.', lead: 'Field-service workflow for portal tickets — intake, photos, PDF proof, and invoice creation in one system.', subhead: 'Represents the Ticketing, Invoicing & Job Workflows offer.', tags: ['Ticket intake', 'Mobile jobs', 'PDF proof', 'Stripe invoices'], sections: [['Problem', 'Portal tickets, photos, and invoices lived in disconnected tools.'], ['What was built', 'Ticket queue, mobile job updates, photo attachments, and invoice triggers.'], ['Tools used', 'Custom job tracker, PDF generation, Stripe payment links.'], ['Early signal', 'Cleaner vendor workflow with less manual re-entry after each job.']], links: [['/ticketing-invoicing-job-workflows', 'Job Workflow Service'], ['/stripe-invoice-automation', 'Stripe Automation']], serviceLink: '/ticketing-invoicing-job-workflows', serviceLabel: 'Job Workflow Service', cta: 'Ideal for property maintenance vendors and portal-driven field work.' },
  { slug: 'case-study-whistle-stop', badge: 'Client Preview · Active Build', title: 'Whistle Stop', h1: 'Restaurant Events, Menu & Ordering System Preview', meta: 'Case study preview: Whistle Stop restaurant/bar system with events, menus, and ordering infrastructure.', lead: 'A hospitality build in progress — events, admin-editable menus, and ordering flows without a bloated platform.', subhead: 'Preview case study for restaurant & bar growth systems.', tags: ['Restaurant', 'Events', 'Ordering', 'Admin editable'], sections: [['Problem', 'Menu, events, and ordering needs outgrew a basic brochure site.'], ['What is being built', 'Admin-editable menus/events and ordering-ready site architecture.'], ['Tools used', 'Hand-coded site, content admin patterns, ordering flow prep.'], ['Status', 'Active build — public preview when client approves launch marketing.']], links: [['/restaurant-bar-growth-systems', 'Restaurant Systems'], ['/online-ordering-systems', 'Ordering Systems']], serviceLink: '/restaurant-bar-growth-systems', serviceLabel: 'Restaurant Systems', cta: 'Planning a restaurant or bar site with events and ordering? Start here.' },
  { slug: 'case-study-roof-monsters', badge: 'Client Preview', title: 'Roof Monsters', h1: 'Roofing Brand Site & Lead System Preview', meta: 'Case study preview: Roof Monsters roofing brand website and local lead system in development.', lead: 'Roofing growth system preview — local SEO structure, trust pages, and lead capture tuned for estimate-first sales.', subhead: 'Labeled preview until public launch is approved.', tags: ['Roofing', 'Local SEO', 'Lead capture', 'Preview'], sections: [['Problem', 'Needed a credible web presence and lead path before storm season push.'], ['What is being built', 'Service pages, proof layout, and estimate-first conversion paths.'], ['Tools used', 'Hand-coded site, schema, GBP-aligned structure.'], ['Status', 'Client preview — details published when launch is approved.']], links: [['/roofing-business-growth-systems', 'Roofing Systems'], ['/contractor-growth-systems', 'Contractor Systems']], serviceLink: '/roofing-business-growth-systems', serviceLabel: 'Roofing Systems', cta: 'Roofing companies can scope a similar launch system anytime.' },
  { slug: 'case-study-social-poster', badge: 'Internal System · Live Workflow', title: 'Social Poster', h1: 'Multi-Brand Social Posting Runners', meta: 'Case study: social posting automation with queued content, posting windows, and failure reporting.', lead: 'Production social runners that keep brand accounts active with queued posts and visible failures.', subhead: 'Supports the Social Media Automation Systems service lane.', tags: ['Social automation', 'Queue scheduling', 'Multi-brand', 'Failure alerts'], sections: [['Problem', 'Silent automation failures and inconsistent posting across brands.'], ['What was built', 'Queued runners with posting windows and failure reporting.'], ['Tools used', 'API integrations, browser runners where needed, ops dashboards.'], ['Early signal', 'More reliable posting with fewer surprise gaps in the schedule.']], links: [['/social-media-automation-systems', 'Social Automation'], ['/automation', 'Automation Overview']], serviceLink: '/social-media-automation-systems', serviceLabel: 'Social Automation', cta: 'Ask about social runners for your company accounts.' },
  { slug: 'case-study-referral-network-system', badge: 'Internal System · Live Workflow', title: 'Referral Network System', h1: 'Referral Codes, QR Brochures & Partner Attribution', meta: 'Case study: referral tracking with QR brochures, partner codes, attribution, and payout visibility.', lead: 'The referral infrastructure behind Knight Logics partner tracking — QR links, codes, and dashboard visibility.', subhead: 'Supports Referral Network Systems and the public Referral Program.', tags: ['Referral codes', 'QR brochures', 'Attribution', 'Partner dashboard'], sections: [['Problem', 'Partner referrals were hard to attribute and payout status was unclear.'], ['What was built', 'QR brochure links, referral codes, tracked forms, and payout visibility.'], ['Tools used', 'Custom referral dashboard, tracked landing paths, reporting.'], ['Early signal', 'Cleaner partner attribution before scaling a local trade network.']], links: [['/referral-network-systems', 'Referral Systems'], ['/referral-program', 'Join Referral Program']], serviceLink: '/referral-network-systems', serviceLabel: 'Referral Systems', cta: 'We can build referral tracking for your company or partner network.' }
];

const allSlugs = [...subPages.map(p => p.slug), ...caseStudies.map(c => c.slug)];

subPages.forEach(p => fs.writeFileSync(path.join(root, `${p.slug}.html`), renderGrowthPage(p), 'utf8'));
caseStudies.forEach(c => fs.writeFileSync(path.join(root, `${c.slug}.html`), renderCaseStudy(c), 'utf8'));

console.log('Wrote', subPages.length, 'sub-pages and', caseStudies.length, 'case studies');

module.exports = { VER, allSlugs, subPages, caseStudies };
