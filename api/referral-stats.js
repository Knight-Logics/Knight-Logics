/**
 * api/referral-stats.js
 * Vercel Serverless Function — returns referral CRM stats for the internal dashboard.
 *
 * GET /api/referral-stats?secret=YOUR_ADMIN_SECRET&partner=signshop-x&days=30
 *
 * Query params (all optional except secret):
 *   secret   — must match KL_ADMIN_SECRET env var
 *   partner  — filter to one partner slug (omit = all partners)
 *   offer    — filter to one offer code
 *   days     — lookback window in days (default 30, max 365)
 *
 * Returns:
 * {
 *   summary: { pageviews, form_submits, checkout_starts, unique_sessions, unique_partners },
 *   byPartner: [ { referral_partner, pageviews, form_submits, checkout_starts } ],
 *   byOffer:   [ { referral_offer, pageviews, form_submits, checkout_starts } ],
 *   recent:    [ last 20 events ],
 *   generatedAt: ISO string
 * }
 */

'use strict';

const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
    const json = (status, data) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    if (req.method !== 'GET') return json(405, { error: 'Method not allowed.' });

    /* Auth */
    const adminSecret = process.env.KL_ADMIN_SECRET;
    if (!adminSecret) return json(503, { error: 'Admin secret not configured.' });

    const params = new URLSearchParams(
        (req.url || '').includes('?') ? req.url.split('?')[1] : ''
    );
    if (params.get('secret') !== adminSecret) {
        return json(403, { error: 'Forbidden.' });
    }

    if (!process.env.KL_DATABASE_URL) {
        return json(503, { error: 'Database not configured.' });
    }

    const partner  = params.get('partner') || null;
    const offer    = params.get('offer') || null;
    const rawDays  = parseInt(params.get('days') || '30', 10);
    const days     = Math.min(Math.max(rawDays || 30, 1), 365);
    const since    = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    try {
        const sql = neon(process.env.KL_DATABASE_URL);

        /* Build optional WHERE clauses */
        const partnerFilter = partner ? sql`AND referral_partner = ${partner}` : sql``;
        const offerFilter   = offer   ? sql`AND referral_offer   = ${offer}`   : sql``;

        /* Summary counts */
        const [summary] = await sql`
            SELECT
                COUNT(*) FILTER (WHERE event_type = 'pageview')        AS pageviews,
                COUNT(*) FILTER (WHERE event_type = 'form_submit')     AS form_submits,
                COUNT(*) FILTER (WHERE event_type = 'checkout_start')  AS checkout_starts,
                COUNT(DISTINCT session_id)                              AS unique_sessions,
                COUNT(DISTINCT referral_partner)                        AS unique_partners
            FROM kl_referral_events
            WHERE created_at >= ${since}
            ${partnerFilter}
            ${offerFilter}
        `;

        /* By partner breakdown */
        const byPartner = await sql`
            SELECT
                referral_partner,
                COUNT(*) FILTER (WHERE event_type = 'pageview')        AS pageviews,
                COUNT(*) FILTER (WHERE event_type = 'form_submit')     AS form_submits,
                COUNT(*) FILTER (WHERE event_type = 'checkout_start')  AS checkout_starts,
                MIN(created_at)                                         AS first_seen,
                MAX(created_at)                                         AS last_seen
            FROM kl_referral_events
            WHERE created_at >= ${since}
              AND referral_partner IS NOT NULL
            ${offerFilter}
            GROUP BY referral_partner
            ORDER BY checkout_starts DESC, form_submits DESC, pageviews DESC
            LIMIT 50
        `;

        /* By offer breakdown */
        const byOffer = await sql`
            SELECT
                referral_offer,
                COUNT(*) FILTER (WHERE event_type = 'pageview')        AS pageviews,
                COUNT(*) FILTER (WHERE event_type = 'form_submit')     AS form_submits,
                COUNT(*) FILTER (WHERE event_type = 'checkout_start')  AS checkout_starts
            FROM kl_referral_events
            WHERE created_at >= ${since}
              AND referral_offer IS NOT NULL
            ${partnerFilter}
            GROUP BY referral_offer
            ORDER BY checkout_starts DESC, form_submits DESC
            LIMIT 20
        `;

        /* Recent events (no PII exposure — just metadata) */
        const recent = await sql`
            SELECT
                id, event_type, referral_partner, referral_offer,
                utm_medium, utm_campaign, package_name, amount_cents,
                page_path, created_at
            FROM kl_referral_events
            WHERE created_at >= ${since}
            ${partnerFilter}
            ${offerFilter}
            ORDER BY created_at DESC
            LIMIT 20
        `;

        return json(200, {
            summary,
            byPartner,
            byOffer,
            recent,
            filter: { partner, offer, days, since },
            generatedAt: new Date().toISOString()
        });
    } catch (err) {
        console.error('[referral-stats] DB error:', err && err.message);
        return json(500, { error: 'Failed to query referral data.' });
    }
};
