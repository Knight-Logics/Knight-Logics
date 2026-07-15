'use strict';

const assert = require('assert');

const pixelforge = require('../api/_lib/pixelforge-license');
const autovid = require('../api/autovid-license');

for (const [name, isAllowedOrigin] of [
    ['PixelForge', pixelforge._test.isAllowedOrigin],
    ['AutoVid', autovid._test.isAllowedOrigin]
]) {
    assert.strictEqual(isAllowedOrigin(''), true, `${name} must allow native desktop requests without Origin`);
    assert.strictEqual(isAllowedOrigin('https://knightlogics.com'), true, `${name} must allow the production site`);
    assert.strictEqual(isAllowedOrigin('https://www.knightlogics.com'), true, `${name} must allow the www site`);
    assert.strictEqual(isAllowedOrigin('http://127.0.0.1:4180'), true, `${name} must allow loopback development`);
    assert.strictEqual(isAllowedOrigin('http://localhost:49152'), true, `${name} must allow localhost development`);
    assert.strictEqual(isAllowedOrigin('https://attacker.example'), false, `${name} must reject untrusted browser origins`);
    assert.strictEqual(isAllowedOrigin('http://knightlogics.com'), false, `${name} must reject insecure production origins`);
}

console.log('Desktop license CORS smoke checks passed.');
