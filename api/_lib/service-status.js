'use strict';

const { neon } = require('@neondatabase/serverless');

function sendJson(res, status, payload) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.end(JSON.stringify(payload));
}

function sessionIdFrom(req) {
    let query = req.query && typeof req.query === 'object' ? req.query : {};
    if (typeof req.url === 'string') {
        try {
            const params = new URL(req.url, 'http://localhost').searchParams;
            query = { ...Object.fromEntries(params), ...query };
        } catch (_) {}
    }
    const raw = typeof query.session_id === 'string' ? query.session_id : (typeof query.sessionId === 'string' ? query.sessionId : '');
    return raw.trim().slice(0, 200);
}

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed.' });
    const sessionId = sessionIdFrom(req);
    if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
        return sendJson(res, 400, { error: 'A valid Stripe checkout session_id is required.' });
    }
    const databaseUrl = process.env.KL_DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) return sendJson(res, 503, { error: 'Order status is temporarily unavailable.' });
    try {
        const sql = neon(databaseUrl);
        const rows = await sql`
            SELECT id, sku, fulfillment, status, attempts, last_error, result, completed_at, refunded_at, created_at, updated_at
            FROM autonomous_service_orders
            WHERE id = ${sessionId}
            LIMIT 1
        `;
        const order = rows[0];
        if (!order) {
            return sendJson(res, 200, {
                ok: true,
                session_id: sessionId,
                status: 'awaiting_payment_or_webhook',
                buyer_message: 'Payment may still be confirming. This page refreshes automatically.',
                delivery_ready: false
            });
        }
        const status = String(order.status || 'pending');
        const messages = {
            pending: 'Payment received. Your order is queued for automated fulfillment.',
            awaiting_access: 'Payment received. Add audits@knightlogics.com as a Full user on your Search Console property. We poll for access, then run the audit. If access is not granted within 14 days, you receive an automatic refund.',
            processing: 'Generating your deliverable and running quality checks.',
            completed: 'Your files are ready. Check your email for the private 30-day download link.',
            failed: 'A quality check failed. The system will retry automatically (up to 3 attempts).',
            refunded: 'An automatic refund was issued to your original payment method (fulfillment could not complete, or Search Console access was not granted within 14 days).'
        };
        return sendJson(res, 200, {
            ok: true,
            session_id: sessionId,
            sku: order.sku,
            fulfillment: order.fulfillment,
            status,
            attempts: Number(order.attempts) || 0,
            delivery_ready: status === 'completed',
            refunded: status === 'refunded',
            buyer_message: messages[status] || 'Order received.',
            access_instructions: status === 'awaiting_access'
                ? 'In Google Search Console → Settings → Users and permissions, add audits@knightlogics.com with Full permission on the property you ordered. Keep this page open; status updates automatically when access appears.'
                : null,
            last_error: status === 'failed' || status === 'refunded' ? (order.last_error || null) : null,
            result: status === 'completed' ? (order.result || null) : null,
            completed_at: order.completed_at || null,
            refunded_at: order.refunded_at || null,
            updated_at: order.updated_at || null
        });
    } catch (error) {
        console.error('[service-status] Failed:', error && error.message);
        return sendJson(res, 500, { error: 'Order status could not be loaded.' });
    }
};
