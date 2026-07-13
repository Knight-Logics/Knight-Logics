'use strict';

/**
 * Keep serve.json rewrites in sync with vercel.json for local `npm run dev`.
 * Plain `serve` does not read vercel.json — only serve.json + cleanUrls.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const servePath = path.join(root, 'serve.json');
const serve = JSON.parse(fs.readFileSync(servePath, 'utf8'));

const htmlRewrites = (vercel.rewrites || [])
    .filter((r) => r.destination && r.destination.endsWith('.html') && !r.destination.includes('?'))
    .map((r) => ({ source: r.source, destination: r.destination }));

const bySource = new Map();
for (const r of htmlRewrites) {
    bySource.set(r.source, r);
}
serve.rewrites = [...bySource.values()].sort((a, b) => a.source.localeCompare(b.source));

if (!serve.rewrites.some((r) => r.source === '/service-local-seo')) {
    serve.rewrites.push({ source: '/service-local-seo', destination: '/service-local-seo.html' });
}
if (!serve.rewrites.some((r) => r.source === '/service-google-business-profile')) {
    serve.rewrites.push({ source: '/service-google-business-profile', destination: '/service-google-business-profile.html' });
}
if (!serve.rewrites.some((r) => r.source === '/remote-us-services')) {
    serve.rewrites.push({ source: '/remote-us-services', destination: '/remote-us-services.html' });
}

serve.rewrites.sort((a, b) => a.source.localeCompare(b.source));

fs.writeFileSync(servePath, JSON.stringify(serve, null, 2) + '\n', 'utf8');
console.log(`serve.json synced: ${serve.rewrites.length} html rewrites from vercel.json`);
