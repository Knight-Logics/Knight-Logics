/**
 * api/referral-event.js
 * Vercel Serverless Function — logs a referral attribution event to Neon Postgres.
 *
 * POST /api/referral-event
 * Body (JSON):
 *   {
 *     eventType:        string,   // 'pageview' | 'form_submit' | 'checkout_start'
 *     referralPartner:  string,   // ?ref= value
 *     referralOffer:    string,   // ?offer= value
 *     utmMedium:        string,
 *     utmCampaign:      string,
 *     firstUrl:         string,
 *     pagePath:         string,
 *     contactEmail:     string,   // optional — from form events
 *     contactName:      string,   // optional
 *     packageName:      string,   // optional — from checkout events
 *     amountCents:      number,   // optional
 *     sessionId:        string,   // client random ID, for dedup
 *   }
 *
 * If KL_DATABASE_URL is not set, the function returns 200 with { skipped: true }
 * so the site never breaks before the DB is wired up.
 */

'use strict';

const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

const ALLOWED_EVENT_TYPES = new Set(['pageview', 'form_submit', 'checkout_start']);

const ALLOWED_ORIGINS = new Set([
    'https://knightlogics.com',
    'https://www.knightlogics.com'
]);

function normStr(val, maxLen) {
    if (!val || typeof val !== 'string') return null;
    return val.replace(/[<>"']/g, '').trim().slice(0, maxLen) || null;
}

function normInt(val) {
    const n = parseInt(val, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
}

function hashIp(ip) {
    if (!ip) return null;
    return crypto.createHash('sha256').update(ip + (process.env.KL_IP_SALT || 'kl2026')).digest('hex').slice(0, 16);
}

function getCorsHeaders(origin) {
    const allowed = ALLOWED_ORIGINS.has(origin) ? origin : null;
    return {
        'Access-Control-Allow-Origin': allowed || 'https://knightlogics.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    };
}

module.exports = async function handler(req, res) {
    const origin = req.headers.origin || '';
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        return res.end();
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method not allowed.' }));
    }

    /* Graceful no-op if DB not yet configured */
    if (!process.env.KL_DATABASE_URL) {
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ skipped: true, reason: 'DB not configured.' }));
    }

    let body;
    try {
        body = typeof req.body === 'object' && req.body !== null
            ? req.body
            : JSON.parse(req.body || '{}');
    } catch (_) {
        body = {};
    }

    const eventType = normStr(body.eventType, 40);
    if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) {
        res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid event type.' }));
    }

    /* Require at least one attribution signal */
    const referralPartner = normStr(body.referralPartner, 80);
    const referralOffer   = normStr(body.referralOffer,   80);
    if (!referralPartner && !referralOffer) {
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ skipped: true, reason: 'No attribution signal.' }));
    }

    const utmMedium   = normStr(body.utmMedium,   80);
    const utmCampaign = normStr(body.utmCampaign, 80);
    const firstUrl    = normStr(body.firstUrl,    300);
    const pagePath    = normStr(body.pagePath,    300);
    const email       = normStr(body.contactEmail, 160);
    const name        = normStr(body.contactName,  120);
    const pkgName     = normStr(body.packageName,  120);
    const amountCents = normInt(body.amountCents);
    const sessionId   = normStr(body.sessionId,    64);

    const ip = req.headers['x-forwarded-for']
        ? String(req.headers['x-forwarded-for']).split(',')[0].trim()
        : (req.socket && req.socket.remoteAddress) || null;
    const ipHash = hashIp(ip);

    const rawUa = req.headers['user-agent'] || '';
    const uaShort = rawUa.slice(0, 120) || null;

    try {
        const sql = neon(process.env.KL_DATABASE_URL);

        await sql`
            INSERT INTO kl_referral_events
                (event_type, referral_partner, referral_offer, utm_medium, utm_campaign,
                 first_url, page_path, contact_email, contact_name, package_name,
                 amount_cents, session_id, ip_hash, user_agent_short)
            VALUES
                (${eventType}, ${referralPartner}, ${referralOffer}, ${utmMedium}, ${utmCampaign},
                 ${firstUrl}, ${pagePath}, ${email}, ${name}, ${pkgName},
                 ${amountCents}, ${sessionId}, ${ipHash}, ${uaShort})
        `;

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true }));
    } catch (err) {
        console.error('[referral-event] DB error:', err && err.message);
        /* Return 200 to avoid breaking client-side code */
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ skipped: true, reason: 'DB write failed.' }));
    }
};
