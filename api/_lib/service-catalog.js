'use strict';

const SERVICES = Object.freeze({
    ai_site_health_5: Object.freeze({
        sku: 'ai_site_health_5',
        name: 'AI Search + Website Health Audit',
        description: 'Outside-in review of up to five public pages with SEO, AI-search, accessibility, performance, schema, and security evidence.',
        amount: 3900,
        inputKeys: ['clientName', 'websiteUrl'],
        fulfillment: 'paid_external_audit',
        offerVersion: '2026-07-v1'
    }),
    agency_white_label_health_5: Object.freeze({
        sku: 'agency_white_label_health_5',
        name: 'White-Label AI Search + Website Health Audit',
        description: 'Agency-branded outside-in report for up to five public pages, including raw JSON evidence.',
        amount: 9900,
        inputKeys: ['clientName', 'websiteUrl', 'agencyName'],
        fulfillment: 'paid_external_audit',
        offerVersion: '2026-07-v1'
    }),
    local_opportunity_50: Object.freeze({
        sku: 'local_opportunity_50',
        name: '50-Prospect Local Opportunity Intelligence Pack',
        description: 'Fifty distinct public business records ranked by basic website opportunity signals.',
        amount: 3900,
        inputKeys: ['targetNiche', 'location', 'radiusMiles'],
        fulfillment: 'prospect_opportunity_pack',
        offerVersion: '2026-07-v2'
    })
});

module.exports = { SERVICES };
