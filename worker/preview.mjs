/**
 * Local preview: static Pages files plus the Worker on /api/*.
 * Stripe calls are mocked unless PREVIEW_LIVE_STRIPE=1.
 * This file is not a deploy.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from './src/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const liveStripe = process.env.PREVIEW_LIVE_STRIPE === '1';
const originalFetch = globalThis.fetch.bind(globalThis);

if (!liveStripe) {
    globalThis.fetch = async (input, init = {}) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        if (!String(url).startsWith('https://api.stripe.com/')) return originalFetch(input, init);
        const rawBody = init.body;
        const bodyText = typeof rawBody === 'string' ? rawBody : rawBody == null ? '' : await new Response(rawBody).text();
        const params = new URLSearchParams(bodyText);
        const amount = params.get('line_items[0][price_data][unit_amount]') || '0';
        return new Response(JSON.stringify({
            id: 'cs_test_preview',
            object: 'checkout.session',
            url: `http://127.0.0.1:${port}/preview-checkout?amount=${amount}`,
            status: 'open',
            payment_status: 'unpaid',
            mode: 'payment'
        }), { status: 200, headers: { 'content-type': 'application/json' } });
    };
}

const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml',
    '.woff2': 'font/woff2'
};

function envForRequest() {
    return {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_preview',
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
        KL_DATABASE_URL: process.env.KL_DATABASE_URL || '',
        NODE_ENV: 'development'
    };
}

const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
        if (url.pathname === '/preview-checkout') {
            const amount = Number(url.searchParams.get('amount') || 0);
            const dollars = (amount / 100).toFixed(2);
            res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            res.end(`<!DOCTYPE html><title>Preview checkout</title><main><h1>Stripe test checkout</h1><p>Mocked session amount: $${dollars}</p></main>`);
            return;
        }
        if (url.pathname.startsWith('/api/')) {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const body = Buffer.concat(chunks);
            const headers = new Headers();
            for (const [key, value] of Object.entries(req.headers)) {
                if (value == null) continue;
                headers.set(key, Array.isArray(value) ? value.join(', ') : value);
            }
            const request = new Request(url, { method: req.method, headers, body: body.length ? body : undefined });
            const response = await worker.fetch(request, envForRequest());
            const responseBody = Buffer.from(await response.arrayBuffer());
            const outHeaders = {};
            response.headers.forEach((value, key) => { outHeaders[key] = value; });
            res.writeHead(response.status, outHeaders);
            res.end(responseBody);
            return;
        }

        let relative = decodeURIComponent(url.pathname);
        if (relative.endsWith('/')) relative += 'index.html';
        const filePath = path.normalize(path.join(root, relative));
        if (!filePath.startsWith(root)) {
            res.writeHead(403).end('Forbidden');
            return;
        }
        const data = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'content-type': types[ext] || 'application/octet-stream' });
        res.end(data);
    } catch (error) {
        if (error && error.code === 'ENOENT') {
            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
            res.end('Not found');
            return;
        }
        res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
        res.end(error && error.message ? error.message : 'Preview failed');
    }
});

server.listen(port, '127.0.0.1', () => {
    console.log(`preview http://127.0.0.1:${port}/website-health-audit.html`);
});
