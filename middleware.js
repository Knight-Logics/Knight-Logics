/**
 * Collapse known rename redirects into a single 308 hop.
 * With cleanUrls, /old.html → /old → /new becomes a 3-step chain that GSC
 * often reports as "Redirect error". Middleware runs first and jumps to final.
 */
const EXACT = new Map([
  ['/projects', '/service-websites'],
  ['/projects.html', '/service-websites'],
  ['/free-website-audit', '/website-growth-audit'],
  ['/free-website-audit.html', '/website-growth-audit'],
  ['/case-study-whistle-stop', '/case-study-hospitality-system-pattern'],
  ['/case-study-whistle-stop.html', '/case-study-hospitality-system-pattern'],
  ['/CRM-Management-System', '/service-websites'],
  ['/CRM-Management-System/index.html', '/service-websites'],
  ['/Employee-Management-System', '/service-websites'],
  ['/Employee-Management-System/index.html', '/service-websites'],
  ['/Project-Management-System', '/service-websites'],
  ['/Project-Management-System/index.html', '/service-websites'],
  ['/Ecommerce-Management-System', '/service-ecommerce'],
  ['/Ecommerce-Management-System/index.html', '/service-ecommerce'],
  ['/Invoice-Management-System', '/service-websites'],
  ['/Invoice-Management-System/index.html', '/service-websites'],
  ['/Chess-Game-main', '/service-websites'],
  ['/Chess-Game-main/index.html', '/service-websites'],
  ['/Tic-Tac-Toe', '/service-websites'],
  ['/Tic-Tac-Toe/index.html', '/service-websites'],
  ['/JavaScript-Tic-Tac-Toe-master', '/service-websites'],
  ['/JavaScript-Tic-Tac-Toe-master/index.html', '/service-websites']
]);

const PREFIXES = [
  ['/CRM-Management-System/', '/service-websites'],
  ['/Employee-Management-System/', '/service-websites'],
  ['/Project-Management-System/', '/service-websites'],
  ['/Ecommerce-Management-System/', '/service-ecommerce'],
  ['/Invoice-Management-System/', '/service-websites'],
  ['/Chess-Game-main/', '/service-websites'],
  ['/Tic-Tac-Toe/', '/service-websites'],
  ['/JavaScript-Tic-Tac-Toe-master/', '/service-websites']
];

export default function middleware(request) {
  const url = new URL(request.url);
  let path = url.pathname;
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  let dest = EXACT.get(path) || EXACT.get(`${path}/`);
  if (!dest) {
    for (const [prefix, target] of PREFIXES) {
      if (path === prefix.slice(0, -1) || path.startsWith(prefix)) {
        dest = target;
        break;
      }
    }
  }

  if (!dest) return;

  const target = new URL(dest, url.origin);
  target.search = url.search;
  return Response.redirect(target, 308);
}

export const config = {
  matcher: [
    '/projects',
    '/projects.html',
    '/free-website-audit',
    '/free-website-audit.html',
    '/case-study-whistle-stop',
    '/case-study-whistle-stop.html',
    '/CRM-Management-System',
    '/CRM-Management-System/:path*',
    '/Employee-Management-System',
    '/Employee-Management-System/:path*',
    '/Project-Management-System',
    '/Project-Management-System/:path*',
    '/Ecommerce-Management-System',
    '/Ecommerce-Management-System/:path*',
    '/Invoice-Management-System',
    '/Invoice-Management-System/:path*',
    '/Chess-Game-main',
    '/Chess-Game-main/:path*',
    '/Tic-Tac-Toe',
    '/Tic-Tac-Toe/:path*',
    '/JavaScript-Tic-Tac-Toe-master',
    '/JavaScript-Tic-Tac-Toe-master/:path*'
  ]
};
