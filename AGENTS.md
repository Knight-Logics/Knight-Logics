# KnightLogics.com MainSite Agent Instructions

Last updated: 2026-05-30

These instructions apply to `E:\KnightLogics-Growth-System\MainSite`.

## Source Of Truth

- This folder is the only authoritative KnightLogics.com worktree.
- Branch: `main`
- Remote: `https://github.com/Knight-Logics/Nicholas-Knight-Development-Portfolio.git`
- Live host: `https://knightlogics.com`
- Vercel project: `knight-logics-checkout`
- Vercel project id: `prj_sHEs7MJlcpGO2gsYtnBES85EBd2h`
- Production trigger: push `origin/main` from this folder.

Do not edit from Downloads zips, detached deploy folders, or copied workspaces.

## Required Context

Before work, read:

1. `..\WORKSPACE-OPERATING-MANUAL.md`
2. `..\WORKSPACE-DOCUMENTATION-INDEX.md`
3. `docs\MAIN-SITE-MASTER.md`
4. `README.md`

For old exact wording, use `docs\archive\legacy-main-site-docs-2026-05-30.md`.

## Current Deployment Baseline

Most recent verified performance commit:

- `48e29fc fix: optimize landing hero performance`

Current active cache versions:

- `style.css?v=20260530perf1`
- `script.js?v=20260530perf1`
- `CircuitBrush3.webp?v=20260530perf1`
- `CircuitBrush3-mobile.webp?v=20260530perf1`
- `website-hero-mobile-optimized.webp?v=20260530hero1`

Verified live after deploy:

- Mobile Lighthouse performance `91`
- Accessibility `100`
- Best Practices `100`
- SEO `100`
- Small desktop-width mouse-wheel scroll exits the hero
- Desktop and mobile door assets load correctly

## Development Protocol

1. Run `git status -sb` first. This worktree often has unrelated dirty files.
2. Stage only intentional files. Do not use `git add .`.
3. Use local preview before frontend commits.
4. Validate visual changes with browser automation and screenshot inspection.
5. For hero/parallax/image changes, verify computed CSS URLs and actual network requests.
6. For JavaScript changes, run `node --check script.js`.
7. For performance changes, run Lighthouse locally or live.
8. After push, verify the live Vercel deployment with cache-busted HTML and asset-header checks.

## Hero And Parallax Rules

- The `CircuitBrush3` door image is intentional. It must fill the landing hero and stay pinned to the left/right edges.
- The center transparency is intentional.
- Do not remove the parallax/animation sequence unless explicitly requested.
- Mobile/tablet widths should use the mobile door asset.
- Desktop widths should use the optimized desktop door asset.
- If production appears stale, compare loaded HTML query strings, computed CSS background URLs, and asset response headers before assuming the wrong repo deployed.

## Documentation Rules

- `docs\MAIN-SITE-MASTER.md` is the site-specific current source of truth.
- `docs\archive\legacy-main-site-docs-2026-05-30.md` preserves the old separate Markdown files exactly.
- Do not add new standalone strategy Markdown files in the MainSite root.
- Generated audit outputs belong under `_sf_audit`, `_seo_audit`, `.qa-matrix`, or `test-results`, not in root docs.
- Dependency Markdown under `node_modules` or `.venv` is not project context.

## Cursor Cloud specific instructions

Cloud agents run on Linux with the repo at `/workspace` (the Windows paths above are the author's local machine; ignore them for pathing here). Dependencies are refreshed automatically by the startup update script (`npm install`), so you normally don't need to install anything.

Product: this repo is the KnightLogics.com marketing site — a static HTML/CSS/JS site plus Vercel serverless functions under `api/`.

- Static site (primary): `npm run dev` serves the site at `http://localhost:4183` and honors clean URLs via `serve.json` (test `/pricing`, not `/pricing.html`). It uses `npx serve`; the update script pre-warms the `serve` package so this starts non-interactively. If it ever prompts `Ok to proceed?`, the cache is cold — run `npx --yes serve --version` once, then retry.
- Full stack with API functions: `npm run dev:full` runs `npx vercel dev` (port 4199). This needs Vercel login plus Stripe/Neon/admin secrets and reaches external services (Stripe, Neon, Formspree), so it is not needed for static content/marketing work. Serverless handlers live in `api/` and `api/_lib/`.
- Tests: `npm run test:whistle-stop-content` (Node assert smoke test). There is no lint config; validate JS with `node --check <file>.js` (e.g. `node --check script.js`) per the Development Protocol.
- Forms on the site (contact/consultation) POST to external Formspree; do not submit them during testing to avoid sending real emails.
