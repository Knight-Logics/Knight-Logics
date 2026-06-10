'use strict';

const lib = require('../_lib/whistle-stop-social');

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || '';
  const cors = lib.getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }

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
};
