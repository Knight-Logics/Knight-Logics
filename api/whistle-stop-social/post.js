'use strict';

const lib = require('../_lib/whistle-stop-social');

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const cors = lib.getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }

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
};
