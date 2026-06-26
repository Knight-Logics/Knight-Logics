const VER = '20260626growth3';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHead(p, opts = {}) {
  const ogImage = p.ogImage || 'https://knightlogics.com/images/KnightLogicsLogo2.png';
  const canonical = `https://knightlogics.com/${p.slug}`;
  const title = opts.caseStudy ? `${p.title} Case Study | Knight Logics` : `${p.title} | Knight Logics`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="preload" href="/header.html?v=${VER}" as="fetch" crossorigin="anonymous">
    <link rel="preload" href="/footer.html?v=${VER}" as="fetch" crossorigin="anonymous">
    <script defer src="/script.js?v=${VER}"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${esc(p.meta)}">
    <meta name="author" content="Nicholas Knight">
    <meta property="og:type" content="${opts.caseStudy ? 'article' : 'website'}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(p.meta)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="Knight Logics">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(p.meta)}">
    <title>${esc(title)}</title>
    <link rel="canonical" href="${canonical}">
    <link rel="stylesheet" href="/style.css?v=${VER}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-VX36QR7HJW');</script>
    ${p.faqSchema || ''}
</head>`;
}

function renderBreadcrumb(items) {
  const parts = items.map((item, i) => {
    if (i === items.length - 1) return `<span>${item.label}</span>`;
    return `<a href="${item.href}">${item.label}</a><span>/</span>`;
  }).join('');
  return `<nav class="kl-breadcrumb" aria-label="Breadcrumb">${parts}</nav>`;
}

function renderStats(stats) {
  if (!stats || !stats.length) return '';
  return `<div class="kl-growth-stats fade-in">${stats.map((s) => `
                <div class="kl-growth-stat">
                    <span class="kl-growth-stat-value">${s.value}</span>
                    <span class="kl-growth-stat-label">${s.label}</span>
                </div>`).join('')}
            </div>`;
}

function renderFeatures(features, title = 'What this includes') {
  if (!features || !features.length) return '';
  return `<section class="kl-growth-section">
        <div class="container">
            <div class="section-header fade-in">
                <h2>${title}</h2>
                ${featuresIntro(title)}
            </div>
            <div class="kl-growth-features">${features.map((f) => `
                <article class="kl-growth-feature fade-in">
                    <div class="kl-growth-feature-icon" aria-hidden="true"><i class="fas ${f.icon || 'fa-check'}"></i></div>
                    ${f.label ? `<p class="kl-growth-feature-label">${f.label}</p>` : ''}
                    <h3>${f.title}</h3>
                    <p>${f.text}</p>
                </article>`).join('')}
            </div>
        </div>
    </section>`;
}

function featuresIntro(title) {
  if (title === 'Case study breakdown') return '';
  return '<p>Built from live Knight Logics workflows — not generic agency checklists.</p>';
}

function renderSplit(block) {
  if (!block) return '';
  const bullets = block.bullets && block.bullets.length
    ? `<ul class="kl-growth-list">${block.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>` : '';
  return `<section class="kl-growth-section kl-growth-section--alt">
        <div class="container">
            <div class="kl-growth-split fade-in">
                <div class="kl-growth-split-copy">
                    <span class="kl-growth-kicker">${block.kicker || 'The problem'}</span>
                    <h2>${block.title}</h2>
                    <p>${block.text}</p>
                    ${bullets}
                </div>
                <div class="kl-growth-split-media">
                    ${renderMediaItem(block.media, true)}
                </div>
            </div>
        </div>
    </section>`;
}

function renderMediaItem(m, single = false) {
  if (!m) return '';
  if (m.type === 'video') {
    return `<div class="kl-growth-media${single ? ' kl-growth-media--solo' : ''}">
            <video autoplay muted loop playsinline preload="metadata" aria-label="${esc(m.title || 'Demo video')}">
                <source src="${m.src}" type="video/mp4">
                ${m.vtt ? `<track kind="captions" srclang="en" label="English captions" src="${m.vtt}" default>` : ''}
            </video>
            ${m.title && !single ? `<div class="kl-growth-media-caption"><h3>${m.title}</h3><p>${m.text || ''}</p></div>` : ''}
        </div>`;
  }
  return `<div class="kl-growth-media${single ? ' kl-growth-media--solo' : ''}">
            <img src="${m.src}" alt="${esc(m.alt || m.title || '')}" loading="lazy" decoding="async"${m.width ? ` width="${m.width}"` : ''}${m.height ? ` height="${m.height}"` : ''}>
            ${m.title && !single ? `<div class="kl-growth-media-caption"><h3>${m.title}</h3><p>${m.text || ''}</p></div>` : ''}
        </div>`;
}

function renderMediaBlocks(blocks) {
  if (!blocks || !blocks.length) return '';
  return blocks.map((b, i) => {
    const reverse = b.align === 'right' ? ' kl-growth-split--reverse' : '';
    return `<section class="kl-growth-section${i % 2 ? ' kl-growth-section--alt' : ''}">
        <div class="container">
            <div class="kl-growth-split${reverse} fade-in">
                <div class="kl-growth-split-copy">
                    ${b.kicker ? `<span class="kl-growth-kicker">${b.kicker}</span>` : ''}
                    <h2>${b.title}</h2>
                    <p>${b.text}</p>
                    ${b.bullets ? `<ul class="kl-growth-list">${b.bullets.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
                </div>
                <div class="kl-growth-split-media">${renderMediaItem(b.media, true)}</div>
            </div>
        </div>
    </section>`;
  }).join('\n');
}

function renderProcess(steps, title = 'How we build it') {
  if (!steps || !steps.length) return '';
  return `<section class="kl-growth-section">
        <div class="container">
            <div class="section-header fade-in">
                <h2>${title}</h2>
                <p>A clear path from intake to launch — scoped to what your team will actually use.</p>
            </div>
            <div class="kl-growth-process">${steps.map((s, i) => `
                <div class="kl-growth-step fade-in">
                    <span class="kl-growth-step-num">${i + 1}</span>
                    <div>
                        <h3>${s.title}</h3>
                        <p>${s.text}</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderIdealFor(items, title = 'Best fit for') {
  if (!items || !items.length) return '';
  return `<section class="kl-growth-section kl-growth-section--alt">
        <div class="container">
            <div class="section-header fade-in">
                <h2>${title}</h2>
            </div>
            <div class="kl-growth-ideal-grid">${items.map((item) => `
                <div class="kl-growth-ideal-card fade-in"><i class="fas fa-check-circle" aria-hidden="true"></i><p>${item}</p></div>`).join('')}
            </div>
        </div>
    </section>`;
}

function renderProof(proof) {
  if (!proof) return '';
  return `<section class="kl-growth-section">
        <div class="container">
            <div class="kl-growth-proof fade-in">
                <div class="kl-growth-proof-media">
                    <img src="${proof.image}" alt="${esc(proof.imageAlt || proof.title)}" loading="lazy" decoding="async">
                    ${proof.badge ? `<span class="kl-growth-proof-badge">${proof.badge}</span>` : ''}
                </div>
                <div class="kl-growth-proof-copy">
                    <span class="kl-growth-kicker">Proof</span>
                    <h2>${proof.title}</h2>
                    <p>${proof.text}</p>
                    <a href="${proof.href}" class="btn-secondary">${proof.linkLabel || 'View case study'}</a>
                </div>
            </div>
        </div>
    </section>`;
}

function renderFaq(faq) {
  if (!faq || !faq.length) return '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
  return `<section class="kl-growth-section kl-growth-section--alt">
        <div class="container">
            <div class="section-header fade-in">
                <h2>Common questions</h2>
            </div>
            <div class="kl-growth-faq">${faq.map((f) => `
                <details class="kl-growth-faq-item fade-in">
                    <summary>${f.q}</summary>
                    <p>${f.a}</p>
                </details>`).join('')}
            </div>
        </div>
    </section>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function renderLinks(links, pricingNote) {
  if (!links || !links.length) return '';
  return `<section class="kl-growth-section kl-growth-section--compact">
        <div class="container">
            ${pricingNote ? `<p class="kl-growth-pricing-note fade-in">${pricingNote}</p>` : ''}
            <div class="kl-growth-links fade-in">${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join('\n                ')}</div>
        </div>
    </section>`;
}

function renderCta(cta) {
  const title = cta?.title || 'Ready to plan your build?';
  const text = cta?.text || 'Tell us what is broken, what you are trying to grow, and what systems you already use.';
  return `<section class="svc-cta-band">
        <div class="container">
            <div class="svc-cta-band-inner fade-in">
                <h2>${title}</h2>
                <p>${text}</p>
                <a href="/book-consultation" class="btn-primary">Book a Free Consultation</a>
            </div>
        </div>
    </section>`;
}

function renderServicePage(p) {
  const crumbs = [{ href: '/', label: 'Home' }];
  if (p.parent) crumbs.push({ href: p.parent.href, label: p.parent.label });
  crumbs.push({ label: p.title });
  const heroClass = p.heroImage ? ' svc-hero--media' : '';
  const heroStyle = p.heroImage ? ` style="--kl-hero-image: url('${p.heroImage.src}');"` : '';
  const heroMedia = p.heroImage
    ? `<div class="kl-growth-hero-media fade-in"><img src="${p.heroImage.src}" alt="${esc(p.heroImage.alt)}" loading="eager" decoding="async"></div>`
    : '';

  return `${renderHead(p)}
<body class="kl-growth-page kl-growth-page--pro page-${p.slug}">
    <div id="header-container"></div>

    <section class="svc-hero${heroClass}"${heroStyle}>
        <div class="container">
            <div class="kl-growth-hero-grid">
                <div class="svc-hero-inner fade-in">
                    ${renderBreadcrumb(crumbs)}
                    <span class="svc-eyebrow"><i class="fas ${p.heroIcon || 'fa-layer-group'}"></i> ${p.eyebrow}</span>
                    <h1>${p.h1}</h1>
                    <p>${p.lead}</p>
                    ${renderStats(p.stats)}
                    <div class="svc-cta-row">
                        <a href="/book-consultation" class="btn-primary">Book a Consultation</a>
                        <a href="/website-growth-audit" class="btn-secondary">Free Growth Audit</a>
                    </div>
                </div>
                ${heroMedia}
            </div>
        </div>
    </section>

    ${renderSplit(p.problem)}
    ${renderFeatures(p.features)}
    ${renderMediaBlocks(p.mediaBlocks)}
    ${renderProcess(p.process)}
    ${renderIdealFor(p.idealFor)}
    ${renderProof(p.proof)}
    ${renderFaq(p.faq)}
    ${renderLinks(p.links, p.pricingNote)}
    ${renderCta(p.cta)}

    <div id="footer-container"></div>
</body>
</html>`;
}

function renderCaseStudyMetrics(metrics) {
  if (!metrics || !metrics.length) return '';
  return `<div class="kl-growth-metrics fade-in">${metrics.map((m) => `
                    <div class="kl-growth-metric"><strong>${m.value}</strong><span>${m.label}</span></div>`).join('')}
                </div>`;
}

function renderStack(stack) {
  if (!stack || !stack.length) return '';
  return `<div class="cs-tech-stack kl-growth-stack-tags">${stack.map((t) => `<span class="cs-tag">${t}</span>`).join('\n                        ')}</div>`;
}

function renderCaseStudySections(sections) {
  return sections.map((s) => `
                <article class="kl-growth-story-block fade-in">
                    <h3>${s.title}</h3>
                    ${(s.paragraphs || []).map((para) => `<p>${para}</p>`).join('\n                    ')}
                    ${s.bullets ? `<ul class="kl-growth-list">${s.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>` : ''}
                </article>`).join('');
}

function renderCaseStudy(c) {
  const crumbs = [
    { href: '/', label: 'Home' },
    { href: '/case-studies', label: 'Case Studies' },
    { label: c.title }
  ];
  const heroStyle = c.heroImage ? ` style="--kl-hero-image: url('${c.heroImage.src}');"` : '';

  return `${renderHead(c, { caseStudy: true })}
<body class="kl-growth-page kl-growth-page--pro kl-case-study-page page-${c.slug}">
    <div id="header-container"></div>

    <section class="svc-hero svc-hero--media svc-hero--case"${heroStyle}>
        <div class="container">
            <div class="svc-hero-inner fade-in">
                ${renderBreadcrumb(crumbs)}
                <span class="svc-eyebrow"><i class="fas fa-clipboard-check"></i> ${c.badge}</span>
                <h1>${c.h1}</h1>
                <p>${c.lead}</p>
                <div class="cs-tech-stack">${c.tags.map((t) => `<span class="cs-tag">${t}</span>`).join('\n                        ')}</div>
                ${renderCaseStudyMetrics(c.metrics)}
                <div class="svc-cta-row">
                    ${c.liveUrl ? `<a href="${c.liveUrl}" class="btn-primary" target="_blank" rel="noopener">View Live Project</a>` : ''}
                    <a href="${c.serviceLink}" class="btn-secondary">${c.serviceLabel}</a>
                </div>
            </div>
        </div>
    </section>

    <section class="kl-growth-section">
        <div class="container">
            <div class="section-header fade-in">
                <h2>Case study breakdown</h2>
                <p>${c.subhead}</p>
            </div>
            <div class="kl-growth-story">${renderCaseStudySections(c.sections)}</div>
            ${c.stack ? `<div class="fade-in"><h3 class="kl-growth-inline-heading">Tools &amp; stack</h3>${renderStack(c.stack)}</div>` : ''}
        </div>
    </section>

    ${renderMediaBlocks(c.mediaBlocks)}
    ${c.timeline ? renderProcess(c.timeline, 'Workflow snapshot') : ''}
    ${renderProof(c.proof)}
    ${renderLinks(c.links)}
    ${renderCta({ title: 'Want a similar system?', text: c.cta })}

    <div id="footer-container"></div>
</body>
</html>`;
}

module.exports = {
  VER,
  renderServicePage,
  renderCaseStudy
};
