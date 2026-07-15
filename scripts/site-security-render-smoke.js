'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const baseUrl = String(process.argv[2] || 'http://127.0.0.1:4199').replace(/\/$/, '');
const outputDir = path.resolve(process.argv[3] || path.join(process.cwd(), 'security-render-output'));

const routes = [
    { path: '/', screenshot: 'homepage-security.png', expectVideo: false },
    { path: '/pixelforge-ai', screenshot: 'pixelforge-security.png', expectVideo: true }
];

async function verifyCors(endpoint) {
    const attacker = await fetch(`${baseUrl}${endpoint}`, {
        method: 'OPTIONS',
        headers: { Origin: 'https://attacker.example' }
    });
    assert.strictEqual(attacker.status, 403, `${endpoint} must reject untrusted browser origins`);
    assert.strictEqual(attacker.headers.get('access-control-allow-origin'), null);

    const trusted = await fetch(`${baseUrl}${endpoint}`, {
        method: 'OPTIONS',
        headers: { Origin: 'https://knightlogics.com' }
    });
    assert.strictEqual(trusted.status, 200, `${endpoint} must allow the production site`);
    assert.strictEqual(trusted.headers.get('access-control-allow-origin'), 'https://knightlogics.com');

    const desktop = await fetch(`${baseUrl}${endpoint}`, { method: 'OPTIONS' });
    assert.strictEqual(desktop.status, 200, `${endpoint} must allow native desktop requests without Origin`);
    assert.strictEqual(desktop.headers.get('access-control-allow-origin'), null);
}

async function main() {
    fs.mkdirSync(outputDir, { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const failures = [];

    try {
        for (const route of routes) {
            const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
            const consoleErrors = [];
            const requestFailures = [];
            page.on('console', (message) => {
                if (message.type() === 'error') consoleErrors.push(message.text());
            });
            page.on('requestfailed', (request) => {
                const failure = request.failure();
                requestFailures.push({
                    error: failure ? failure.errorText : 'failed',
                    resourceType: request.resourceType(),
                    url: request.url()
                });
            });

            const response = await page.goto(`${baseUrl}${route.path}`, {
                waitUntil: 'domcontentloaded',
                timeout: 45000
            });
            assert(response, `No response for ${route.path}`);
            assert.strictEqual(response.status(), 200, `${route.path} must return HTTP 200`);
            const csp = response.headers()['content-security-policy'] || '';
            assert(csp.includes("default-src 'self'"), `${route.path} must send the enforced CSP`);
            await page.locator('h1').first().waitFor({ state: 'visible', timeout: 15000 });

            if (route.expectVideo) {
                assert((await page.locator('iframe[src*="youtube"]').count()) >= 1, 'PixelForge page video embed is missing');
            }

            await page.screenshot({
                path: path.join(outputDir, route.screenshot),
                fullPage: false
            });

            const cspErrors = consoleErrors.filter((message) => /content security policy|refused to (?:load|connect|frame|execute)/i.test(message));
            if (cspErrors.length) failures.push(`${route.path} CSP console errors:\n${cspErrors.join('\n')}`);
            const sameOriginFailures = requestFailures.filter((failure) =>
                failure.url.startsWith(baseUrl)
                && !(failure.resourceType === 'media' && failure.error === 'net::ERR_ABORTED')
            );
            if (sameOriginFailures.length) {
                failures.push(`${route.path} same-origin request failures:\n${sameOriginFailures.map((failure) =>
                    `${failure.url} :: ${failure.resourceType} :: ${failure.error}`
                ).join('\n')}`);
            }
            await page.close();
        }

        await verifyCors('/api/pixelforge-license');
        await verifyCors('/api/autovid-license');
    } finally {
        await browser.close();
    }

    assert.deepStrictEqual(failures, []);
    console.log(`Security render smoke passed. Screenshots: ${outputDir}`);
}

main().catch((error) => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
});
