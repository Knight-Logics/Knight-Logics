/**
 * Global hero asteroids high score (single leaderboard row for knightlogics.com).
 *
 * GET  /api/hero-asteroids-hiscore  -> { score, initials, updatedAt }
 * POST /api/hero-asteroids-hiscore  -> { score, initials } (only if score beats current)
 */
'use strict';

const { neon } = require('@neondatabase/serverless');

const BOARD_ID = 'global';
const DEFAULT_SCORE = 100;

const ALLOWED_ORIGINS = new Set([
    'https://knightlogics.com',
    'https://www.knightlogics.com',
]);

function corsHeaders(origin) {
    const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://knightlogics.com';
    return {
        'Access-Control-Allow-Origin': allowed,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
    };
}

async function readRawBody(req) {
    if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString('utf8');
    if (typeof req.rawBody === 'string') return req.rawBody;
    if (typeof req.body === 'string') return req.body;
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        return JSON.stringify(req.body);
    }
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
}

async function ensureTable(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS kl_hero_asteroids_hiscore (
            board_id   VARCHAR(32) PRIMARY KEY,
            score      INTEGER NOT NULL DEFAULT 100,
            initials   VARCHAR(3) NOT NULL DEFAULT '',
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;
}

async function readBoard(sql) {
    await ensureTable(sql);
    const rows = await sql`
        SELECT score, initials, updated_at
        FROM kl_hero_asteroids_hiscore
        WHERE board_id = ${BOARD_ID}
        LIMIT 1
    `;
    if (!rows.length) {
        await sql`
            INSERT INTO kl_hero_asteroids_hiscore (board_id, score, initials)
            VALUES (${BOARD_ID}, ${DEFAULT_SCORE}, '')
            ON CONFLICT (board_id) DO NOTHING
        `;
        return { score: DEFAULT_SCORE, initials: '', updatedAt: null };
    }
    const row = rows[0];
    return {
        score: Number(row.score) || DEFAULT_SCORE,
        initials: String(row.initials || '').slice(0, 3).toUpperCase(),
        updatedAt: row.updated_at || null,
    };
}

module.exports = async function handler(req, res) {
    const headers = corsHeaders(req.headers.origin || '');

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        return res.end();
    }

    if (req.method === 'GET') {
        if (!process.env.KL_DATABASE_URL) {
            res.writeHead(200, headers);
            return res.end(JSON.stringify({ score: DEFAULT_SCORE, initials: '', source: 'default' }));
        }
        try {
            const sql = neon(process.env.KL_DATABASE_URL);
            const board = await readBoard(sql);
            res.writeHead(200, headers);
            return res.end(JSON.stringify(board));
        } catch (err) {
            console.error('[hero-asteroids-hiscore] GET failed:', err && err.message);
            res.writeHead(500, headers);
            return res.end(JSON.stringify({ error: 'Server error.' }));
        }
    }

    if (req.method !== 'POST') {
        res.writeHead(405, headers);
        return res.end(JSON.stringify({ error: 'Method not allowed.' }));
    }

    if (!process.env.KL_DATABASE_URL) {
        res.writeHead(503, headers);
        return res.end(JSON.stringify({ error: 'Leaderboard unavailable.' }));
    }

    let body = {};
    try {
        const raw = await readRawBody(req);
        body = raw ? JSON.parse(raw) : {};
    } catch (_) {
        body = {};
    }

    const attemptScore = parseInt(body.score, 10);
    const initials = String(body.initials || '').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();

    if (!Number.isFinite(attemptScore) || attemptScore < 0 || attemptScore > 999999) {
        res.writeHead(400, headers);
        return res.end(JSON.stringify({ error: 'Invalid score.' }));
    }
    if (!initials) {
        res.writeHead(400, headers);
        return res.end(JSON.stringify({ error: 'Initials required.' }));
    }

    try {
        const sql = neon(process.env.KL_DATABASE_URL);
        const current = await readBoard(sql);
        if (attemptScore <= current.score) {
            res.writeHead(409, headers);
            return res.end(JSON.stringify({ ok: false, reason: 'not_high_enough', ...current }));
        }

        await sql`
            UPDATE kl_hero_asteroids_hiscore
            SET score = ${attemptScore},
                initials = ${initials},
                updated_at = NOW()
            WHERE board_id = ${BOARD_ID}
              AND score < ${attemptScore}
        `;

        const board = await readBoard(sql);
        if (board.score === attemptScore && board.initials === initials) {
            res.writeHead(200, headers);
            return res.end(JSON.stringify({ ok: true, ...board }));
        }

        res.writeHead(409, headers);
        return res.end(JSON.stringify({ ok: false, reason: 'beaten', ...board }));
    } catch (err) {
        console.error('[hero-asteroids-hiscore] POST failed:', err && err.message);
        res.writeHead(500, headers);
        return res.end(JSON.stringify({ error: 'Server error.' }));
    }
};
