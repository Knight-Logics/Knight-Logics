# Review log for PR #17

Reviewed against `pages-static` (`346dc8a`). Nothing was merged, deployed, or pointed at DNS. `wrangler deploy` was run only with `--dry-run`.

## What was checked

- All 37 files in the pull request against `pages-static`. No files are deleted or renamed.
- Worker routing in `worker/src/index.js` against Knight-Logics/knight-account-api PR #1 (`cursor/knight-account-worker-56cd`, `worker/src/index.ts` and `worker/src/catalog.ts`).
- `KNIGHT_ACCOUNT` service binding name and Worker name (`knight-account-api`).
- `/api/health` gating in `js/instant-package-checkout.js` and `pay-invoice.html`.
- `/api/autovid-license` stays on the Neon handler. `/api/stripe-webhook` signature check uses the raw body.
- Auto Video Compiler download URL, followed through redirects.
- CORS and secrets: no live keys, webhook secrets, or database URLs are committed. Tests use `sk_test_mock` and `postgres://example`.
- CI logs for `validate`, `api-worker`, `gitleaks`, and the Vercel commit status.

## Commands and outcomes

| Command | Result |
| --- | --- |
| `npm test --prefix worker` | 9 passed, 0 failed. Includes a bad Stripe signature (400) and a valid signature (200, unpaid session skipped before the database). |
| `node --test scripts/tests/checkout-contract.test.js` | 10 passed, 0 failed. |
| `node --check` on the edited API, checkout script, and `worker/preview.mjs` | Exit 0. |
| `npx wrangler deploy --dry-run --outdir /tmp/kl-worker-dry` from `worker/` | Exit 0. Log ends with `--dry-run: exiting now.` Upload size 1332.26 KiB. Binding listed: `env.KNIGHT_ACCOUNT (knight-account-api)`. Nothing was uploaded. |
| `npx wrangler dev --port 8787` | Ready. Log: `env.KNIGHT_ACCOUNT (knight-account-api) Worker local [connected]` after the account Worker started. `GET /api/health` 200. |
| Account Worker `wrangler dev --local --port 8790` (PR #1 source, local only, not this repo) | `GET /health` 200 `{"ok":true,"stripe":false,"service":"knight-account"}`. |
| `wrangler d1 migrations apply knight-account --local` on that account Worker | `0001_init.sql` applied, 10 commands. |
| `npm run pricing:check` on this branch and on `origin/pages-static` | Both exit 1 with the same two lines (see below). |
| `npm run test:pricing` on both, with `NODE_PATH` so the base tree can load `stripe` | The same 5 tests fail on both. |

## Live GET requests

`curl` and headless Chrome against `https://knightlogics.com/api/*` did not reach GitHub Pages. Cloudflare returned HTTP 403 and an HTML page titled `Just a moment...` (managed challenge, Ray ID `a5a0770c2b7cc338` on `/api/health`). That is not an origin 404. Paths recorded with a browser user agent, all 403 / `Just a moment...`:

- `/api/health`
- `/api/knight-account`
- `/api/pixelforge-license`
- `/api/autovid-license`
- `/api/licenses/health`
- `/api/licenses/create-checkout-session`
- `/api/licenses/confirm-session`
- `/api/licenses/restore`
- `/api/licenses/create-portal-session`
- `/api/licenses/stripe-webhook`
- `/api/knight-account/stripe-webhook`
- `/api/stripe-webhook`
- `/api/service-checkout`
- `/api/pay-invoice`
- `/api/create-checkout-session`

GitHub reports the Pages site built from branch `pages-static` with CNAME `knightlogics.com`. A local static server of that tree (the same shape Pages uses) returns 404 for every `/api/*` path above and 200 for `/website-health-audit.html`. `https://knight-logics.github.io/api/health` is also HTTP 404, but so is `https://knight-logics.github.io/` itself, so that host is not the published site. The published 404 is the Pages behavior: there is no `/api` file.

## Desktop apps through this Worker plus `KNIGHT_ACCOUNT`

Requests below were sent to the site Worker at `http://127.0.0.1:8787` after the log said the binding was `connected`. No Stripe secret was set, so no Checkout session was created and no card was charged. The account Worker answers from local D1.

| App | Request | Status | Evidence |
| --- | --- | --- | --- |
| PixelForge | `POST /api/pixelforge-license` `register_or_login` | 200 | `product_id` `pixelforge`, `free_trial_remaining` 20, `paid_credits` 0. Path forces PixelForge even without `product_id`, matching PR #1. |
| PixelForge | `POST /api/pixelforge-license` `create_checkout` `plan_id=starter_12` | 503 | `Stripe is not configured.` This is the account Worker's checkout gate for the installed pack (12 credits / $5). It is not the site's "Checkout is temporarily unavailable." |
| PixelForge | `POST /api/pixelforge-license` `status` | 200 | Same account, trial 20. |
| VideoForge Studio | `POST /api/knight-account` `register_or_login` `product_id=videoforge` | 200 | `product_id` `videoforge`, `free_trial_remaining` 3 (`KNIGHT_TRIAL_VIDEOFORGE`). |
| VideoForge Studio | `POST /api/knight-account` `create_checkout` `plan_id=vf_credits_10` | 503 | `Stripe is not configured.` Catalog price for that plan is $10 / 10 credits. |
| VideoForge Studio | `POST /api/knight-account` `status` `product_id=videoforge` | 200 | Trial 3 still on that product. |
| Display Control+ | `GET /api/licenses/health` | 200 | `stripe_configured` false, `plans` `["annual","lifetime"]`. |
| Display Control+ | `POST /api/licenses/create-checkout-session` `plan_key=annual` | 503 | `Stripe is not configured on the license server.` Annual maps to `dcp_annual`. Success URL in that Worker stays `http://127.0.0.1:8200/success`. |
| Display Control+ | `POST /api/licenses/restore` with an empty body | 400 | `email and recovery_code are required.` |
| Display Control+ | `POST /api/licenses/create-portal-session` unknown account | 404 | `Account not found.` |
| Auto Vid | `POST /api/autovid-license` `status` with a 64-hex `machine_id` | 503 | `License database is not configured.` That string is the Neon handler. The account Worker was connected and was not used. |
| Auto Vid | `POST /api/autovid-license` `create_checkout` `plan_id=credits_5` | 503 | Same Neon message. Shipped Auto Vid (`consume`, `activate_license`, `license_key`) stays here until `KL_DATABASE_URL` is set. |

Site log lines for those calls are in `/tmp/wrangler-dev.log` (`POST /api/pixelforge-license 200`, `503`, `POST /api/knight-account 200` and `503`, `GET /api/licenses/health 200`, `POST /api/autovid-license 503`). The first `POST /api/knight-account` before the D1 migration was 500 `D1_ERROR: no such table: accounts`. After `0001_init.sql`, the same call was 200. That migration is required on the account Worker before go-live. It is not a bug in this repository.

## `validate` pricing check

CI job `validate` (run `43400049863`, job `131800360519`) fails at `npm run pricing:check`:

```
pricing/package-checkout.js is missing canonical runtime copy: named Local/Authority-equivalent website scope
pricing/package-checkout.js is missing canonical runtime copy: Continue to Scope Consultation
```

The same command on a detached worktree of `origin/pages-static` prints those same two lines and exits 1. `diff` of the two outputs is only the npm script banner on this branch. `test:pricing` then fails the same five tests on both trees: pricing.html does not load the old catalog scripts, the homepage has no `data-package-key` checkout links, `package-checkout.js` has no `window.KL_PACKAGE_CATALOG`, package pages have no `openPackage` links, and the header does not contain `Request a Consultation`. Restoring that old checkout UI would rewrite the live flat-rate pricing page. It was not changed.

`api-worker` passed (run `43400049863`, job `131800360071`). `gitleaks` passed. The Vercel commit status is `failure` with description `Account is blocked.` and target `https://vercel.com/knowledge/why-is-my-account-deployment-blocked`. No Vercel deploy was triggered.

## Fixes in this review

- `pay-invoice.html`: the submit button stays disabled until `GET /api/health` reports `checkout: true`. If it does not, the form hides and the offline panel shows Contact Us plus the phone number that the previous stub showed, `(813) 773-5553`.
- `worker/test/api.test.js`: webhook signature test. A forged `Stripe-Signature` is 400. A header from `Stripe.webhooks.generateTestHeaderString` over the raw body is 200.

## Go-live checklist

Do this in order. Merging this pull request only publishes the static script and the download link. It does not attach `/api`.

1. Confirm `knightlogics.com` is already proxied. Do not change DNS records.
2. On the account Worker (knight-account-api PR #1), create D1, apply `0001_init.sql`, and set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `LICENSE_SIGNING_SECRET`. Deploy that Worker so the name `knight-account-api` exists. Do not give it a `knightlogics.com` route.
3. From this repo's `worker/`, `npx wrangler login`.
4. `npx wrangler secret put STRIPE_SECRET_KEY` with an `sk_test_` key. Then `STRIPE_WEBHOOK_SECRET` (`whsec_...`) and `KL_DATABASE_URL` (existing Neon URL). Optional: `FORMSPREE_ENDPOINT`, `CHECKOUT_ALLOWED_ORIGINS`, `AUTONOMOUS_ORDER_API_SECRET` (alias `AUTONOMOUS_WORKER_SECRET`), `KL_ADMIN_SECRET`, `KL_OWNER_SECRET`, `KL_VERIFY_SALT`. Leave `PIXELFORGE_PRO_LIFETIME_PRICE_CENTS` unset.
5. Leave `routes` commented in `worker/wrangler.jsonc`. The `services` entry is already `binding` `KNIGHT_ACCOUNT`, `service` `knight-account-api`. `npx wrangler deploy` then publishes only `*.workers.dev`.
6. `GET /api/health` on that host must show `checkout: true` and `knightAccount: true`.
7. Repeat the table above against that host with the Stripe test card `4242 4242 4242 4242` only after the account Worker's `STRIPE_SECRET_KEY` is the test key. PixelForge `starter_12` must be $5. VideoForge `vf_credits_10` must be $10. Display Control+ `annual` must use the loopback success URL `http://127.0.0.1:8200/success?session_id={CHECKOUT_SESSION_ID}`. Auto Vid `POST /api/autovid-license` must return `free_used` / `license_key`, not `free_trial_remaining`.
8. Point the test-mode Stripe webhook for site charges at `/api/stripe-webhook`, and the account webhook at `/api/knight-account/stripe-webhook` (Display Control+ can use `/api/licenses/stripe-webhook`, same handler).
9. Uncomment the two routes, `knightlogics.com/api/*` and `www.knightlogics.com/api/*`, both `zone_name` `knightlogics.com`, and deploy again. HTML still comes from Pages.
10. Merge this pull request so Pages serves the health-gated buy buttons and `Auto_Video_Compiler.exe`.
11. Switch the test secrets to live keys only after one test payment looks right. `wrangler secret put` deploys a new version immediately.

Rollback: comment the routes and deploy again, or `npx wrangler rollback`. Buy buttons return to Contact to Get Started as soon as `/api/health` is not `checkout: true`. D1 data on the account Worker is not rolled back by a Worker rollback.

## Remaining risks

- Auto Vid checkout and `consume` stay 503 until `KL_DATABASE_URL` is set. That is required for the shipped app and is separate from the account Worker.
- PixelForge, VideoForge, and Display Control+ checkout URLs are not minted until the account Worker has `STRIPE_SECRET_KEY`. This review proved the route and the plan id, not a hosted Checkout page.
- The first request to a fresh local D1 fails until `0001_init.sql` is applied. Do that before sending production traffic.
- `validate` stays red for the pre-existing pricing contract. Vercel stays red because the account is blocked.
- Cloudflare's challenge hides the live origin status from this environment. A browser that passes the challenge should see the Pages 404 until step 9.
