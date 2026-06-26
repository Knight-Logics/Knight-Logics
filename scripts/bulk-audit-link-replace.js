const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skip = new Set(['free-website-audit.html']);
let n = 0;

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name.startsWith('_') || ent.name === 'node_modules' || ent.name === '.qa') continue;
      walk(p);
    } else if (ent.name.endsWith('.html') && !skip.has(ent.name)) {
      let c = fs.readFileSync(p, 'utf8');
      const o = c;
      c = c.split('/free-website-audit').join('/website-growth-audit');
      if (c !== o) {
        fs.writeFileSync(p, c, 'utf8');
        n++;
      }
    }
  }
}

walk(root);
console.log('Updated', n, 'HTML files');
