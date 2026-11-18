# Knight Logics API Worker

The public site stays on GitHub Pages (`pages-static`) behind Cloudflare. Pages cannot run `api/`. This Worker serves `knightlogics.com/api/*` with the existing checkout, invoice, referral, and desktop-license handlers. It is not deployed by pushing `pages-static`.

Nothing in this folder is live until Nick completes the checklist below. The route block in `wrangler.jsonc` is commented out on purpose, so a deploy cannot attach the Worker to the domain until that block is uncommented. Do not change DNS.

## Why this shape

- Pages keeps HTML, CSS, and images. The Worker only answers `/api/*`.
- Handlers are the existing `api/` modules, including the $39–$299 audit catalog and the invoice amount the buyer enters. Prices are not copied into a second table.
- Stripe is constructed with `Stripe.createFetchHttpClient()` so the SDK runs on Workers.
- License balances, referral rows, and paid-session credits already live in the Neon database (`KL_DATABASE_URL`). A new D1 or KV namespace would not see those balances, so this Worker does not bind either. Checkout and invoice pay still create Stripe sessions when the database secret is unset. License routes then return 503 until `KL_DATABASE_URL` is set.
- `POST /api/knight-account`, `POST /api/knight-account/*`, `POST /api/pixelforge-license`, and the Display Control+ `/api/licenses/{health,create-checkout-session,confirm-session,restore,create-portal-session,stripe-webhook}` paths are not implemented here. They are forwarded, method and body unchanged, to the service binding `KNIGHT_ACCOUNT` (Worker name `knight-account-api`, [knight-account-api#1](https://github.com/Knight-Logics/knight-account-api/pull/1)). That Worker owns the D1 ledger. This Worker does not bind D1 or KV.
- `POST /api/autovid-license` stays here. Shipped Auto Vid still sends `consume`, `activate_license`, and `license_key` to the Neon handler. Do not forward that path.
- `POST /api/stripe-webhook` stays here for site checkout, invoices, referrals, and Auto Vid. Knight Account and Display Control+ webhooks are the forwarded paths `/api/knight-account/stripe-webhook` and `/api/licenses/stripe-webhook`.
- Buy buttons call `GET /api/health`. They open checkout only when the JSON says `"ok": true` and `"checkout": true` (`checkout` is true only when a Stripe secret is present). Otherwise the buttons stay on “Contact to Get Started”, and Pay Invoice shows “Contact Us”. `knightAccount: true` means the service binding is present. It does not turn buy buttons on by itself.

## Routes

| Path | Handler |
| --- | --- |
| `GET /api/health` | Worker. `{ ok, checkout, database }` |
| `POST /api/service-checkout` | Audit and instant-package Checkout |
| `POST /api/service-orders` | Fulfillment status updates |
| `GET /api/service-status` | Buyer order status |
| `POST /api/service-delivery` | Deliverable download |
| `POST /api/create-checkout-session` | Website package Checkout |
| `POST /api/pay-invoice` | Invoice Checkout |
| `POST /api/stripe-webhook` | Signed Stripe events for this site (not Knight Account) |
| `POST /api/autovid-license` | Auto Video Compiler license (Neon) |
| `POST /api/referral-event` and the other `/api/referral-*` routes | Existing referral handlers |
| `/api/knight-account` and `/api/knight-account/*` | Forwarded to `env.KNIGHT_ACCOUNT` |
| `POST /api/pixelforge-license` | Forwarded to `env.KNIGHT_ACCOUNT` |
| `GET /api/licenses/health` | Forwarded to `env.KNIGHT_ACCOUNT` |
| `POST /api/licenses/create-checkout-session` | Forwarded to `env.KNIGHT_ACCOUNT` |
| `POST /api/licenses/confirm-session` | Forwarded to `env.KNIGHT_ACCOUNT` |
| `POST /api/licenses/restore` | Forwarded to `env.KNIGHT_ACCOUNT` |
| `POST /api/licenses/create-portal-session` | Forwarded to `env.KNIGHT_ACCOUNT` |
| `POST /api/licenses/stripe-webhook` | Forwarded to `env.KNIGHT_ACCOUNT` |

The binding in `wrangler.jsonc`:

```jsonc
"services": [
  { "binding": "KNIGHT_ACCOUNT", "service": "knight-account-api" }
]
```

If `KNIGHT_ACCOUNT` is missing at runtime, those paths return 503 `{ "ok": false, "error": "Knight Account service is not bound." }`. They do not fall through to the old Neon PixelForge handler. Deploy `knight-account-api` before relying on them. A missing binding does not affect audit checkout, invoice pay, or `/api/autovid-license`.

`/api/package-intake-upload` is not mounted. Multipart upload depends on Node `busboy`, and the audit and invoice flows do not use it.

## Secret names

Set these with `npx wrangler secret put <NAME>` from this directory. Wrangler prompts for the value. Do not put values in `wrangler.jsonc`, shell history you commit, or this file.

Required before buy buttons and Checkout:

- `STRIPE_SECRET_KEY` — Stripe secret key. Use an `sk_test_...` key until the test plan passes. `STRIPE_API_KEY` is accepted as an alias if you already have that name.

Required before webhooks can credit a payment:

- `STRIPE_WEBHOOK_SECRET` — signing secret for the endpoint (`whsec_...`).

Required before PixelForge, Auto Video Compiler, order status, or referral storage works:

- `KL_DATABASE_URL` — existing Neon Postgres connection string (the free `pixelforge-billing` database). `DATABASE_URL` is accepted as an alias.

Optional:

- `FORMSPREE_ENDPOINT` — intake and invoice notification. The code already has a default endpoint; set this only to replace it.
- `CHECKOUT_ALLOWED_ORIGINS` — comma-separated extra browser origins. `https://knightlogics.com` and `https://www.knightlogics.com` are already allowed.
- `AUTONOMOUS_ORDER_API_SECRET` — bearer secret for the audit fulfillment worker. `AUTONOMOUS_WORKER_SECRET` is an alias.
- `KL_ADMIN_SECRET` — referral admin.
- `KL_OWNER_SECRET` — referral admin owner actions.
- `KL_VERIFY_SALT` — referral verification salt.
- `PIXELFORGE_PRO_LIFETIME_PRICE_CENTS` — leave unset. Setting it turns on a lifetime price that is intentionally disabled.

Local `wrangler dev` reads `worker/.dev.vars` (gitignored). Copy `.dev.vars.example` and fill test values there. Do not commit that file.

## Local commands

From the repository root, production dependencies must be installed (`npm ci`). From `worker/`:

```bash
npm install
npm test
npx wrangler dev --port 8787
```

`npm test` mocks Stripe and does not call Stripe or Neon. `wrangler dev` is local only.

A static preview that serves the site and this Worker together:

```bash
node worker/preview.mjs
```

Open `http://127.0.0.1:4173/website-health-audit.html`. That preview mocks Stripe unless `PREVIEW_LIVE_STRIPE=1` and a real `sk_test_` key are set. It does not deploy.

## Stripe test plan

Use test mode for the whole pass. The card is `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP. Do not use a live key and do not use a real card.

1. Put the test secret in `.dev.vars` or `wrangler secret put STRIPE_SECRET_KEY` on a workers.dev deploy whose routes are still commented out.
2. `curl -sS http://127.0.0.1:8787/api/health` returns `"checkout": true`.
3. On a product page, the button text changes from “Contact to Get Started” to “Buy now — $39” (or the matching $49 / $79 / $99 / $299 label). Submitting the modal redirects to Checkout.
4. The Checkout page shows the catalog amount, not a different one: Health $39, white-label $49, local opportunity $49, AI search readiness $79, conversion leak $99, full-access $299. Invoice pay shows the amount you typed.
5. Complete the test payment. Stripe must show a test-mode payment.
6. Forward webhooks with the Stripe CLI: `stripe listen --forward-to localhost:8787/api/stripe-webhook`. Put the CLI’s `whsec_` value in `STRIPE_WEBHOOK_SECRET`, and set `KL_DATABASE_URL` to the existing Neon database. Trigger `checkout.session.completed` and confirm the event returns 200.
7. Desktop smoke, still in test mode, after `knight-account-api` is bound: `POST /api/pixelforge-license` and `POST /api/knight-account` with a Knight Account `register_or_login` or `status` body. Both must return that Worker's payload (`token`, `free_trial_remaining`), not 404 and not the old Neon `pro_active` shape. `GET /api/licenses/health` must be that Worker's health, not 404. `POST /api/autovid-license` with `{"action":"status","machine_id":"<64 hex chars>"}` must still be this Worker's Neon payload (`free_used`, `license_key`), and it must not be forwarded. Then start checkout for an Auto Vid pack ($5 for 5 credits, $10 for 12, or $10/mo) and confirm the amount. PixelForge pack checkout (12 credits / $5, 30 / $10, 72 / $20) is created by `knight-account-api`, not by this Worker.
8. Only after those checks, repeat one $39 purchase and one desktop pack with live keys. That is a secret change, not a code change.

## Go-live checklist for Nick

1. Confirm the Cloudflare zone for `knightlogics.com` is already proxied. Do not add or edit DNS records.
2. Stay on the Workers Free plan. Do not add D1, KV, or a new paid database. Reuse the existing Neon free database via `KL_DATABASE_URL`.
3. From `worker/`, install dependencies and run `npm test`.
4. `npx wrangler login` with the Cloudflare account that already owns the zone. Do not paste the token into the repo.
5. `npx wrangler secret put STRIPE_SECRET_KEY` with the **test** secret.
6. `npx wrangler secret put STRIPE_WEBHOOK_SECRET` with the **test** webhook secret.
7. `npx wrangler secret put KL_DATABASE_URL` with the existing Neon URL.
8. Set any optional secrets you still use (`KL_ADMIN_SECRET`, `KL_OWNER_SECRET`, `KL_VERIFY_SALT`, `AUTONOMOUS_ORDER_API_SECRET`).
9. Deploy `knight-account-api` first (its own `DEPLOY.md`). This Worker's `services` entry binds `KNIGHT_ACCOUNT` to the Worker name `knight-account-api`. Leave the `routes` block in `wrangler.jsonc` commented out. `npx wrangler deploy` then publishes only the `*.workers.dev` hostname and does not attach `knightlogics.com`.
10. Open `https://<worker>.workers.dev/api/health` and confirm `"checkout": true`. Run the Stripe test plan against that host by overriding the desktop app’s API base, or against `wrangler dev`.
11. In Stripe, test mode, add the webhook endpoint `https://knightlogics.com/api/stripe-webhook` only after step 12. Until the route exists, point the test webhook at the workers.dev URL.
12. Uncomment the two `routes` entries in `wrangler.jsonc` (`knightlogics.com/api/*` and `www.knightlogics.com/api/*`, both `zone_name` `knightlogics.com`).
13. `npx wrangler deploy` again. This attaches `/api/*` only. HTML still comes from GitHub Pages.
14. Confirm `https://knightlogics.com/api/health` and `https://www.knightlogics.com/api/health`. Then load `/website-health-audit` and `/pay-invoice` and buy or pay with the test card.
15. Merge the Pages PR so the buy-button script and the Auto Video Compiler download link are what Pages serves. The Worker and the Pages branch are separate publishes: the buttons keep saying “Contact to Get Started” until both this Worker route is live **and** Pages has the new script.
16. Replace the test secrets with live `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` only after the test purchase looks right. `wrangler secret put` deploys a new version immediately.
17. Rollback: comment the routes out and deploy again, or `npx wrangler rollback`. Pages falls back to contact text as soon as `/api/health` stops returning `"checkout": true`.

## Auto Video Compiler download

The product page and homepage point at:

`https://github.com/Knight-Logics/Auto-Video-Editor-and-Compiler/releases/latest/download/Auto_Video_Compiler.exe`

That URL currently redirects to the v1.3.8 asset `Auto_Video_Compiler.exe`. It stays valid while the latest release keeps that filename.
