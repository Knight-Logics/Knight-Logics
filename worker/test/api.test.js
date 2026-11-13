import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import worker from '../src/index.js';

process.env.NODE_ENV = 'test';

const require = createRequire(import.meta.url);
const checkoutUi = require('../../js/instant-package-checkout.js');

const MACHINE_ID = 'a'.repeat(64);
const calls = [];

function stripeResponse(payload) {
    return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'content-type': 'application/json' }
    });
}

function installStripeMock() {
    const original = globalThis.fetch;
    globalThis.fetch = async (input, init = {}) => {
        const url = typeof input === 'string'
            ? input
            : input instanceof URL
                ? input.href
                : input.url;
        if (!String(url).startsWith('https://api.stripe.com/')) {
            return original(input, init);
        }
        const rawBody = init.body;
        const bodyText = typeof rawBody === 'string'
            ? rawBody
            : rawBody == null
                ? ''
                : await new Response(rawBody).text();
        const params = new URLSearchParams(bodyText);
        calls.push({
            url: String(url),
            amount: params.get('line_items[0][price_data][unit_amount]'),
            name: params.get('line_items[0][price_data][product_data][name]'),
            mode: params.get('mode')
        });
        return stripeResponse({
            id: 'cs_test_mock_1',
            object: 'checkout.session',
            url: 'https://checkout.stripe.com/c/pay/cs_test_mock_1',
            status: 'open',
            payment_status: 'unpaid',
            mode: params.get('mode') || 'payment'
        });
    };
    return () => {
        globalThis.fetch = original;
    };
}

function request(pathname, { method = 'GET', body, origin = 'http://127.0.0.1:4173', headers = {} } = {}) {
    return new Request(`http://127.0.0.1:8787${pathname}`, {
        method,
        headers: {
            origin,
            accept: 'application/json',
            ...(body ? { 'content-type': 'application/json' } : {}),
            ...headers
        },
        body: body ? JSON.stringify(body) : undefined
    });
}

test('health reports checkout only when a Stripe secret is configured', async () => {
    const down = await worker.fetch(request('/api/health'), {});
    assert.equal(down.status, 200);
    const downBody = await down.json();
    assert.equal(downBody.ok, true);
    assert.equal(downBody.checkout, false);
    assert.equal(downBody.database, false);

    const up = await worker.fetch(request('/api/health'), {
        STRIPE_SECRET_KEY: 'sk_test_mock',
        KL_DATABASE_URL: 'postgres://example'
    });
    const upBody = await up.json();
    assert.equal(upBody.checkout, true);
    assert.equal(upBody.database, true);
    assert.equal(upBody.knightAccount, false);
    assert.equal(upBody.service, 'knightlogics-api');
});

test('unknown API routes stay 404', async () => {
    const response = await worker.fetch(request('/api/not-a-route'), {});
    assert.equal(response.status, 404);
});

test('audit checkout keeps the catalog amounts and returns a Stripe URL', async () => {
    calls.length = 0;
    const restore = installStripeMock();
    try {
        const health = await worker.fetch(request('/api/service-checkout', {
            method: 'POST',
            body: {
                sku: 'ai_site_health_5',
                buyerEmail: 'buyer@example.com',
                clientName: 'Example Co',
                websiteUrl: 'https://example.com',
                acceptedTerms: true
            }
        }), { STRIPE_SECRET_KEY: 'sk_test_mock', NODE_ENV: 'development' });
        const payload = await health.json();
        assert.equal(health.status, 200, JSON.stringify(payload));
        assert.equal(payload.url, 'https://checkout.stripe.com/c/pay/cs_test_mock_1');
        assert.equal(calls.at(-1).amount, '3900');
        assert.match(calls.at(-1).name, /Website Health Audit/);

        const full = await worker.fetch(request('/api/service-checkout', {
            method: 'POST',
            body: {
                sku: 'full_access_gsc_audit',
                buyerEmail: 'buyer@example.com',
                clientName: 'Example Co',
                websiteUrl: 'https://example.com',
                gscProperty: 'example.com',
                acceptedTerms: true
            }
        }), { STRIPE_SECRET_KEY: 'sk_test_mock', NODE_ENV: 'development' });
        const fullBody = await full.json();
        assert.equal(full.status, 200, JSON.stringify(fullBody));
        assert.equal(calls.at(-1).amount, '29900');
    } finally {
        restore();
    }
});

test('invoice pay uses the submitted amount', async () => {
    calls.length = 0;
    const restore = installStripeMock();
    try {
        const response = await worker.fetch(request('/api/pay-invoice', {
            method: 'POST',
            body: {
                invoiceNumber: 'KL-2026-001',
                clientName: 'Example Client',
                clientEmail: 'buyer@example.com',
                amountCents: 2500
            }
        }), { STRIPE_SECRET_KEY: 'sk_test_mock', NODE_ENV: 'development' });
        const payload = await response.json();
        assert.equal(response.status, 200, JSON.stringify(payload));
        assert.equal(payload.url, 'https://checkout.stripe.com/c/pay/cs_test_mock_1');
        assert.equal(calls.at(-1).amount, '2500');
        assert.equal(calls.at(-1).mode, 'payment');
    } finally {
        restore();
    }
});

test('Auto Vid stays on the Neon handler and is not forwarded', async () => {
    const body = { action: 'status', machine_id: MACHINE_ID };
    const forwarded = [];
    const env = {
        STRIPE_SECRET_KEY: 'sk_test_mock',
        KNIGHT_ACCOUNT: {
            async fetch(incoming) {
                forwarded.push(new URL(incoming.url).pathname);
                return new Response('{}', { status: 200 });
            }
        }
    };
    const autovid = await worker.fetch(request('/api/autovid-license', { method: 'POST', body, origin: '' }), env);
    const siteWebhook = await worker.fetch(request('/api/stripe-webhook', { method: 'POST', body: { type: 'checkout.session.completed' }, origin: '' }), env);
    assert.equal(autovid.status, 503);
    assert.match((await autovid.json()).error, /database/i);
    assert.equal(siteWebhook.status, 503);
    assert.deepEqual(forwarded, []);
});

test('Knight Account paths are forwarded and nothing else is', async () => {
    const seen = [];
    const env = {
        KNIGHT_ACCOUNT: {
            async fetch(incoming) {
                const url = new URL(incoming.url);
                seen.push({
                    method: incoming.method,
                    path: url.pathname,
                    body: incoming.method === 'GET' ? '' : await incoming.text()
                });
                return Response.json({ ok: true, service: 'knight-account' }, { status: 200 });
            }
        }
    };
    const paths = [
        ['POST', '/api/knight-account', { action: 'status' }],
        ['POST', '/api/knight-account/stripe-webhook', { type: 'checkout.session.completed' }],
        ['POST', '/api/pixelforge-license', { action: 'register_or_login', email: 'buyer@example.com' }],
        ['GET', '/api/licenses/health', null],
        ['POST', '/api/licenses/create-checkout-session', { plan: 'annual' }],
        ['POST', '/api/licenses/confirm-session', { session_id: 'cs_test_1' }],
        ['POST', '/api/licenses/restore', { email: 'buyer@example.com' }],
        ['POST', '/api/licenses/create-portal-session', { email: 'buyer@example.com' }],
        ['POST', '/api/licenses/stripe-webhook', { type: 'checkout.session.completed' }]
    ];
    for (const [method, path, body] of paths) {
        const response = await worker.fetch(request(path, { method, body: body || undefined }), env);
        const payload = await response.json();
        assert.equal(response.status, 200, path);
        assert.equal(payload.service, 'knight-account');
    }
    assert.deepEqual(seen.map((call) => `${call.method} ${call.path}`), [
        'POST /api/knight-account',
        'POST /api/knight-account/stripe-webhook',
        'POST /api/pixelforge-license',
        'GET /api/licenses/health',
        'POST /api/licenses/create-checkout-session',
        'POST /api/licenses/confirm-session',
        'POST /api/licenses/restore',
        'POST /api/licenses/create-portal-session',
        'POST /api/licenses/stripe-webhook'
    ]);
    assert.equal(JSON.parse(seen[2].body).action, 'register_or_login');

    const missing = await worker.fetch(request('/api/pixelforge-license', {
        method: 'POST',
        body: { action: 'status' }
    }), {});
    assert.equal(missing.status, 503);
    assert.match((await missing.json()).error, /not bound/i);

    const other = await worker.fetch(request('/api/licenses/other', { method: 'POST', body: {} }), env);
    assert.equal(other.status, 404);
    const health = await worker.fetch(request('/api/health'), env);
    assert.equal((await health.json()).knightAccount, true);
});

test('webhook refuses to run until Stripe and the database are configured', async () => {
    const response = await worker.fetch(request('/api/stripe-webhook', {
        method: 'POST',
        body: { type: 'checkout.session.completed' }
    }), { STRIPE_SECRET_KEY: 'sk_test_mock', NODE_ENV: 'development' });
    const payload = await response.json();
    assert.equal(response.status, 503);
    assert.match(payload.error, /not configured/i);
});

test('buy links stay on contact copy until health says checkout is ready', async () => {
    assert.equal(checkoutUi.checkoutReady({ ok: true, checkout: false }), false);
    assert.equal(checkoutUi.checkoutReady({ ok: true, checkout: true }), true);
    const anchor = {
        attrs: { href: '/contact.html?package=ai_site_health_5' },
        textContent: 'Contact to Get Started',
        getAttribute(name) { return this.attrs[name] || null; },
        setAttribute(name, value) { this.attrs[name] = value; }
    };
    const doc = {
        querySelectorAll() { return [anchor]; }
    };
    checkoutUi.upgradeBuyLinks(doc);
    assert.equal(anchor.getAttribute('data-sku'), 'ai_site_health_5');
    assert.equal(anchor.textContent, 'Buy now — $39');
    assert.equal(await checkoutUi.probeCheckout(async () => new Response('no', { status: 404 })), false);
});
