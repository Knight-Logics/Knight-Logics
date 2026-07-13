'use strict';

const socialLib = require('./_lib/whistle-stop-social');
const contentLib = require('./_lib/whistle-stop-content');
const campaignLib = require('./_lib/whistle-stop-campaigns');

function queryParam(req, name) {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    return url.searchParams.get(name) || '';
  } catch (_) {}
  const value = req.query?.[name];
  return Array.isArray(value) ? String(value[0] || '') : String(value || '');
}

function isContentRequest(req) {
  const url = String(req.url || '');
  if (url.includes('whistle-stop-content')) return true;
  return queryParam(req, 'service') === 'content';
}

function isCampaignRequest(req) {
  const url = String(req.url || '');
  if (url.includes('whistle-stop-campaigns')) return true;
  return queryParam(req, 'service') === 'campaigns';
}

function routeSegment(req, service) {
  const prefix = service === 'content'
    ? /^\/api\/whistle-stop-content\/?/
    : service === 'campaigns'
      ? /^\/api\/whistle-stop-campaigns\/?/
      : /^\/api\/whistle-stop-social\/?/;
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const parts = url.pathname.replace(prefix, '').split('/').filter(Boolean);
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

async function handleContent(req, res) {
  const cors = contentLib.getCorsHeaders(req.headers.origin || '');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }

  try {
    const route = routeSegment(req, 'content');

    if (route === 'health' || route === '') {
      if (req.method !== 'GET') {
        return contentLib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      return contentLib.sendJson(res, 200, contentLib.healthPayload(), cors);
    }

    if (route === 'status') {
      if (req.method !== 'GET') {
        return contentLib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      const version = queryParam(req, 'version');
      return contentLib.sendJson(res, 200, await contentLib.checkLiveStatus(version), cors);
    }

    if (route === 'publish') {
      if (req.method !== 'POST') {
        return contentLib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      const body = await contentLib.readJsonBody(req);
      const auth = contentLib.authorizePublish(req, body);
      if (!auth.ok) {
        return contentLib.sendJson(res, 401, { ok: false, error: auth.error }, cors);
      }
      delete body.adminPassword;
      const payload = await contentLib.handlePublish(body);
      return contentLib.sendJson(res, 200, payload, cors);
    }

    return contentLib.sendJson(res, 404, { ok: false, error: 'Not found' }, cors);
  } catch (err) {
    console.error('[whistle-stop-content] request failed', {
      route: routeSegment(req, 'content'),
      method: req.method,
      message: err.message || String(err),
    });
    return contentLib.sendJson(res, 400, { ok: false, error: err.message || 'Publish failed.' }, cors);
  }
}

module.exports = async function handler(req, res) {
  if (isContentRequest(req)) {
    return handleContent(req, res);
  }
  if (isCampaignRequest(req)) {
    return campaignLib.handle(req, res, routeSegment(req, 'campaigns'), contentLib);
  }

  try {
    const origin = req.headers.origin || '';
    const cors = socialLib.getCorsHeaders(origin);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, cors);
      return res.end();
    }

    const route = routeSegment(req, 'social');

    if (route === 'health' || route === '') {
      if (req.method !== 'GET') {
        return socialLib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      return socialLib.sendJson(
        res,
        200,
        {
          ok: true,
          service: 'whistle-stop-social-vercel',
          facebook: socialLib.fbConfigured(),
          x: socialLib.xConfigured(),
          demoMode: true,
        },
        cors
      );
    }

    if (route === 'platforms') {
      if (req.method !== 'GET') {
        return socialLib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      return socialLib.sendJson(res, 200, socialLib.getPlatformsPayload(), cors);
    }

    if (route === 'post') {
      if (req.method !== 'POST') {
        return socialLib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      try {
        const body = await socialLib.readJsonBody(req);
        const auth = socialLib.authorizePost(req, body);
        if (!auth.ok) {
          return socialLib.sendJson(res, 401, { ok: false, error: auth.error }, cors);
        }
        delete body.adminPassword;
        delete body.adminPasswordHash;
        const payload = await socialLib.handlePost(body);
        return socialLib.sendJson(res, 200, payload, cors);
      } catch (err) {
        console.error('[whistle-stop-social] post failed', {
          message: err.message || String(err),
          contentType: req.headers['content-type'] || null,
          contentLength: req.headers['content-length'] || null,
        });
        return socialLib.sendJson(
          res,
          400,
          {
            ok: false,
            error: err.message || String(err),
            debug: {
              route: 'post',
              contentType: req.headers['content-type'] || null,
              contentLength: req.headers['content-length'] || null,
            },
          },
          cors
        );
      }
    }

    if (route === 'history') {
      if (req.method !== 'GET') {
        return socialLib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      return socialLib.sendJson(
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

    return socialLib.sendJson(res, 404, { ok: false, error: 'Not found' }, cors);
  } catch (err) {
    return socialLib.sendJson(
      res,
      500,
      { ok: false, error: err.message || 'Internal server error' },
      socialLib.getCorsHeaders(req.headers.origin || '')
    );
  }
};
