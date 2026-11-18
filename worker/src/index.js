import './env-lock.js';
import checkoutHandler from '../../api/create-checkout-session.js';
import payInvoiceHandler from '../../api/pay-invoice.js';
import autovidHandler from '../../api/autovid-license.js';
import webhookHandler from '../../api/stripe-webhook.js';
import referralEventHandler from '../../api/referral-event.js';
import referralPartnersHandler from '../../api/referral-partners.js';
import referralStatsHandler from '../../api/referral-stats.js';
import referralVerifyHandler from '../../api/referral-verify.js';
import referralAdminHandler from '../../api/referral-admin.js';
import { invokeHandler } from './adapter.js';

const ENV_KEYS = [
    'STRIPE_SECRET_KEY',
    'STRIPE_API_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'KL_DATABASE_URL',
    'DATABASE_URL',
    'FORMSPREE_ENDPOINT',
    'CHECKOUT_ALLOWED_ORIGINS',
    'PIXELFORGE_PRO_LIFETIME_PRICE_CENTS',
    'AUTONOMOUS_ORDER_API_SECRET',
    'AUTONOMOUS_WORKER_SECRET',
    'KL_ADMIN_SECRET',
    'KL_OWNER_SECRET',
    'KL_VERIFY_SALT'
];

const HANDLERS = new Map([
    ['/api/create-checkout-session', checkoutHandler],
    ['/api/service-checkout', checkoutHandler],
    ['/api/service-orders', checkoutHandler],
    ['/api/service-delivery', checkoutHandler],
    ['/api/service-status', checkoutHandler],
    ['/api/pay-invoice', payInvoiceHandler],
    ['/api/stripe-webhook', webhookHandler],
    ['/api/autovid-license', autovidHandler],
    ['/api/referral-event', referralEventHandler],
    ['/api/referral-partners', referralPartnersHandler],
    ['/api/referral-stats', referralStatsHandler],
    ['/api/referral-verify', referralVerifyHandler],
    ['/api/referral-admin', referralAdminHandler]
]);

const KNIGHT_ACCOUNT_LICENSE_PATHS = new Set([
    '/api/licenses/health',
    '/api/licenses/create-checkout-session',
    '/api/licenses/confirm-session',
    '/api/licenses/restore',
    '/api/licenses/create-portal-session',
    '/api/licenses/stripe-webhook'
]);

export function forwardsToKnightAccount(path) {
    if (path === '/api/pixelforge-license') return true;
    if (path === '/api/knight-account' || path.startsWith('/api/knight-account/')) return true;
    return KNIGHT_ACCOUNT_LICENSE_PATHS.has(path);
}

const SERVICE_ROUTE = {
    '/api/service-checkout': 'checkout',
    '/api/service-orders': 'orders',
    '/api/service-delivery': 'delivery',
    '/api/service-status': 'status'
};

export function applyEnv(env) {
    const source = env || {};
    for (const key of ENV_KEYS) {
        if (typeof source[key] === 'string') process.env[key] = source[key];
        else delete process.env[key];
    }
    process.env.VERCEL_ENV = 'production';
    // Wrangler replaces process.env.NODE_ENV at build time
    // ("development" in wrangler dev, "production" on deploy). Do not assign it.
}

function knightAccountBinding(env) {
    const binding = env && env.KNIGHT_ACCOUNT;
    return binding && typeof binding.fetch === 'function' ? binding : null;
}

function healthResponse(env) {
    const stripe = Boolean(env && (env.STRIPE_SECRET_KEY || env.STRIPE_API_KEY));
    const database = Boolean(env && (env.KL_DATABASE_URL || env.DATABASE_URL));
    return Response.json({
        ok: true,
        service: 'knightlogics-api',
        checkout: stripe,
        database,
        knightAccount: Boolean(knightAccountBinding(env))
    }, {
        headers: { 'cache-control': 'no-store' }
    });
}

async function forwardToKnightAccount(request, env) {
    const binding = knightAccountBinding(env);
    if (!binding) {
        return Response.json({
            ok: false,
            error: 'Knight Account service is not bound.'
        }, {
            status: 503,
            headers: { 'cache-control': 'no-store' }
        });
    }
    return binding.fetch(request);
}

function normalizePath(pathname) {
    const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    return trimmed.toLowerCase();
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = normalizePath(url.pathname);
        if (path === '/api/health') {
            if (request.method !== 'GET' && request.method !== 'HEAD') {
                return Response.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
            }
            if (request.method === 'HEAD') return new Response(null, { status: 200, headers: { 'cache-control': 'no-store' } });
            return healthResponse(env);
        }

        if (forwardsToKnightAccount(path)) {
            try {
                return await forwardToKnightAccount(request, env);
            } catch (error) {
                console.log(JSON.stringify({
                    level: 'error',
                    path,
                    message: error && error.message ? error.message : 'knight account forward failed'
                }));
                return Response.json({ ok: false, error: 'Knight Account request failed.' }, {
                    status: 502,
                    headers: { 'cache-control': 'no-store' }
                });
            }
        }

        const handler = HANDLERS.get(path);
        if (!handler) {
            return Response.json({ error: 'Not found.' }, {
                status: 404,
                headers: { 'cache-control': 'no-store' }
            });
        }

        const serviceRoute = SERVICE_ROUTE[path];
        if (serviceRoute && !url.searchParams.get('serviceRoute')) {
            url.searchParams.set('serviceRoute', serviceRoute);
        }

        try {
            applyEnv(env);
            return await invokeHandler(handler, request, url);
        } catch (error) {
            console.log(JSON.stringify({
                level: 'error',
                path,
                message: error && error.message ? error.message : 'request failed'
            }));
            return Response.json({ error: 'Request failed.' }, {
                status: 500,
                headers: { 'cache-control': 'no-store' }
            });
        }
    }
};
