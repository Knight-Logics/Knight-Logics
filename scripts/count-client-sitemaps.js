const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        return fetch(new URL(r.headers.location, url).href).then(resolve).catch(reject);
      }
      let d = '';
      r.on('data', (c) => { d += c; });
      r.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function count(url) {
  const xml = await fetch(url);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return { url, count: locs.length, sample: locs.slice(0, 5) };
}

(async () => {
  const urls = [
    'https://www.knightgroup.com/sitemap.xml',
    'https://faithworksclearing.com/sitemap.xml',
    'https://screenteamllc.com/sitemap.xml'
  ];
  for (const u of urls) {
    try {
      const r = await count(u);
      console.log(JSON.stringify(r, null, 2));
    } catch (e) {
      console.error(u, e.message);
    }
  }
})();
