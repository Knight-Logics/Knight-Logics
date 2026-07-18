'use strict';

const crypto = require('crypto');
const Stripe = require('stripe');
const { neon } = require('@neondatabase/serverless');

function sendJson(res, status, payload) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(payload));
}

function authorized(req) {
    const configured = process.env.AUTONOMOUS_ORDER_API_SECRET || process.env.AUTONOMOUS_WORKER_SECRET || '';
    const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!configured || !supplied) return false;
    const left = Buffer.from(configured); const right = Buffer.from(supplied);
    return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function readJson(req) {
    const chunks = [];
    for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const raw = Buffer.concat(chunks).toString('utf8');
    if (Buffer.byteLength(raw) > 4 * 1024 * 1024) throw new Error('Request is too large.');
    return raw ? JSON.parse(raw) : {};
}

async function ensureTable(sql) {
    await sql`CREATE TABLE IF NOT EXISTS autonomous_service_orders (
        id text PRIMARY KEY, sku text NOT NULL, fulfillment text NOT NULL, buyer_email text NOT NULL,
        inputs jsonb NOT NULL DEFAULT '{}'::jsonb, payment_intent_id text, amount_total integer NOT NULL DEFAULT 0,
        currency text NOT NULL DEFAULT 'usd', status text NOT NULL DEFAULT 'pending', attempts integer NOT NULL DEFAULT 0,
        lease_until timestamptz, next_attempt_at timestamptz NOT NULL DEFAULT now(), last_error text,
        result jsonb, completed_at timestamptz, refunded_at timestamptz, stripe_refund_id text,
        created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS autonomous_service_artifacts (
        order_id text PRIMARY KEY REFERENCES autonomous_service_orders(id) ON DELETE CASCADE,
        token_hash text NOT NULL, files jsonb NOT NULL, expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    )`;
}

module.exports = async function handler(req, res) {
    if (!authorized(req)) return sendJson(res, 401, { error: 'Unauthorized.' });
    const databaseUrl = process.env.KL_DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) return sendJson(res, 503, { error: 'Order database is unavailable.' });
    const sql = neon(databaseUrl); await ensureTable(sql);
    if (req.method === 'GET') {
        try {
            const rows = await sql`UPDATE autonomous_service_orders SET status='processing', attempts=attempts+1, lease_until=now()+interval '45 minutes', updated_at=now()
                WHERE id=(SELECT id FROM autonomous_service_orders WHERE ((status IN ('pending','failed') AND attempts<3 AND next_attempt_at<=now()) OR (status='processing' AND lease_until<now() AND attempts<3)) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING id,sku,fulfillment,buyer_email,inputs,attempts`;
            return sendJson(res, 200, { order: rows[0] || null });
        } catch (error) { console.error('[service-orders] Claim failed:', error && error.message); return sendJson(res, 500, { error: 'Could not claim an order.' }); }
    }
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' });
    let body;
    try { body = await readJson(req); } catch (error) { return sendJson(res, 400, { error: error.message }); }
    const action = typeof body.action === 'string' ? body.action : '';
    const orderId = typeof body.order_id === 'string' ? body.order_id.slice(0, 160) : '';
    if (!orderId) return sendJson(res, 400, { error: 'order_id is required.' });
    try {
        if (action === 'upload') {
            const files = body.files && typeof body.files === 'object' ? body.files : {};
            const allowedTypes = new Set(['application/pdf', 'application/json', 'text/csv', 'text/html']);
            const normalized = {};
            let totalBytes = 0;
            for (const [name, file] of Object.entries(files)) {
                if (!/^[A-Za-z0-9_.-]{1,100}$/.test(name) || !file || typeof file.base64 !== 'string' || !allowedTypes.has(file.contentType)) {
                    return sendJson(res, 400, { error: 'Artifact payload is invalid.' });
                }
                const bytes = Buffer.from(file.base64, 'base64');
                if (!bytes.length || bytes.toString('base64').replace(/=+$/, '') !== file.base64.replace(/=+$/, '')) return sendJson(res, 400, { error: 'Artifact encoding is invalid.' });
                totalBytes += bytes.length;
                normalized[name] = { contentType: file.contentType, base64: file.base64 };
            }
            if (!Object.keys(normalized).length || totalBytes > 3 * 1024 * 1024) return sendJson(res, 400, { error: 'Artifact bundle must contain 1 byte to 3 MB.' });
            const exists = await sql`SELECT id FROM autonomous_service_orders WHERE id=${orderId} AND status='processing' LIMIT 1`;
            if (!exists.length) return sendJson(res, 409, { error: 'Order is not processing.' });
            const token = crypto.randomBytes(24).toString('base64url');
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            await sql`INSERT INTO autonomous_service_artifacts(order_id,token_hash,files,expires_at)
                VALUES(${orderId},${tokenHash},${JSON.stringify(normalized)}::jsonb,now()+interval '30 days')
                ON CONFLICT(order_id) DO UPDATE SET token_hash=EXCLUDED.token_hash,files=EXCLUDED.files,expires_at=EXCLUDED.expires_at,updated_at=now()`;
            return sendJson(res, 200, { ok: true, token, expires_in_days: 30 });
        }
        if (action === 'complete') {
            const result = body.result && typeof body.result === 'object' ? body.result : {};
            const rows = await sql`UPDATE autonomous_service_orders SET status='completed', result=${JSON.stringify(result)}::jsonb, completed_at=now(), lease_until=null, last_error=null, updated_at=now() WHERE id=${orderId} AND status='processing' RETURNING id`;
            return sendJson(res, rows.length ? 200 : 409, { ok: rows.length > 0 });
        }
        if (action === 'fail') {
            const message = typeof body.error === 'string' ? body.error.slice(0, 800) : 'Unknown fulfillment failure.';
            const rows = await sql`UPDATE autonomous_service_orders SET status='failed', last_error=${message}, lease_until=null, next_attempt_at=now()+interval '15 minutes', updated_at=now() WHERE id=${orderId} AND status='processing' RETURNING attempts`;
            if (!rows.length) return sendJson(res, 409, { error: 'Order is not processing.' });
            return sendJson(res, 200, { ok: true, refund_required: Number(rows[0].attempts) >= 3 });
        }
        if (action === 'refund') {
            const rows = await sql`SELECT payment_intent_id,attempts,status,stripe_refund_id FROM autonomous_service_orders WHERE id=${orderId} LIMIT 1`;
            const order = rows[0];
            if (!order) return sendJson(res, 404, { error: 'Order was not found.' });
            if (order.stripe_refund_id) return sendJson(res, 200, { ok: true, already_refunded: true });
            if (order.status !== 'failed' || Number(order.attempts) < 3 || !order.payment_intent_id) return sendJson(res, 409, { error: 'Order is not eligible for automatic refund.' });
            const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
            if (!key) return sendJson(res, 503, { error: 'Stripe is unavailable.' });
            const stripe = new Stripe(key, { apiVersion: '2025-03-31.basil' });
            const refund = await stripe.refunds.create({ payment_intent: order.payment_intent_id, reason: 'requested_by_customer', metadata: { order_id: orderId, reason: 'automated_fulfillment_failed' } }, { idempotencyKey: `autonomous-service-refund-${orderId}` });
            await sql`UPDATE autonomous_service_orders SET status='refunded',refunded_at=now(),stripe_refund_id=${refund.id},updated_at=now() WHERE id=${orderId}`;
            return sendJson(res, 200, { ok: true, refunded: true });
        }
        return sendJson(res, 400, { error: 'Unknown action.' });
    } catch (error) { console.error('[service-orders] Update failed:', error && error.message); return sendJson(res, 500, { error: 'Order update failed.' }); }
};
