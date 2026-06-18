'use strict';

const crypto = require('crypto');

const DEFAULT_REPO = 'Knight-Logics/Whistle-Stop';
const DEFAULT_BRANCH = 'master';
const DEFAULT_LIVE_VERSION_URL = 'https://knight-logics.github.io/Whistle-Stop/data/content-version.json';
const MAX_BODY_BYTES = 12 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_SECTIONS = {
  site: 'site/data/site.json',
  events: 'site/data/events.json',
  menus: 'site/data/menus.json',
  reviews: 'site/data/reviews.json',
  promos: 'site/data/promos.json',
};

const ALLOWED_ORIGINS = new Set([
  'https://knight-logics.github.io',
  'https://knightlogics.com',
  'https://www.knightlogics.com',
  'http://127.0.0.1:3456',
  'http://localhost:3456',
  'http://127.0.0.1:3457',
  'http://localhost:3457',
  'http://127.0.0.1:8771',
  'http://localhost:8771',
  'http://127.0.0.1:8080',
  'http://localhost:8080',
  'http://127.0.0.1:4178',
  'http://localhost:4178',
]);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (/^http:\/\/(127\.0\.0\.1|localhost):\d+$/i.test(origin)) return true;
  if (/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/i.test(origin)) return true;
  return false;
}

function getCorsHeaders(origin) {
  const allowed = isAllowedOrigin(origin) ? origin : 'https://knight-logics.github.io';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-WS-Publish-Key',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function sendJson(res, status, body, corsHeaders) {
  res.writeHead(status, {
    ...corsHeaders,
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  if (typeof req.rawBody === 'string') return Buffer.from(req.rawBody);
  if (req.rawBody instanceof Uint8Array) return Buffer.from(req.rawBody);
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  if (req.body instanceof Uint8Array) return Buffer.from(req.body);
  if (req.body && typeof req.body === 'object') return Buffer.from(JSON.stringify(req.body), 'utf8');

  const chunks = [];
  let totalBytes = 0;
  await new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      const normalized = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += normalized.length;
      if (totalBytes > MAX_BODY_BYTES) {
        reject(new Error(`Request body too large (${Math.round(MAX_BODY_BYTES / (1024 * 1024))} MB max).`));
        req.destroy();
        return;
      }
      chunks.push(normalized);
    });
    req.on('end', resolve);
    req.on('error', reject);
  });
  return Buffer.concat(chunks);
}

async function readJsonBody(req) {
  const raw = await readRawBody(req);
  if (!raw.length) throw new Error('Request body is empty.');
  if (raw.length > MAX_BODY_BYTES) {
    throw new Error(`Request body too large (${Math.round(MAX_BODY_BYTES / (1024 * 1024))} MB max).`);
  }
  try {
    return JSON.parse(raw.toString('utf8'));
  } catch {
    throw new Error('Invalid JSON request body.');
  }
}

function sha256(text) {
  return crypto.createHash('sha256').update(String(text), 'utf8').digest('hex');
}

function timingSafeEqualString(a, b) {
  const left = Buffer.from(String(a || ''), 'utf8');
  const right = Buffer.from(String(b || ''), 'utf8');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

  function authorizePublish(req, body = {}) {
  const headers = req?.headers || {};
  const publishKey = process.env.WS_CONTENT_PUBLISH_KEY;
  const headerKey = headers['x-ws-publish-key'] || headers['X-WS-Publish-Key'];
  if (publishKey && headerKey && timingSafeEqualString(headerKey, publishKey)) {
    return { ok: true, method: 'publish-key' };
  }

  const expectedHash = process.env.WS_ADMIN_PASSWORD_HASH;
  if (!expectedHash) {
    return { ok: false, error: 'Publish auth is not configured on Vercel (WS_ADMIN_PASSWORD_HASH).' };
  }

  const password = typeof body.adminPassword === 'string' ? body.adminPassword : '';
  if (!password || password.length > 256) {
    return { ok: false, error: 'Enter the admin password to publish live.' };
  }

  if (timingSafeEqualString(sha256(password), expectedHash)) {
    return { ok: true, method: 'admin-password' };
  }

  return { ok: false, error: 'Admin password is incorrect.' };
}

function safeJsonClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validatePlainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object.`);
  }
}

function safeUploadId(id) {
  const normalized = String(id || '').trim();
  if (!/^[a-zA-Z0-9_-]{8,90}$/.test(normalized)) {
    throw new Error('Upload id is invalid.');
  }
  return normalized;
}

function extensionForUpload(item) {
  const name = String(item.name || '').toLowerCase();
  const mime = String(item.mime || '').toLowerCase();
  if (mime === 'image/jpeg' || /\.(jpe?g)$/.test(name)) return 'jpg';
  if (mime === 'image/png' || /\.png$/.test(name)) return 'png';
  if (mime === 'image/webp' || /\.webp$/.test(name)) return 'webp';
  if (mime === 'image/gif' || /\.gif$/.test(name)) return 'gif';
  if (mime === 'video/mp4' || /\.mp4$/.test(name)) return 'mp4';
  if (mime === 'video/webm' || /\.webm$/.test(name)) return 'webm';
  throw new Error(`Unsupported upload type: ${item.mime || item.name || 'unknown'}`);
}

function rewriteUploadRefs(value, uploadMap) {
  if (typeof value === 'string') {
    const match = value.match(/^ws-upload:(.+)$/);
    return match ? uploadMap.get(match[1]) || value : value;
  }
  if (Array.isArray(value)) return value.map((item) => rewriteUploadRefs(item, uploadMap));
  if (value && typeof value === 'object') {
    const out = {};
    Object.entries(value).forEach(([key, child]) => {
      out[key] = rewriteUploadRefs(child, uploadMap);
    });
    return out;
  }
  return value;
}

function buildUploadFiles(mediaUploads = []) {
  if (!Array.isArray(mediaUploads)) throw new Error('mediaUploads must be an array.');

  const files = [];
  const uploadMap = new Map();
  let totalBytes = 0;

  mediaUploads.forEach((item) => {
    validatePlainObject(item, 'mediaUploads item');
    const id = safeUploadId(item.id);
    const dataBase64 = String(item.dataBase64 || '');
    const bytes = Math.floor((dataBase64.length * 3) / 4);
    if (!dataBase64 || bytes <= 0) throw new Error(`Upload ${id} is empty.`);
    if (bytes > MAX_UPLOAD_BYTES) throw new Error(`Upload ${item.name || id} is too large.`);
    totalBytes += bytes;
    if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) throw new Error('Total uploaded media is too large for one publish.');

    const ext = extensionForUpload(item);
    const publicPath = `assets/uploads/${id}.${ext}`;
    uploadMap.set(id, publicPath);
    files.push({
      path: `site/${publicPath}`,
      contentBase64: dataBase64,
      encoding: 'base64',
    });
  });

  return { files, uploadMap };
}

function buildContentFiles(bundle, meta = {}) {
  validatePlainObject(bundle, 'bundle');
  const { files: uploadFiles, uploadMap } = buildUploadFiles(bundle.mediaUploads || []);
  const files = [...uploadFiles];
  const sections = [];

  Object.entries(ALLOWED_SECTIONS).forEach(([section, path]) => {
    if (!bundle[section]) return;
    validatePlainObject(bundle[section], section);
    const rewritten = rewriteUploadRefs(safeJsonClone(bundle[section]), uploadMap);
    files.push({
      path,
      content: `${JSON.stringify(rewritten, null, 2)}\n`,
      encoding: 'utf-8',
    });
    sections.push(section);
  });

  if (!sections.length) throw new Error('No publishable content sections were provided.');

  const publishedAt = new Date().toISOString();
  const versionId = meta.versionId || `ws-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  files.push({
    path: 'site/data/content-version.json',
    content: `${JSON.stringify(
      {
        versionId,
        publishedAt,
        sections,
        uploadCount: uploadFiles.length,
        source: 'knightlogics-content-bridge',
      },
      null,
      2
    )}\n`,
    encoding: 'utf-8',
  });

  return { files, sections, versionId, publishedAt, uploadCount: uploadFiles.length };
}

function getRepoConfig() {
  const repo = process.env.WS_CONTENT_REPO || DEFAULT_REPO;
  const [owner, name] = repo.split('/');
  if (!owner || !name) throw new Error('WS_CONTENT_REPO must be owner/repo.');
  return {
    owner,
    name,
    branch: process.env.WS_CONTENT_BRANCH || DEFAULT_BRANCH,
    token: process.env.WS_CONTENT_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '',
  };
}

async function githubRequest(config, path, options = {}) {
  if (!config.token) throw new Error('GitHub publishing token is not configured (WS_CONTENT_GITHUB_TOKEN).');
  const res = await fetch(`https://api.github.com/repos/${config.owner}/${config.name}/${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {}

  if (!res.ok) {
    const message = data?.message || `GitHub API ${res.status}`;
    throw new Error(`GitHub publish failed: ${message}`);
  }

  return data;
}

async function publishFilesToGitHub(files, message) {
  const config = getRepoConfig();
  const ref = await githubRequest(config, `git/ref/heads/${encodeURIComponent(config.branch)}`);
  const headSha = ref.object?.sha;
  if (!headSha) throw new Error('Could not read current GitHub branch head.');

  const headCommit = await githubRequest(config, `git/commits/${headSha}`);
  const baseTree = headCommit.tree?.sha;
  if (!baseTree) throw new Error('Could not read current GitHub tree.');

  const tree = [];
  for (const file of files) {
    const blob = await githubRequest(config, 'git/blobs', {
      method: 'POST',
      body: JSON.stringify({
        content: file.encoding === 'base64' ? file.contentBase64 : file.content,
        encoding: file.encoding === 'base64' ? 'base64' : 'utf-8',
      }),
    });
    tree.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    });
  }

  const newTree = await githubRequest(config, 'git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTree, tree }),
  });

  const commit = await githubRequest(config, 'git/commits', {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [headSha],
    }),
  });

  await githubRequest(config, `git/refs/heads/${encodeURIComponent(config.branch)}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  });

  return {
    commitSha: commit.sha,
    branch: config.branch,
    repo: `${config.owner}/${config.name}`,
  };
}

async function handlePublish(body) {
  const bundle = body.bundle || body;
  const sourceTab = String(body.source?.tab || '').trim();
  const built = buildContentFiles(bundle);
  const label = sourceTab ? ` from ${sourceTab}` : '';
  const message = `Publish Whistle Stop content${label} (${built.versionId})`;
  const git = await publishFilesToGitHub(built.files, message);

  return {
    ok: true,
    versionId: built.versionId,
    publishedAt: built.publishedAt,
    sections: built.sections,
    uploadCount: built.uploadCount,
    filesChanged: built.files.map((file) => file.path),
    commitSha: git.commitSha,
    repo: git.repo,
    branch: git.branch,
    pagesUrl: 'https://knight-logics.github.io/Whistle-Stop/',
    statusUrl: `/api/whistle-stop-content/status?version=${encodeURIComponent(built.versionId)}`,
    message: 'Published to GitHub. GitHub Pages should update after the deploy finishes.',
  };
}

async function checkLiveStatus(versionId) {
  const liveUrl = process.env.WS_CONTENT_LIVE_VERSION_URL || DEFAULT_LIVE_VERSION_URL;
  const url = `${liveUrl}${liveUrl.includes('?') ? '&' : '?'}_=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return { ok: true, live: false, status: res.status, versionId, liveVersionId: null, liveUrl };
    }
    const data = await res.json();
    return {
      ok: true,
      live: Boolean(versionId && data.versionId === versionId),
      versionId,
      liveVersionId: data.versionId || null,
      publishedAt: data.publishedAt || null,
      liveUrl,
    };
  } catch (err) {
    return { ok: true, live: false, versionId, liveVersionId: null, liveUrl, error: err.message || String(err) };
  }
}

function healthPayload() {
  const config = (() => {
    try {
      return getRepoConfig();
    } catch {
      return { owner: '', name: '', branch: process.env.WS_CONTENT_BRANCH || DEFAULT_BRANCH, token: '' };
    }
  })();
  return {
    ok: true,
    service: 'whistle-stop-content-publisher',
    repo: config.owner && config.name ? `${config.owner}/${config.name}` : process.env.WS_CONTENT_REPO || DEFAULT_REPO,
    branch: config.branch,
    githubTokenConfigured: Boolean(config.token),
    adminPasswordConfigured: Boolean(process.env.WS_ADMIN_PASSWORD_HASH),
    publishKeyConfigured: Boolean(process.env.WS_CONTENT_PUBLISH_KEY),
    allowedSections: Object.keys(ALLOWED_SECTIONS),
  };
}

module.exports = {
  getCorsHeaders,
  sendJson,
  readJsonBody,
  authorizePublish,
  handlePublish,
  checkLiveStatus,
  healthPayload,
  buildContentFiles,
  rewriteUploadRefs,
  sha256,
};
