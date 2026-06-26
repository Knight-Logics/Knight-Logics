const https = require('https');
https.get('https://www.knightgroup.com/sitemap.xml', (r) => {
  let d = '';
  r.on('data', (c) => { d += c; });
  r.on('end', () => {
    const locs = [...d.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    console.log('total', locs.length);
    const groups = {};
    for (const u of locs) {
      const path = new URL(u).pathname.replace(/\/$/, '') || '/';
      const seg = path.split('/').filter(Boolean)[0] || 'root';
      groups[seg] = (groups[seg] || 0) + 1;
    }
    console.log(JSON.stringify(groups, null, 2));
    console.log('sample paths:', locs.slice(0, 12).map((u) => new URL(u).pathname));
  });
});
