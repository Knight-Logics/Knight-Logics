'use strict';

const crypto = require('crypto');
const Stripe = require('stripe');
const { neon } = require('@neondatabase/serverless');

const FREE_LIMIT = 20;
const MAX_JSON_BODY_BYTES = 16 * 1024;
const VALID_ACTIONS = new Set(['status', 'consume', 'create_checkout', 'confirm_session', 'activate_license']);
const LICENSE_PLANS = {
    credits_5: {
        label: '$5 - 5 compile credits',
        mode: 'payment',
        credits: 5,
        amount: 500,
        description: 'Five Auto Vid Compiler compile credits.'
    },
    credits_12: {
        label: '$10 - 12 compile credits',
        mode: 'payment',
        credits: 12,
        amount: 1000,
        description: 'Twelve Auto Vid Compiler compile credits.'
    },
    monthly_unlimited: {
        label: '$10/mo - unlimited compiles',
        mode: 'subscription',
        credits: null,
        amount: 1000,
        description: 'Unlimited Auto Vid Compiler compiles while the subscription is active.'
    }
};
const ALLOWED_ORIGINS = new Set([
    'https://knightlogics.com',
    'https://www.knightlogics.com'
]);

function sendJson(res, statusCode, payload, origin) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS.has(origin) ? origin : '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.end(JSON.stringify(payload));
}

async function readJson(req) {
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        return req.body;
    }
    if (typeof req.body === 'string') {
        return req.body ? JSON.parse(req.body) : {};
    }
    if (Buffer.isBuffer(req.rawBody)) {
        const raw = req.rawBody.toString('utf8');
        return raw ? JSON.parse(raw) : {};
    }
    if (typeof req.rawBody === 'string') {
        return req.rawBody ? JSON.parse(req.rawBody) : {};
    }

    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        total += buffer.length;
        if (total > MAX_JSON_BODY_BYTES) {
            const error = new Error('Request body too large.');
            error.statusCode = 413;
            throw error;
        }
        chunks.push(buffer);
    }

    if (!chunks.length) return {};
    const raw = Buffer.concat(chunks).toString('utf8');
    return raw ? JSON.parse(raw) : {};
}

function normMachineId(value) {
    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    return /^[a-f0-9]{64}$/.test(normalized) ? normalized : null;
}

function normEmail(value) {
    if (typeof value !== 'string') return null;
    const normalized = value.replace(/[<>"']/g, '').trim().slice(0, 160);
    return normalized && normalized.includes('@') ? normalized : null;
}

function normLicenseKey(value) {
    if (typeof value !== 'string') return null;
    const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!normalized.startsWith('AVC')) return null;
    const suffix = normalized.slice(3);
    if (!/^[A-Z0-9]{20}$/.test(suffix)) return null;
    return `AVC-${suffix.slice(0, 4)}-${suffix.slice(4, 8)}-${suffix.slice(8, 12)}-${suffix.slice(12, 16)}-${suffix.slice(16, 20)}`;
}

function normPlanId(value) {
    return typeof value === 'string' && LICENSE_PLANS[value] ? value : 'credits_5';
}

function stripeSeconds(value) {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
}

function getStripe() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
    if (!stripeSecretKey) return null;
    return new Stripe(stripeSecretKey, { apiVersion: '2025-03-31.basil' });
}

function getSql() {
    const databaseUrl = process.env.KL_DATABASE_URL || process.env.DATABASE_URL;
    return databaseUrl ? neon(databaseUrl) : null;
}

function generateLicenseKey() {
    const raw = crypto.randomBytes(10).toString('hex').toUpperCase();
    return `AVC-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}`;
}

async function ensureTables(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS autovid_license_accounts (
            machine_id text PRIMARY KEY,
            free_used integer NOT NULL DEFAULT 0,
            credits integer NOT NULL DEFAULT 0,
            email text,
            license_key text,
            stripe_customer_id text,
            stripe_subscription_id text,
            subscription_status text,
            subscription_current_period_end timestamptz,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    `;

    await sql`ALTER TABLE autovid_license_accounts ADD COLUMN IF NOT EXISTS license_key text`;
    await sql`ALTER TABLE autovid_license_accounts ADD COLUMN IF NOT EXISTS stripe_customer_id text`;
    await sql`ALTER TABLE autovid_license_accounts ADD COLUMN IF NOT EXISTS stripe_subscription_id text`;
    await sql`ALTER TABLE autovid_license_accounts ADD COLUMN IF NOT EXISTS subscription_status text`;
    await sql`ALTER TABLE autovid_license_accounts ADD COLUMN IF NOT EXISTS subscription_current_period_end timestamptz`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS autovid_license_accounts_license_key_idx ON autovid_license_accounts (license_key) WHERE license_key IS NOT NULL`;

    await sql`
        CREATE TABLE IF NOT EXISTS autovid_processed_sessions (
            session_id text PRIMARY KEY,
            machine_id text NOT NULL REFERENCES autovid_license_accounts(machine_id) ON DELETE CASCADE,
            credits integer NOT NULL,
            amount_total integer,
            currency text,
            plan_id text,
            created_at timestamptz NOT NULL DEFAULT now()
        )
    `;

    await sql`ALTER TABLE autovid_processed_sessions ADD COLUMN IF NOT EXISTS plan_id text`;
}

async function getAccount(sql, machineId, email = null) {
    const [account] = await sql`
        INSERT INTO autovid_license_accounts (machine_id, email)
        VALUES (${machineId}, ${email})
        ON CONFLICT (machine_id) DO UPDATE SET
            email = COALESCE(EXCLUDED.email, autovid_license_accounts.email),
            updated_at = now()
        RETURNING machine_id, free_used, credits, email, stripe_customer_id, stripe_subscription_id,
            subscription_status, subscription_current_period_end, license_key
    `;
    return account;
}

async function getAccountByLicenseKey(sql, licenseKey) {
    const [account] = await sql`
        SELECT machine_id, free_used, credits, email, stripe_customer_id, stripe_subscription_id,
            subscription_status, subscription_current_period_end, license_key
        FROM autovid_license_accounts
        WHERE license_key = ${licenseKey}
        LIMIT 1
    `;
    return account || null;
}

async function ensureLicenseKey(sql, machineId) {
    const [existing] = await sql`
        SELECT license_key
        FROM autovid_license_accounts
        WHERE machine_id = ${machineId}
        LIMIT 1
    `;
    if (existing && existing.license_key) {
        return existing.license_key;
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const candidate = generateLicenseKey();
        try {
            const [updated] = await sql`
                UPDATE autovid_license_accounts
                SET license_key = COALESCE(license_key, ${candidate}),
                    updated_at = now()
                WHERE machine_id = ${machineId}
                RETURNING license_key
            `;
            if (updated && updated.license_key) {
                return updated.license_key;
            }
        } catch (error) {
            if (!String(error && error.message || '').toLowerCase().includes('duplicate')) {
                throw error;
            }
        }
    }

    throw new Error('Could not generate a unique license key.');
}

function isUnlimitedActive(account) {
    if (!account) return false;
    const status = String(account.subscription_status || '').toLowerCase();
    if (!['active', 'trialing'].includes(status)) return false;
    if (!account.subscription_current_period_end) return true;
    return new Date(account.subscription_current_period_end).getTime() > Date.now();
}

function subscriptionPeriodSeconds(account) {
    if (!account || !account.subscription_current_period_end) return 0;
    const date = new Date(account.subscription_current_period_end);
    const seconds = Math.floor(date.getTime() / 1000);
    return Number.isFinite(seconds) ? seconds : 0;
}

function statusPayload(account, extras = {}) {
    return {
        ok: true,
        machine_id: account.machine_id,
        free_used: Number(account.free_used || 0),
        free_limit: FREE_LIMIT,
        credits: Number(account.credits || 0),
        email: account.email || '',
        license_key: account.license_key || '',
        unlimited_active: isUnlimitedActive(account),
        subscription_status: account.subscription_status || '',
        subscription_current_period_end: subscriptionPeriodSeconds(account),
        ...extras
    };
}

async function activateLicense(sql, machineId, email, licenseKey) {
    const normalizedEmail = normEmail(email || '');
    const normalizedLicenseKey = normLicenseKey(licenseKey || '');
    if (!normalizedEmail) {
        return { ok: false, error: 'A recovery email is required to restore a paid license.' };
    }
    if (!normalizedLicenseKey) {
        return { ok: false, error: 'Enter a valid Auto Vid Compiler recovery key.' };
    }

    const currentAccount = await getAccount(sql, machineId, normalizedEmail);
    const sourceAccount = await getAccountByLicenseKey(sql, normalizedLicenseKey);
    if (!sourceAccount) {
        return { ok: false, error: 'That recovery key was not found.' };
    }

    const sourceEmail = normEmail(sourceAccount.email || '');
    if (!sourceEmail || sourceEmail !== normalizedEmail) {
        return { ok: false, error: 'That recovery key does not match the supplied email.' };
    }

    if (sourceAccount.machine_id === machineId) {
        return statusPayload(currentAccount, {
            license_key: normalizedLicenseKey,
            recovered: true,
            recovery_message: 'This device is already linked to that paid license.'
        });
    }

    const hasPaidEntitlement = isUnlimitedActive(sourceAccount)
        || Number(sourceAccount.credits || 0) > 0
        || !!sourceAccount.stripe_subscription_id;
    if (!hasPaidEntitlement) {
        return { ok: false, error: 'That recovery key has no paid credits or active subscription to restore.' };
    }

    await sql`
        UPDATE autovid_license_accounts
        SET credits = 0,
            license_key = NULL,
            stripe_customer_id = NULL,
            stripe_subscription_id = NULL,
            subscription_status = '',
            subscription_current_period_end = NULL,
            updated_at = now()
        WHERE machine_id = ${sourceAccount.machine_id}
    `;

    await sql`
        UPDATE autovid_license_accounts
        SET credits = ${Number(sourceAccount.credits || 0)},
            email = ${sourceEmail},
            license_key = ${normalizedLicenseKey},
            stripe_customer_id = ${sourceAccount.stripe_customer_id || null},
            stripe_subscription_id = ${sourceAccount.stripe_subscription_id || null},
            subscription_status = ${sourceAccount.subscription_status || ''},
            subscription_current_period_end = ${sourceAccount.subscription_current_period_end || null}::timestamptz,
            updated_at = now()
        WHERE machine_id = ${machineId}
    `;

    const [updated] = await sql`
        SELECT machine_id, free_used, credits, email, stripe_customer_id, stripe_subscription_id,
            subscription_status, subscription_current_period_end, license_key
        FROM autovid_license_accounts
        WHERE machine_id = ${machineId}
        LIMIT 1
    `;

    return statusPayload(updated, {
        recovered: true,
        recovery_message: 'Paid credits and subscription access were moved to this device.'
    });
}

async function consumeUse(sql, machineId) {
    const account = await getAccount(sql, machineId);

    if (isUnlimitedActive(account)) {
        return statusPayload(account, { entitlement: 'monthly_unlimited' });
    }

    if (Number(account.credits || 0) > 0) {
        const [updated] = await sql`
            UPDATE autovid_license_accounts
            SET credits = credits - 1, updated_at = now()
            WHERE machine_id = ${machineId} AND credits > 0
            RETURNING machine_id, free_used, credits, email, stripe_customer_id, stripe_subscription_id,
                subscription_status, subscription_current_period_end
        `;
        if (updated) return statusPayload(updated, { entitlement: 'paid_credit' });
    }

    if (Number(account.free_used || 0) < FREE_LIMIT) {
        const [updated] = await sql`
            UPDATE autovid_license_accounts
            SET free_used = free_used + 1, updated_at = now()
            WHERE machine_id = ${machineId} AND free_used < ${FREE_LIMIT}
            RETURNING machine_id, free_used, credits, email, stripe_customer_id, stripe_subscription_id,
                subscription_status, subscription_current_period_end
        `;
        if (updated) return statusPayload(updated, { entitlement: 'free_trial' });
    }

    return statusPayload(account, {
        ok: false,
        payment_required: true,
        error: 'No free uses or paid credits remain.'
    });
}

async function creditPaidSession(sql, session, machineId) {
    const metadata = session.metadata || {};
    const planId = normPlanId(metadata.plan_id || '');
    const plan = LICENSE_PLANS[planId];
    const credits = plan.credits || 0;
    const amountTotal = Number(session.amount_total || 0);
    const currency = typeof session.currency === 'string' ? session.currency : 'usd';
    const customerId = typeof session.customer === 'string' ? session.customer : '';
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : '';

    await getAccount(sql, machineId, normEmail(session.customer_email || (session.customer_details && session.customer_details.email) || ''));

    const inserted = await sql`
        INSERT INTO autovid_processed_sessions (session_id, machine_id, credits, amount_total, currency, plan_id)
        VALUES (${session.id}, ${machineId}, ${credits}, ${amountTotal}, ${currency}, ${planId})
        ON CONFLICT (session_id) DO NOTHING
        RETURNING session_id
    `;

    if (plan.mode === 'subscription') {
        let subscriptionStatus = 'active';
        let periodEnd = null;
        if (subscriptionId) {
            try {
                const stripe = getStripe();
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                subscriptionStatus = subscription.status || subscriptionStatus;
                periodEnd = subscription.current_period_end
                    ? new Date(subscription.current_period_end * 1000).toISOString()
                    : null;
            } catch (error) {
                console.error('[autovid-license] Subscription retrieve failed:', error && error.message);
            }
        }
        await sql`
            UPDATE autovid_license_accounts
            SET stripe_customer_id = COALESCE(${customerId || null}, stripe_customer_id),
                stripe_subscription_id = COALESCE(${subscriptionId || null}, stripe_subscription_id),
                subscription_status = ${subscriptionStatus},
                subscription_current_period_end = COALESCE(${periodEnd || null}::timestamptz, subscription_current_period_end),
                updated_at = now()
            WHERE machine_id = ${machineId}
        `;
    } else if (inserted.length) {
        await sql`
            UPDATE autovid_license_accounts
            SET credits = credits + ${credits},
                stripe_customer_id = COALESCE(${customerId || null}, stripe_customer_id),
                updated_at = now()
            WHERE machine_id = ${machineId}
        `;
    }

    const licenseKey = await ensureLicenseKey(sql, machineId);

    const [account] = await sql`
        SELECT machine_id, free_used, credits, email, stripe_customer_id, stripe_subscription_id,
            subscription_status, subscription_current_period_end, license_key
        FROM autovid_license_accounts
        WHERE machine_id = ${machineId}
        LIMIT 1
    `;

    return statusPayload(account, {
        paid: true,
        credited: plan.mode === 'subscription' || inserted.length > 0,
        plan_id: planId,
        license_key: licenseKey,
        session_id: session.id
    });
}

async function createCheckout(sql, machineId, email, planId, req) {
    const stripe = getStripe();
    if (!stripe) {
        return { ok: false, error: 'Stripe is not configured.' };
    }
    if (!email) {
        return { ok: false, error: 'A recovery email is required for paid plans.' };
    }
    const plan = LICENSE_PLANS[planId];

    await getAccount(sql, machineId, email);

    const originHost = req.headers.host ? `https://${req.headers.host}` : 'https://knightlogics.com';
    const baseUrl = originHost.includes('localhost') || originHost.includes('127.0.0.1')
        ? 'https://knightlogics.com'
        : originHost;
    const priceData = {
        currency: 'usd',
        unit_amount: plan.amount,
        product_data: {
            name: `Auto Vid Compiler - ${plan.label}`,
            description: plan.description
        }
    };
    if (plan.mode === 'subscription') {
        priceData.recurring = { interval: 'month' };
    }

    const checkoutParams = {
        mode: plan.mode,
        payment_method_types: ['card'],
        customer_email: email || undefined,
        line_items: [
            {
                quantity: 1,
                price_data: priceData
            }
        ],
        metadata: {
            app: 'autovid_compiler',
            machine_id: machineId,
            plan_id: planId,
            credits: String(plan.credits || 0),
            paymentType: plan.mode === 'subscription' ? 'desktop_app_subscription' : 'desktop_app_credit_pack'
        },
        success_url: `${baseUrl}/auto-vid-compiler?autovid_checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/auto-vid-compiler?autovid_checkout=cancelled`
    };
    if (plan.mode === 'payment') {
        checkoutParams.customer_creation = 'always';
    }
    if (plan.mode === 'subscription') {
        checkoutParams.subscription_data = {
            metadata: {
                app: 'autovid_compiler',
                machine_id: machineId,
                plan_id: planId
            }
        };
    }

    const session = await stripe.checkout.sessions.create(checkoutParams);

    return {
        ok: true,
        session_id: session.id,
        url: session.url,
        plan_id: planId
    };
}

async function confirmSession(sql, machineId, sessionId) {
    const stripe = getStripe();
    if (!stripe) {
        return { ok: false, error: 'Stripe is not configured.' };
    }

    if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
        return { ok: false, error: 'Invalid checkout session.' };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const metadata = session.metadata || {};
    if (metadata.app !== 'autovid_compiler' || metadata.machine_id !== machineId) {
        return { ok: false, error: 'Checkout session does not match this device.' };
    }

    if (session.payment_status !== 'paid') {
        const account = await getAccount(sql, machineId);
        return statusPayload(account, {
            paid: false,
            payment_required: true,
            error: 'Payment has not completed yet.'
        });
    }

    return creditPaidSession(sql, session, machineId);
}

module.exports = async function handler(req, res) {
    const origin = req.headers.origin || '';

    if (req.method === 'OPTIONS') {
        return sendJson(res, 200, { ok: true }, origin);
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return sendJson(res, 405, { ok: false, error: 'Method not allowed.' }, origin);
    }

    let body;
    try {
        body = await readJson(req);
    } catch (error) {
        return sendJson(res, error.statusCode || 400, { ok: false, error: 'Invalid JSON body.' }, origin);
    }

    const action = typeof body.action === 'string' ? body.action.trim() : '';
    const machineId = normMachineId(body.machine_id);
    if (!VALID_ACTIONS.has(action)) {
        return sendJson(res, 400, { ok: false, error: 'Invalid action.' }, origin);
    }
    if (!machineId) {
        return sendJson(res, 400, { ok: false, error: 'Invalid machine id.' }, origin);
    }

    const sql = getSql();
    if (!sql) {
        return sendJson(res, 503, { ok: false, error: 'License database is not configured.' }, origin);
    }

    try {
        await ensureTables(sql);

        if (action === 'status') {
            const account = await getAccount(sql, machineId);
            return sendJson(res, 200, statusPayload(account), origin);
        }

        if (action === 'consume') {
            const result = await consumeUse(sql, machineId);
            return sendJson(res, result.ok ? 200 : 402, result, origin);
        }

        if (action === 'create_checkout') {
            const result = await createCheckout(
                sql,
                machineId,
                normEmail(body.email || ''),
                normPlanId(body.plan_id || ''),
                req
            );
            return sendJson(res, result.ok ? 200 : 503, result, origin);
        }

        if (action === 'confirm_session') {
            const result = await confirmSession(sql, machineId, String(body.session_id || ''));
            return sendJson(res, result.ok ? 200 : 402, result, origin);
        }

        if (action === 'activate_license') {
            const result = await activateLicense(
                sql,
                machineId,
                body.email || '',
                body.license_key || ''
            );
            return sendJson(res, result.ok ? 200 : 400, result, origin);
        }

        return sendJson(res, 400, { ok: false, error: 'Unhandled action.' }, origin);
    } catch (error) {
        console.error('[autovid-license]', error && error.message);
        return sendJson(res, 500, { ok: false, error: 'License service failed.' }, origin);
    }
};
