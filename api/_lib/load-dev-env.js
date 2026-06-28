'use strict';

const fs = require('fs');
const path = require('path');

const ENV_KEYS = [
    'KL_ADMIN_SECRET',
    'KL_OWNER_SECRET',
    'KL_DATABASE_URL',
    'KL_VERIFY_SALT',
    'DATABASE_URL',
];
const ENV_FILES = ['.env.production.local', '.env.preview.local', '.env.development.local', '.env.local'];

let loaded = false;

function parseEnvLine(line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
        return null;
    }
    const eq = trimmed.indexOf('=');
    if (eq <= 0) {
        return null;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
        (value.startsWith('"') && value.endsWith('"'))
        || (value.startsWith("'") && value.endsWith("'"))
    ) {
        value = value.slice(1, -1);
    }
    return { key, value };
}

function loadDevEnv() {
    if (loaded) {
        return;
    }
    loaded = true;

    const isLocalDev = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'development';
    if (!isLocalDev) {
        return;
    }

    const needsKeys = ENV_KEYS.some((key) => !process.env[key]);
    if (!needsKeys) {
        return;
    }

    const root = path.join(__dirname, '..', '..');
    for (const file of ENV_FILES) {
        const filePath = path.join(root, file);
        if (!fs.existsSync(filePath)) {
            continue;
        }
        const text = fs.readFileSync(filePath, 'utf8');
        for (const line of text.split(/\r?\n/)) {
            const parsed = parseEnvLine(line);
            if (!parsed || !ENV_KEYS.includes(parsed.key) || process.env[parsed.key]) {
                continue;
            }
            if (!parsed.value) {
                continue;
            }
            process.env[parsed.key] = parsed.value;
        }
    }
}

module.exports = { loadDevEnv };
