'use strict';

/**
 * Sync Google Business Profile ratings for Knight Logics + client locations.
 *
 * Writes:
 *   data/google-reviews.json  — full Knight Logics review feed (carousel)
 *   data/gbp-ratings.json     — rating/count map for homepage map + case studies
 *
 * Usage:
 *   npm run reviews:sync-google
 *   node scripts/sync-google-reviews.js --dry-run
 *   node scripts/sync-google-reviews.js --ratings-only
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ACCOUNTS_API = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
const LOCATIONS_API_ROOT = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const REVIEWS_API_ROOT = 'https://mybusiness.googleapis.com/v4';
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const REVIEWS_OUTPUT = path.join(DATA_DIR, 'google-reviews.json');
const RATINGS_OUTPUT = path.join(DATA_DIR, 'gbp-ratings.json');

const STAR_MAP = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5
};

const AVATAR_COLORS = ['#1d4ed8', '#156f43', '#b42318', '#8a5a00', '#17623b', '#274690', '#7c3aed', '#0f766e'];

/** Public location IDs (not secrets) — used for case-study / map hydration keys. */
const GBP_LOCATIONS = [
    {
        key: 'knight-logics',
        title: 'Knight Logics',
        envKeys: ['GBP_LOCATION_ID', 'GBP_LOCATION_NAME'],
        fallbackId: '1248159491432428151',
        caseStudy: 'case-study-knight-logics',
        homepageMap: true
    },
    {
        key: 'knight-group',
        title: 'Knight Group',
        envKeys: ['KG_GBP_LOCATION_ID', 'KG_GBP_LOCATION_NAME'],
        fallbackId: '15551195498878135337',
        caseStudy: 'case-study-knight-group'
    },
    {
        key: 'screen-team',
        title: 'Screen Team LLC',
        envKeys: ['ST_GBP_LOCATION_ID', 'ST_GBP_LOCATION_NAME'],
        fallbackId: '4667456483992971896',
        caseStudy: 'case-study-screen-team'
    },
    {
        key: 'sals-painting',
        title: "Sal's Painting",
        envKeys: ['SALS_GBP_LOCATION_ID', 'SALS_GBP_LOCATION_NAME'],
        fallbackId: '6578775761523740862',
        caseStudy: 'case-study-sals-painting'
    },
    {
        key: 'moms-resin-tables',
        title: "Mom's Resin Tables",
        envKeys: ['MRT_GBP_LOCATION_ID', 'MRT_GBP_LOCATION_NAME'],
        fallbackId: '7574920725988430136',
        caseStudy: 'case-study-moms-resin-tables'
    },
    {
        key: 'jns-construction',
        title: 'JNS Construction Services LLC',
        envKeys: ['JNS_GBP_LOCATION_ID', 'JNS_GBP_LOCATION_NAME'],
        fallbackId: '9312896125475130558',
        caseStudy: 'case-study-jns'
    },
    {
        key: 'clearwater-dentist',
        title: 'Clearwater Dentist',
        envKeys: ['CWD_GBP_LOCATION_ID', 'CWD_GBP_LOCATION_NAME'],
        fallbackId: '10173427097989168585',
        caseStudy: null
    },
    {
        key: 'roof-monsters',
        title: 'Roof Monsters',
        envKeys: ['ROOFMONSTERS_GBP_LOCATION_ID', 'ROOFMONSTERS_GBP_LOCATION_NAME', 'RM_GBP_LOCATION_ID', 'RM_GBP_LOCATION_NAME'],
        fallbackId: '10965227831136317523',
        caseStudy: 'case-study-roof-monsters'
    },
    {
        key: 'faith-works',
        title: 'Faith Works Outdoor Services',
        envKeys: ['FAITHWORKS_GBP_LOCATION_ID', 'FAITHWORKS_GBP_LOCATION_NAME', 'FW_GBP_LOCATION_ID', 'FW_GBP_LOCATION_NAME'],
        fallbackId: '11714542974358350290',
        caseStudy: 'case-study-faith-works'
    }
];

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;

        const key = trimmed.slice(0, idx).trim();
        let value = trimmed.slice(idx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = value;
    }
}

function loadDefaultEnvs() {
    const root = path.resolve(__dirname, '..');
    loadEnvFile(path.join(root, '.env.local'));
    loadEnvFile(path.join(root, '.env.production'));
    loadEnvFile(process.env.KL_ACCOUNTS_ENV_PATH || 'C:/Users/nknig/.copilot-secrets/accounts.env');
}

function requireEnv(name) {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

function normalizeAccountName(input) {
    if (!input) return null;
    return input.startsWith('accounts/') ? input : `accounts/${input}`;
}

function normalizeLocationName(input) {
    if (!input) return null;
    const trimmed = String(input).trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('accounts/') && trimmed.includes('/locations/')) return trimmed;
    if (trimmed.startsWith('locations/')) return trimmed;
    return `locations/${trimmed}`;
}

function locationIdFromName(locationName) {
    if (!locationName) return null;
    const match = String(locationName).match(/locations\/([^/]+)/);
    return match ? match[1] : null;
}

function resolveLocationName(entry) {
    for (const key of entry.envKeys) {
        const value = process.env[key];
        if (value) return normalizeLocationName(value);
    }
    if (entry.fallbackId) return normalizeLocationName(entry.fallbackId);
    return null;
}

function resolveAccountName(entry) {
    const prefix = entry.envKeys[0].replace(/_?(GBP_LOCATION_ID|GBP_LOCATION_NAME)$/i, '');
    const candidates = [
        process.env[`${prefix}_GBP_ACCOUNT_NAME`],
        process.env[`${prefix}_GBP_ACCOUNT_ID`],
        process.env[`${prefix}GBP_ACCOUNT_NAME`],
        process.env[`${prefix}GBP_ACCOUNT_ID`],
        process.env.GBP_ACCOUNT_NAME,
        process.env.GBP_ACCOUNT_ID,
        'accounts/-'
    ];
    for (const value of candidates) {
        if (value) return normalizeAccountName(value);
    }
    return 'accounts/-';
}

async function apiGet(url, accessToken) {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
        }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(`API request failed (${response.status}) ${url} :: ${JSON.stringify(payload)}`);
    }
    return payload;
}

async function getAccessToken() {
    const body = new URLSearchParams({
        client_id: requireEnv('GBP_OAUTH_CLIENT_ID'),
        client_secret: requireEnv('GBP_OAUTH_CLIENT_SECRET'),
        refresh_token: requireEnv('GBP_REFRESH_TOKEN'),
        grant_type: 'refresh_token'
    });

    const response = await fetch(OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.access_token) {
        throw new Error(`OAuth token refresh failed (${response.status}): ${JSON.stringify(payload)}`);
    }
    return payload.access_token;
}

async function listAllLocations(accessToken, accountName) {
    const locations = [];
    let pageToken = '';
    do {
        const query = new URLSearchParams({ readMask: 'name,title,metadata' });
        if (pageToken) query.set('pageToken', pageToken);
        const payload = await apiGet(`${LOCATIONS_API_ROOT}/${accountName}/locations?${query.toString()}`, accessToken);
        locations.push(...(payload.locations || []));
        pageToken = payload.nextPageToken || '';
    } while (pageToken);
    return locations;
}

function selectAccount(accounts) {
    const preferred = normalizeAccountName(process.env.GBP_ACCOUNT_NAME || process.env.GBP_ACCOUNT_ID);
    if (preferred) {
        const exact = accounts.find((a) => a.name === preferred);
        if (exact) return exact;
    }
    if (accounts.length === 1) return accounts[0];

    const hint = (process.env.GBP_ACCOUNT_HINT || '').toLowerCase().trim();
    if (hint) {
        const found = accounts.find((a) => (a.accountName || '').toLowerCase().includes(hint));
        if (found) return found;
    }

    throw new Error(
        'Unable to auto-select GBP account. Set GBP_ACCOUNT_NAME (accounts/...) or GBP_ACCOUNT_ID. ' +
        `Available accounts: ${accounts.map((a) => `${a.name} (${a.accountName || 'no-label'})`).join(', ')}`
    );
}

function selectLocation(locations) {
    const preferred = normalizeLocationName(process.env.GBP_LOCATION_NAME || process.env.GBP_LOCATION_ID);
    if (preferred) {
        const exact = locations.find((l) => l.name === preferred || l.name.endsWith(`/${preferred}`) || preferred.endsWith(l.name));
        if (exact) return exact;
        const byId = locations.find((l) => locationIdFromName(l.name) === locationIdFromName(preferred));
        if (byId) return byId;
    }

    const titleHint = (process.env.GBP_LOCATION_TITLE || 'Knight Logics').toLowerCase().trim();
    const byTitle = locations.find((l) => (l.title || '').toLowerCase().includes(titleHint));
    if (byTitle) return byTitle;
    if (locations.length === 1) return locations[0];

    throw new Error(
        'Unable to auto-select GBP location. Set GBP_LOCATION_NAME (locations/...) or GBP_LOCATION_ID. ' +
        `Available locations: ${locations.map((l) => `${l.name} (${l.title || 'no-title'})`).join(', ')}`
    );
}

async function fetchReviewsSummary(accessToken, accountName, locationName) {
    const reviews = [];
    let pageToken = '';
    let averageRating = null;
    let totalReviewCount = null;

    do {
        const query = new URLSearchParams({ pageSize: '50' });
        if (pageToken) query.set('pageToken', pageToken);
        const endpoint = `${REVIEWS_API_ROOT}/${accountName}/${locationName}/reviews?${query.toString()}`;
        const payload = await apiGet(endpoint, accessToken);
        reviews.push(...(payload.reviews || []));
        if (averageRating == null && payload.averageRating != null) averageRating = Number(payload.averageRating);
        if (totalReviewCount == null && payload.totalReviewCount != null) totalReviewCount = Number(payload.totalReviewCount);
        pageToken = payload.nextPageToken || '';
    } while (pageToken);

    return { reviews, averageRating, totalReviewCount };
}

function hashColor(value) {
    const digest = crypto.createHash('sha1').update(String(value || '')).digest();
    return AVATAR_COLORS[digest[0] % AVATAR_COLORS.length];
}

function mapStars(starValue) {
    if (typeof starValue === 'number') return Math.max(1, Math.min(5, Math.round(starValue)));
    if (!starValue) return 5;
    return STAR_MAP[String(starValue).toUpperCase().trim()] || 5;
}

function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
}

function toFeedReview(review) {
    const reviewerName = (review.reviewer && review.reviewer.displayName) || 'Google User';
    const starCount = mapStars(review.starRating);
    const comment = review.comment || '';
    const reply = review.reviewReply;

    return {
        name: reviewerName,
        meta: 'Google review',
        date: formatDate(review.createTime || review.updateTime),
        text: comment,
        stars: starCount,
        avatarColor: hashColor(reviewerName),
        replied: Boolean(reply && reply.comment),
        ownerReply: reply && reply.comment
            ? {
                name: 'Knight Logics',
                date: formatDate(reply.updateTime),
                text: reply.comment
            }
            : undefined
    };
}

function computeRatingFromReviews(sourceReviews) {
    const reviews = sourceReviews
        .map(toFeedReview)
        .filter((r) => r.text || r.stars)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const ratingTotal = reviews.reduce((sum, r) => sum + (Number(r.stars) || 0), 0);
    const ratingValue = reviews.length ? Number((ratingTotal / reviews.length).toFixed(1)) : 0;
    return { reviews, ratingValue, reviewCount: reviews.length };
}

function buildReviewsPayload(sourceReviews, location, averageRating, totalReviewCount) {
    const computed = computeRatingFromReviews(sourceReviews);
    return {
        ratingValue: averageRating != null ? Number(Number(averageRating).toFixed(1)) : computed.ratingValue,
        reviewCount: totalReviewCount != null ? Number(totalReviewCount) : computed.reviewCount,
        fetchedAt: new Date().toISOString(),
        source: {
            account: process.env.GBP_ACCOUNT_NAME || null,
            location: location.name,
            locationTitle: location.title || null
        },
        reviews: computed.reviews
    };
}

function writeJson(filePath, payload, dryRun) {
    const json = `${JSON.stringify(payload, null, 2)}\n`;
    if (dryRun) {
        console.log('[dry-run] Would write', filePath);
        return;
    }
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, json, 'utf8');
    console.log('Wrote', filePath);
}

function toErrorMessage(error) {
    if (!error) return '';
    if (typeof error === 'string') return error;
    return String(error.message || error);
}

function looksLikeQuotaBlocked(error, apiUrlFragment) {
    const msg = toErrorMessage(error);
    return msg.includes('API request failed (429)') && (!apiUrlFragment || msg.includes(apiUrlFragment));
}

function looksLikeServiceDisabled(error) {
    const msg = toErrorMessage(error);
    return msg.includes('SERVICE_DISABLED') || msg.includes('API has not been used') || msg.includes('it is disabled');
}

function extractActivationUrl(error) {
    const msg = toErrorMessage(error);
    const match = msg.match(/https?:\/\/[^\s"']*console\.developers\.google\.com[^\s"']*/i);
    return match ? match[0] : null;
}

async function resolveKnightLogicsLocation(accessToken) {
    const explicitAccountName = normalizeAccountName(process.env.GBP_ACCOUNT_NAME || process.env.GBP_ACCOUNT_ID);
    const explicitLocationName = normalizeLocationName(process.env.GBP_LOCATION_NAME || process.env.GBP_LOCATION_ID);

    let accountName = explicitAccountName;
    let location = explicitLocationName
        ? {
            name: explicitLocationName,
            title: process.env.GBP_LOCATION_TITLE || 'Knight Logics'
        }
        : null;

    if (!accountName) {
        let accountsPayload;
        try {
            accountsPayload = await apiGet(ACCOUNTS_API, accessToken);
        } catch (error) {
            if (looksLikeQuotaBlocked(error, ACCOUNTS_API)) {
                throw new Error(
                    'Account discovery is quota-blocked. Set GBP_ACCOUNT_NAME and GBP_LOCATION_NAME to skip discovery.'
                );
            }
            throw error;
        }
        const accounts = accountsPayload.accounts || [];
        if (!accounts.length) throw new Error('No Google Business accounts found for the authorized user.');
        const account = selectAccount(accounts);
        accountName = account.name;
        process.env.GBP_ACCOUNT_NAME = accountName;
    }

    if (!location) {
        const locations = await listAllLocations(accessToken, accountName);
        if (!locations.length) throw new Error(`No locations found under account ${accountName}.`);
        location = selectLocation(locations);
    }

    return { accountName, location };
}

async function syncLocationRating(accessToken, entry) {
    const locationName = resolveLocationName(entry);
    if (!locationName) {
        return {
            key: entry.key,
            title: entry.title,
            status: 'missing-location-id',
            ratingValue: null,
            reviewCount: null,
            error: 'No location id configured'
        };
    }

    const accountName = resolveAccountName(entry);
    try {
        const summary = await fetchReviewsSummary(accessToken, accountName, locationName);
        const computed = computeRatingFromReviews(summary.reviews);
        const ratingValue = summary.averageRating != null
            ? Number(Number(summary.averageRating).toFixed(1))
            : computed.ratingValue;
        const reviewCount = summary.totalReviewCount != null
            ? Number(summary.totalReviewCount)
            : computed.reviewCount;

        return {
            key: entry.key,
            title: entry.title,
            status: reviewCount > 0 ? 'live' : 'empty',
            ratingValue,
            reviewCount,
            locationId: locationIdFromName(locationName),
            locationName,
            caseStudy: entry.caseStudy,
            homepageMap: Boolean(entry.homepageMap),
            fetchedAt: new Date().toISOString()
        };
    } catch (error) {
        return {
            key: entry.key,
            title: entry.title,
            status: 'error',
            ratingValue: null,
            reviewCount: null,
            locationId: locationIdFromName(locationName),
            locationName,
            caseStudy: entry.caseStudy,
            homepageMap: Boolean(entry.homepageMap),
            error: toErrorMessage(error).slice(0, 280)
        };
    }
}

async function run() {
    loadDefaultEnvs();

    const dryRun = process.argv.includes('--dry-run');
    const ratingsOnly = process.argv.includes('--ratings-only');
    const accessToken = await getAccessToken();

    if (!ratingsOnly) {
        const { accountName, location } = await resolveKnightLogicsLocation(accessToken);
        const summary = await fetchReviewsSummary(accessToken, accountName, location.name);
        const payload = buildReviewsPayload(summary.reviews, location, summary.averageRating, summary.totalReviewCount);
        writeJson(REVIEWS_OUTPUT, payload, dryRun);
        console.log('reviewCount =', payload.reviewCount, 'ratingValue =', payload.ratingValue);
    }

    const locations = [];
    for (const entry of GBP_LOCATIONS) {
        const result = await syncLocationRating(accessToken, entry);
        locations.push(result);
        const label = result.status === 'live'
            ? `${result.ratingValue} / ${result.reviewCount}`
            : result.status;
        console.log(`[${entry.key}] ${label}${result.error ? ` :: ${result.error}` : ''}`);
    }

    const ratingsPayload = {
        fetchedAt: new Date().toISOString(),
        locations,
        byKey: Object.fromEntries(locations.map((loc) => [loc.key, loc]))
    };
    writeJson(RATINGS_OUTPUT, ratingsPayload, dryRun);
}

run().catch((error) => {
    if (looksLikeServiceDisabled(error)) {
        const activationUrl = extractActivationUrl(error) ||
            'https://console.cloud.google.com/apis/library/mybusiness.googleapis.com';
        console.error(
            'GBP review sync failed: Google My Business API is disabled or not allowlisted for this project. ' +
            `Enable/request access first: ${activationUrl}`
        );
    } else {
        console.error('GBP review sync failed:', error.message || error);
    }
    process.exitCode = 1;
});
