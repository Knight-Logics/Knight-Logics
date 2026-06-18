'use strict';

const lib = require('./_lib/whistle-stop-content');

function routeSegment(req) {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const parts = url.pathname.replace(/^\/api\/whistle-stop-content\/?/, '').split('/').filter(Boolean);
    if (parts[0]) return parts[0];
    const fromSearch = url.searchParams.get('route');
    if (fromSearch) return fromSearch.split('/')[0];
  } catch (_) {}

  const query = req.query || {};
  const q = query.route;
  if (typeof q === 'string' && q) return q.split('/')[0];
  if (Array.isArray(q) && q[0]) return String(q[0]).split('/')[0];
  return 'health';
}

function queryParam(req, name) {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    return url.searchParams.get(name) || '';
  } catch (_) {}
  const value = req.query?.[name];
  return Array.isArray(value) ? String(value[0] || '') : String(value || '');
}

module.exports = async function handler(req, res) {
  const cors = lib.getCorsHeaders(req.headers.origin || '');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }

  try {
    const route = routeSegment(req);

    if (route === 'health' || route === '') {
      if (req.method !== 'GET') {
        return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      return lib.sendJson(res, 200, lib.healthPayload(), cors);
    }

    if (route === 'status') {
      if (req.method !== 'GET') {
        return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      const version = queryParam(req, 'version');
      return lib.sendJson(res, 200, await lib.checkLiveStatus(version), cors);
    }

    if (route === 'publish') {
      if (req.method !== 'POST') {
        return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      const body = await lib.readJsonBody(req);
      const auth = lib.authorizePublish(req, body);
      if (!auth.ok) {
        return lib.sendJson(res, 401, { ok: false, error: auth.error }, cors);
      }
      delete body.adminPassword;
      const payload = await lib.handlePublish(body);
      return lib.sendJson(res, 200, payload, cors);
    }

    return lib.sendJson(res, 404, { ok: false, error: 'Not found' }, cors);
  } catch (err) {
    console.error('[whistle-stop-content] request failed', {
      route: routeSegment(req),
      method: req.method,
      message: err.message || String(err),
    });
    return lib.sendJson(res, 400, { ok: false, error: err.message || 'Publish failed.' }, cors);
  }
};
