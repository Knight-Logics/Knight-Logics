/**
 * Referral page live demo — QR path preview + brochure field preview (Knight Logics paths only)
 */
(function initReferralDemo() {
    const DEMO_BASE = 'https://knightlogics.com/ref/';
    const ALLOWED_DEST = [
        { value: '/website-growth-audit', label: 'Free Website & Growth Audit' },
        { value: '/book-consultation', label: 'Book a Consultation' },
        { value: '/contact', label: 'Contact' },
        { value: '/pricing', label: 'Pricing' }
    ];

    function slugify(text) {
        return String(text || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 48) || 'demo-partner';
    }

    function qrUrl(data, size) {
        return 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size +
            '&margin=8&data=' + encodeURIComponent(data);
    }

    function buildRefPath(partner, campaign, dest) {
        const slug = slugify(partner);
        const camp = slugify(campaign);
        const base = DEMO_BASE + slug;
        const url = new URL(dest, 'https://knightlogics.com');
        if (camp && camp !== 'demo-partner') url.searchParams.set('utm_campaign', camp);
        url.searchParams.set('ref', slug);
        return { slug, landing: url.pathname + url.search, fullUrl: url.href, refPath: '/ref/' + slug };
    }

    function wireForm(root) {
        const partner = root.querySelector('[data-referral-demo-partner]');
        const campaign = root.querySelector('[data-referral-demo-campaign]');
        const dest = root.querySelector('[data-referral-demo-dest]');
        const refOut = root.querySelector('[data-referral-demo-ref-url]');
        const qrImg = root.querySelector('[data-referral-demo-qr]');
        const steps = root.querySelector('[data-referral-demo-steps]');
        const brochure = root.querySelector('[data-referral-demo-brochure]');
        const bName = root.querySelector('[data-brochure-partner]');
        const bOffer = root.querySelector('[data-brochure-offer]');
        const bPhone = root.querySelector('[data-brochure-phone]');
        const bQr = root.querySelector('[data-brochure-qr]');

        if (!partner || !dest) return;

        function refresh() {
            const built = buildRefPath(partner.value, campaign?.value, dest.value);
            if (refOut) refOut.textContent = built.refPath + ' → ' + built.landing;
            const scanUrl = 'https://knightlogics.com' + built.refPath;
            if (qrImg) {
                qrImg.src = qrUrl(scanUrl, 220);
                qrImg.alt = 'QR code for ' + built.refPath;
            }
            if (steps) {
                steps.innerHTML = [
                    ['1', 'QR scanned', built.refPath],
                    ['2', 'Landing opened', built.landing],
                    ['3', 'Form submitted', 'Partner credited in referral event log'],
                    ['4', 'Job marked paid', 'Stripe webhook updates payout status'],
                    ['5', 'Referral payable', 'Visible in referral dashboard']
                ].map(([n, label, detail]) =>
                    `<div class="referral-demo-step"><span class="referral-demo-step__n">${n}</span><div><strong>${label}</strong><span>${detail}</span></div></div>`
                ).join('');
            }
            if (brochure && bQr) {
                const name = bName?.value || partner.value || 'Your Partner Name';
                const offer = bOffer?.value || 'Free growth audit for referred businesses';
                const phone = bPhone?.value || '(813) 773-5553';
                brochure.querySelector('[data-brochure-name]').textContent = name;
                brochure.querySelector('[data-brochure-offer-text]').textContent = offer;
                brochure.querySelector('[data-brochure-phone-text]').textContent = phone;
                bQr.src = qrUrl(scanUrl, 140);
            }
        }

        [partner, campaign, dest, bName, bOffer, bPhone].forEach((el) => {
            if (el) el.addEventListener('input', refresh);
            if (el && el.tagName === 'SELECT') el.addEventListener('change', refresh);
        });
        refresh();
    }

    function init() {
        document.querySelectorAll('[data-referral-demo]').forEach(wireForm);
        document.querySelectorAll('[data-referral-demo-dest]').forEach((sel) => {
            if (sel.options.length > 1) return;
            ALLOWED_DEST.forEach((d) => {
                const opt = document.createElement('option');
                opt.value = d.value;
                opt.textContent = d.label;
                sel.appendChild(opt);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
