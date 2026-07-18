'use strict';

const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');

function send(res, status, type, body) {
    res.statusCode = status;
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.end(body);
}

function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') return send(res, 405, 'application/json', JSON.stringify({ error: 'Method not allowed.' }));
    let query = req.query && typeof req.query === 'object' ? req.query : {};
    if (typeof req.url === 'string') {
        try {
            const params = new URL(req.url, 'http://localhost').searchParams;
            query = { ...Object.fromEntries(params), ...query };
        } catch (_) {}
    }
    const orderId = typeof query.order === 'string' ? query.order.slice(0, 160) : '';
    const token = typeof query.token === 'string' ? query.token.slice(0, 100) : '';
    const requestedFile = typeof query.file === 'string' ? query.file.slice(0, 100) : '';
    if (!orderId || !token) return send(res, 400, 'text/plain; charset=utf-8', 'The delivery link is incomplete.');
    const databaseUrl = process.env.KL_DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) return send(res, 503, 'text/plain; charset=utf-8', 'Delivery is temporarily unavailable.');
    try {
        const sql = neon(databaseUrl);
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const rows = await sql`SELECT files,expires_at FROM autonomous_service_artifacts WHERE order_id=${orderId} AND token_hash=${tokenHash} AND expires_at>now() LIMIT 1`;
        const row = rows[0];
        if (!row) return send(res, 404, 'text/plain; charset=utf-8', 'This delivery link is invalid or has expired.');
        const files = row.files || {};
        if (requestedFile) {
            const file = files[requestedFile];
            if (!file || typeof file.base64 !== 'string') return send(res, 404, 'text/plain; charset=utf-8', 'File not found.');
            res.setHeader('Content-Disposition', `attachment; filename="${requestedFile.replace(/[^A-Za-z0-9_.-]/g, '_')}"`);
            return send(res, 200, file.contentType || 'application/octet-stream', Buffer.from(file.base64, 'base64'));
        }
        const links = Object.keys(files).map((name) => `<li><a href="/api/service-delivery?order=${encodeURIComponent(orderId)}&token=${encodeURIComponent(token)}&file=${encodeURIComponent(name)}">${escapeHtml(name)}</a></li>`).join('');
        return send(res, 200, 'text/html; charset=utf-8', `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Knight Logics files</title><style>body{font:16px/1.5 system-ui;max-width:720px;margin:4rem auto;padding:1rem;color:#13201b}a{color:#087a4c}li{margin:.8rem 0}</style></head><body><h1>Your files are ready</h1><p>This private link expires ${escapeHtml(new Date(row.expires_at).toLocaleDateString())}.</p><ul>${links}</ul></body></html>`);
    } catch (error) {
        console.error('[service-delivery] Failed:', error && error.message);
        return send(res, 500, 'text/plain; charset=utf-8', 'Delivery could not be loaded.');
    }
};
