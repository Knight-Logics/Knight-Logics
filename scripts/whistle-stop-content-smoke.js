'use strict';

const assert = require('assert');
const lib = require('../api/_lib/whistle-stop-content');

function testBuildContentFiles() {
  const bundle = {
    site: { business: { name: 'Whistle Stop Grill & Bar' } },
    events: { performances: [{ date: '2026-06-06', title: 'Matt Zitwer', startTime: '18:30' }] },
    menus: { sections: [] },
  };
  const built = lib.buildContentFiles(bundle);
  assert.ok(built.files.length >= 4, 'expected content files plus version marker');
  assert.deepStrictEqual(built.sections.sort(), ['events', 'menus', 'site']);
  assert.ok(built.versionId.startsWith('ws-'), 'version id should be generated');
  const eventsFile = built.files.find((file) => file.path === 'site/data/events.json');
  assert.ok(eventsFile, 'events file path should target repo site/data');
  assert.match(eventsFile.content, /Matt Zitwer/);
}

function testRewriteUploadRefs() {
  const uploadMap = new Map([['abc12345', 'assets/uploads/abc12345.webp']]);
  const rewritten = lib.rewriteUploadRefs(
    { hero: 'ws-upload:abc12345', nested: { image: 'assets/gallery/x.webp' } },
    uploadMap
  );
  assert.strictEqual(rewritten.hero, 'assets/uploads/abc12345.webp');
  assert.strictEqual(rewritten.nested.image, 'assets/gallery/x.webp');
}

function testAuthorizePublishPassword() {
  const previous = process.env.WS_ADMIN_PASSWORD_HASH;
  process.env.WS_ADMIN_PASSWORD_HASH = lib.sha256('test-password');
  try {
    const ok = lib.authorizePublish({ headers: {} }, { adminPassword: 'test-password' });
    assert.strictEqual(ok.ok, true);
    const bad = lib.authorizePublish({ headers: {} }, { adminPassword: 'wrong-password' });
    assert.strictEqual(bad.ok, false);
    const hashOnly = lib.authorizePublish({ headers: {} }, { adminPasswordHash: process.env.WS_ADMIN_PASSWORD_HASH });
    assert.strictEqual(hashOnly.ok, false, 'hash-only auth must not be accepted');
  } finally {
    if (previous === undefined) delete process.env.WS_ADMIN_PASSWORD_HASH;
    else process.env.WS_ADMIN_PASSWORD_HASH = previous;
  }
}

function run() {
  testBuildContentFiles();
  testRewriteUploadRefs();
  testAuthorizePublishPassword();
  console.log('whistle-stop-content smoke tests passed');
}

run();
