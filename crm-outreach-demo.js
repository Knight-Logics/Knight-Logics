/**
 * Sanitized CRM outreach pipeline demo — static sample lead walkthrough
 */
(function initCrmOutreachDemo() {
    const STEPS = [
        { icon: 'fa-building', title: 'Directory match', detail: 'Sunbiz / DBPR / public listing identifies company' },
        { icon: 'fa-globe', title: 'Website discovered', detail: 'Primary domain and contact paths found' },
        { icon: 'fa-envelope', title: 'Email validated', detail: 'Role-based address checked before send' },
        { icon: 'fa-chart-line', title: 'Fit scored', detail: 'Trade, geography, and service match tiered A/B' },
        { icon: 'fa-tag', title: 'Brand assigned', detail: 'Routed to correct outreach lane (KL / KG / ST / FW)' },
        { icon: 'fa-paper-plane', title: 'Message queued', detail: 'Daily cap respected — preview before send' },
        { icon: 'fa-reply', title: 'Reply routed', detail: 'CRM reply view — not personal Gmail clutter' }
    ];

    const SAMPLE_LEAD = {
        company: 'Bay Area Screen Enclosures LLC',
        city: 'Clearwater, FL',
        trade: 'Screen enclosure contractor',
        tier: 'Tier A',
        brand: 'Screen Team lane',
        email: 'info@████████.com',
        status: 'Queued for send window · 2:00 PM'
    };

    const METRICS = [
        { label: 'Leads discovered today', value: '24' },
        { label: 'Sendable by brand', value: 'KL 6 · KG 9 · ST 5 · FW 4' },
        { label: 'Tier A / Tier B', value: '11 / 13' },
        { label: 'Scheduled today', value: '18' },
        { label: 'Replies needing review', value: '3' },
        { label: 'Hard bounces (7d)', value: '0.8%' },
        { label: 'Suppressed', value: '42' },
        { label: 'Campaigns paused', value: '0' }
    ];

    function renderDashboard(root) {
        const metricsHtml = METRICS.map((m) =>
            `<div class="crm-demo-metric"><span class="crm-demo-metric__v">${m.value}</span><span class="crm-demo-metric__l">${m.label}</span></div>`
        ).join('');
        const stepsHtml = STEPS.map((s, i) =>
            `<li class="crm-demo-step${i === 0 ? ' is-active' : ''}" data-crm-step="${i}">
                <span class="crm-demo-step__icon"><i class="fas ${s.icon}"></i></span>
                <div><strong>${s.title}</strong><span>${s.detail}</span></div>
            </li>`
        ).join('');

        root.innerHTML = `
            <div class="crm-demo-grid">
                <div class="crm-demo-panel crm-demo-panel--metrics">
                    <h3>Outreach queue snapshot</h3>
                    <p class="crm-demo-disclaimer">Sanitized live-style metrics — sample data for demonstration</p>
                    <div class="crm-demo-metrics">${metricsHtml}</div>
                </div>
                <div class="crm-demo-panel crm-demo-panel--lead">
                    <h3>Sample lead path</h3>
                    <dl class="crm-demo-lead">
                        <div><dt>Company</dt><dd>${SAMPLE_LEAD.company}</dd></div>
                        <div><dt>Market</dt><dd>${SAMPLE_LEAD.city}</dd></div>
                        <div><dt>Trade</dt><dd>${SAMPLE_LEAD.trade}</dd></div>
                        <div><dt>Fit</dt><dd>${SAMPLE_LEAD.tier}</dd></div>
                        <div><dt>Lane</dt><dd>${SAMPLE_LEAD.brand}</dd></div>
                        <div><dt>Contact</dt><dd>${SAMPLE_LEAD.email}</dd></div>
                        <div><dt>Status</dt><dd>${SAMPLE_LEAD.status}</dd></div>
                    </dl>
                    <ol class="crm-demo-pipeline">${stepsHtml}</ol>
                    <button type="button" class="btn-secondary crm-demo-advance" data-crm-advance>Advance sample lead</button>
                </div>
            </div>`;

        const steps = root.querySelectorAll('[data-crm-step]');
        let idx = 0;
        const btn = root.querySelector('[data-crm-advance]');
        if (btn) {
            btn.addEventListener('click', () => {
                steps.forEach((el) => el.classList.remove('is-active'));
                idx = (idx + 1) % steps.length;
                steps[idx].classList.add('is-active');
            });
        }
    }

    function init() {
        document.querySelectorAll('[data-crm-outreach-demo]').forEach(renderDashboard);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
