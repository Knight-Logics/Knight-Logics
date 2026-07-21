'use strict';

const { neon } = require('@neondatabase/serverless');
const {
    FORGOT_CONTACT,
    ROLES,
    getAdminSecret,
    hashPassword,
    verifySecret,
    issueSessionToken,
    verifySessionToken,
    readJsonBody,
    authenticateRequest,
    setOwnerPasswordHash,
    ownerPasswordConfigured,
} = require('./_lib/admin-auth');
const pixelforgeLicenseHandler = require('./_lib/pixelforge-license');

function sendJson(res, status, payload) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(payload));
}

async function handleHealth(req, res, body) {
    if (!getAdminSecret()) {
        return sendJson(res, 503, {
            ok: false,
            error: 'Admin secret not configured on server (KL_ADMIN_SECRET).',
        });
    }

    const auth = await authenticateRequest(req, body);
    if (!auth.ok) {
        return sendJson(res, 403, { ok: false, error: 'Forbidden.' });
    }

    const databaseUrl = process.env.KL_DATABASE_URL;
    const modules = {
        admin_shell: {
            label: 'Knight Command (/admin)',
            status: 'ok',
            detail: 'Cloud shell reachable.',
        },
        referral_crm: {
            label: 'Referral CRM',
            status: databaseUrl ? 'ok' : 'error',
            detail: databaseUrl ? 'Database configured.' : 'KL_DATABASE_URL missing.',
        },
        referral_api: {
            label: 'Referral API',
            status: 'ok',
            detail: 'referral-stats and referral-admin endpoints deployed.',
        },
    };

    if (databaseUrl) {
        try {
            const sql = neon(databaseUrl);
            await sql`SELECT 1 AS ok`;
            modules.referral_crm.detail = 'Database connection OK.';
        } catch (error) {
            modules.referral_crm.status = 'error';
            modules.referral_crm.detail = `Database probe failed: ${error.message}`;
            console.error('[admin] database probe failed', error.message);
        }
    }

    const localModules = [
        {
            id: 'knight_command',
            label: 'Outreach / Knight Command',
            url: 'http://127.0.0.1:5050/',
            port: 5050,
            kind: 'local',
            moduleKey: 'outreach',
        },
        {
            id: 'email_agent',
            label: 'Email Agent',
            url: 'http://127.0.0.1:5100/',
            port: 5100,
            kind: 'local',
            moduleKey: 'email',
        },
        {
            id: 'social_ops',
            label: 'Social Ops (Engagement Manager)',
            url: 'http://127.0.0.1:8500/?embed=true',
            port: 8500,
            kind: 'local',
            moduleKey: 'social_ops',
        },
        {
            id: 'social_poster',
            label: 'Social Poster',
            url: 'http://127.0.0.1:8501/?embed=true',
            port: 8501,
            kind: 'local',
            moduleKey: 'social_poster',
        },
    ];

    const remoteModules = {};
    const opsSecret = getAdminSecret();
    // Blank Vercel overrides must not disable known production tunnel hosts.
    const remoteConfig = [
        {
            key: 'outreach',
            label: 'Outreach CRM',
            envUrl: process.env.KL_OUTREACH_URL || 'https://ops.knightlogics.com',
            embedPath: '/?embed=1&module=outreach',
            probePath: '/api/ops-health',
        },
        {
            key: 'email',
            label: 'Email Agent',
            envUrl: process.env.KL_EMAIL_AGENT_URL || 'https://mail.knightlogics.com',
            embedPath: '/?embed=1',
            probePath: '/api/health',
        },
        {
            key: 'social_ops',
            label: 'Social Ops',
            envUrl: process.env.KL_SOCIAL_OPS_URL || 'https://social.knightlogics.com',
            embedPath: '/?embed=true',
            probePath: '/',
        },
        {
            key: 'social_poster',
            label: 'Social Poster',
            envUrl: process.env.KL_SOCIAL_POSTER_URL || 'https://poster.knightlogics.com',
            embedPath: '/?embed=true',
            probePath: '/',
        },
    ];

    const probeRemoteModule = async (cfg) => {
        const raw = String(cfg.envUrl || '').trim();
        if (!raw) return null;
        let origin = raw;
        try {
            origin = new URL(raw).origin;
        } catch (error) {
            return {
                key: cfg.key,
                module: {
                    label: cfg.label,
                    base: raw,
                    origin: null,
                    url: raw.replace(/\/+$/, '') + cfg.embedPath,
                    status: 'error',
                    detail: `Invalid KL URL: ${error.message}`,
                },
            };
        }
        const base = origin;
        let status = 'pending';
        let detail = 'Configured — browser will connect on tab open.';
        // Public health/root probes do not need the ops token. Sending KL_ADMIN_SECRET
        // as X-KL-Ops-Token can produce false 401s through some edges even when the
        // browser embed works. Probe anonymously against the origin + public path.
        try {
            const probeUrl = base + cfg.probePath;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(probeUrl, {
                method: 'GET',
                signal: controller.signal,
                redirect: 'follow',
            });
            clearTimeout(timer);
            if (response.ok) {
                status = 'ok';
                detail = 'Cloud ops host reachable from Vercel.';
            } else if (response.status === 401 || response.status === 403) {
                // Auth-gated HTML still means the tunnel/host is up; admin embeds
                // pass kl_ops_token / postMessage from the browser.
                status = 'ok';
                detail = `Cloud host up (HTTP ${response.status} on anonymous probe). Browser embed uses admin session.`;
            } else {
                status = 'warning';
                detail = `Cloud URL configured; preflight returned HTTP ${response.status}. The browser will connect directly.`;
            }
        } catch (error) {
            status = 'warning';
            detail = 'Cloud URL configured; preflight timed out. The browser will connect directly.';
        }
        if (!opsSecret && status === 'pending') {
            detail = 'Set KL_ADMIN_SECRET to enable server-side ops probe.';
        }
        return {
            key: cfg.key,
            module: {
                label: cfg.label,
                base,
                origin,
                url: base + cfg.embedPath,
                status,
                detail,
            },
        };
    };

    const probeResults = await Promise.all(remoteConfig.map((cfg) => probeRemoteModule(cfg)));
    for (const row of probeResults) {
        if (row) remoteModules[row.key] = row.module;
    }

    const notes = [
        'Referrals runs fully in the cloud (Vercel + Neon).',
        'Outreach, Email, Social Ops, and Social Poster use Cloudflare tunnel hosts (ops / mail / social / poster.knightlogics.com). They require this PC on with services + tunnel; watchdogs restart them automatically.',
        'Local fallback on this PC: Outreach :5050, Email :5100, Social Ops :8500, Social Poster :8501. Ensure script: CRM\\OutreachEngine\\scripts\\ensure-knight-command-stack.ps1',
    ];

    return sendJson(res, 200, {
        ok: true,
        generatedAt: new Date().toISOString(),
        authMethod: auth.method,
        role: auth.role,
        modules,
        localModules,
        remoteModules,
        notes,
    });
}

module.exports = async function handler(req, res) {
    const requestUrl = new URL(req.url || '/', 'http://localhost');
    const route = String(
        (req.query && req.query.route) || requestUrl.searchParams.get('route') || ''
    ).trim().toLowerCase();
    const requestPath = requestUrl.pathname.replace(/\/+$/, '').toLowerCase();
    if (route === 'pixelforge-license' || requestPath.endsWith('/pixelforge-license')) {
        return pixelforgeLicenseHandler(req, res);
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
    }

    let body = {};
    try {
        body = await readJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, { ok: false, error: 'Invalid JSON body.' });
    }

    const action = String(body.action || 'login').trim().toLowerCase();

    if (action === 'health') {
        return handleHealth(req, res, body);
    }

    if (action === 'forgot-info') {
        return sendJson(res, 200, {
            ok: true,
            contact: FORGOT_CONTACT,
            ownerConfigured: await ownerPasswordConfigured(),
        });
    }

    if (!getAdminSecret()) {
        return sendJson(res, 503, {
            ok: false,
            error: 'Admin secret not configured on server (KL_ADMIN_SECRET).',
        });
    }

    if (action === 'verify') {
        const session = verifySessionToken(body.token || req.headers['x-kl-admin-token']);
        if (!session.ok) {
            return sendJson(res, 403, { ok: false, error: 'Invalid or expired session.' });
        }
        return sendJson(res, 200, { ok: true, valid: true, role: session.role });
    }

    if (action === 'set-owner-password') {
        const session = verifySessionToken(body.token || req.headers['x-kl-admin-token']);
        if (!session.ok || session.role !== ROLES.MASTER) {
            return sendJson(res, 403, { ok: false, error: 'Master access required.' });
        }
        const nextPassword = String(body.newPassword || body.password || '').trim();
        if (nextPassword.length < 8) {
            return sendJson(res, 400, { ok: false, error: 'Owner password must be at least 8 characters.' });
        }
        if (nextPassword === getAdminSecret()) {
            return sendJson(res, 400, { ok: false, error: 'Owner password must differ from the master password.' });
        }
        try {
            await setOwnerPasswordHash(hashPassword(nextPassword));
            console.info('[admin] owner password updated by master');
            return sendJson(res, 200, { ok: true, message: 'Owner password updated.' });
        } catch (error) {
            console.error('[admin] owner password update failed', error.message);
            return sendJson(res, 503, { ok: false, error: 'Could not save owner password.' });
        }
    }

    if (action === 'owner-status') {
        const session = verifySessionToken(body.token || req.headers['x-kl-admin-token']);
        if (!session.ok || session.role !== ROLES.MASTER) {
            return sendJson(res, 403, { ok: false, error: 'Master access required.' });
        }
        return sendJson(res, 200, {
            ok: true,
            ownerConfigured: await ownerPasswordConfigured(),
        });
    }

    const secret = body.secret || '';
    const verified = await verifySecret(secret);
    if (!verified.ok) {
        console.warn('[admin] failed login attempt');
        return sendJson(res, 403, { ok: false, error: 'Incorrect password.' });
    }

    const session = issueSessionToken(verified.role);
    console.info('[admin] session issued', { role: verified.role });
    return sendJson(res, 200, {
        ok: true,
        token: session.token,
        role: session.role,
        expiresAt: session.expiresAt,
    });
};
