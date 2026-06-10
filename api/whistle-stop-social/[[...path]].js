'use strict';

const lib = require('../_lib/whistle-stop-social');

function routeSegment(req) {
  const segments = req.query.path;
  if (Array.isArray(segments)) return segments[0] || '';
  if (typeof segments === 'string') return segments;
  return '';
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const cors = lib.getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }

  const route = routeSegment(req);

  if (route === 'health' || route === '') {
    if (req.method !== 'GET') {
      return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
    }
    return lib.sendJson(
      res,
      200,
      {
        ok: true,
        service: 'whistle-stop-social-vercel',
        facebook: lib.fbConfigured(),
        x: lib.xConfigured(),
        demoMode: true,
      },
      cors
    );
  }

  if (route === 'platforms') {
    if (req.method !== 'GET') {
      return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
    }
    return lib.sendJson(res, 200, lib.getPlatformsPayload(), cors);
  }

  if (route === 'post') {
    if (req.method !== 'POST') {
      return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
    }
    const auth = lib.authorizePost(req);
    if (!auth.ok) {
      return lib.sendJson(res, 401, { ok: false, error: auth.error }, cors);
    }
    try {
      const body = await lib.readJsonBody(req);
      const payload = await lib.handlePost(body);
      return lib.sendJson(res, 200, payload, cors);
    } catch (err) {
      return lib.sendJson(res, 400, { ok: false, error: err.message || String(err) }, cors);
    }
  }

  if (route === 'history') {
    if (req.method !== 'GET') {
      return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
    }
    return lib.sendJson(
      res,
      200,
      {
        ok: true,
        history: [],
        note: 'Post history is stored in the staff browser (localStorage) on the Vercel bridge.',
      },
      cors
    );
  }

  return lib.sendJson(res, 404, { ok: false, error: 'Not found' }, cors);
};
