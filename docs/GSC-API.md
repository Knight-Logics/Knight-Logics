# Google Search Console API — Knight Logics

GCP project: **GSC-Analytics-Tracker**  
OAuth client: **GSC Python Client** (Desktop)

Credentials: **`MainSite/.env.gsc.local`** (gitignored). Token: **`MainSite/.gsc-token.json`** (gitignored).

## One-time setup

1. In GCP: enable **Google Search Console API** for project `GSC-Analytics-Tracker`.
2. **OAuth consent screen → Test users** — add every Google account you will sign in with (required while app is in **Testing**).
3. Install deps:

```powershell
cd E:\KnightLogics-Growth-System\MainSite
pip install -r scripts/requirements-seo.txt
```

4. Authorize (opens browser once):

```powershell
python scripts/gsc_api.py auth
```

## Token refresh (what happens on every run)

`gsc_api.py` loads `.gsc-token.json` and, on **every** `queries` / `pages` / `check` call:

1. If the **access token** is still valid → uses it (no browser).
2. If the access token is **expired** but a **refresh token** exists → calls Google’s token endpoint, saves the updated JSON to `.gsc-token.json`, then continues.
3. If refresh fails (or no token file) → exits with “run `gsc_api.py auth`”.

So you do **not** need to re-auth before each weekly scan for normal operation — the script already refreshes short-lived access tokens automatically.

### The “expires every 7 days” case

That message applies to OAuth apps left in **Testing** on the consent screen: Google may **expire the refresh token** after 7 days. When that happens, `creds.refresh()` fails and you must run `auth` again (~5 seconds in the browser).

**Fix options:**

| Approach | Effect |
| --- | --- |
| Keep Testing + re-auth when refresh fails | Fine for personal weekly runs |
| Publish consent screen to **Production** (app verification if Google requires it) | Long-lived refresh tokens for test users |
| Use **Internal** app type (Google Workspace org only) | No 7-day refresh expiry for org users |

`seo_weekly_baseline.py` calls the same `_get_credentials` path, so weekly automation gets the same refresh behavior.

## Weekly Phase 1 pulls

```powershell
python scripts/gsc_api.py check
python scripts/gsc_api.py queries --days 90 --export _seo_audit/2026-06-02/gsc-queries-api.json
python scripts/gsc_api.py pages --days 90 --export _seo_audit/2026-06-02/gsc-pages-api.json
```

Replaces manual Performance xlsx export for automation; you can still export from UI for spot checks.

## Property URL

Default: `sc-domain:knightlogics.com` (domain property). Override with `GSC_SITE_URL` in `.env.gsc.local`.

## vs manual `gsc_phase1_analyze.py`

| Tool | Input |
| --- | --- |
| `CRM/OutreachEngine/seo/gsc_phase1_analyze.py` | Manual `.xlsx` export |
| `MainSite/scripts/gsc_api.py` | Live Search Console API (JSON) |

## Error 403: access_denied / “has not completed verification”

The OAuth app name may show as **GSC** on the Google sign-in screen. That is normal for a Testing app.

**Fix:**

1. [Google Cloud Console](https://console.cloud.google.com/) → project **GSC-Analytics-Tracker**
2. **APIs & Services** → **OAuth consent screen**
3. Scroll to **Test users** → **Add users**
4. Add **`NickKnight488@gmail.com`** (and any other account that owns Search Console)
5. Save, wait ~1 minute, then run `python scripts/gsc_api.py auth` again

Use the same Google account that can open [Search Console](https://search.google.com/search-console) for `knightlogics.com`.

You do **not** need full Google verification for personal/internal use — only test users while Publishing status is **Testing**.

## Related

- `docs/SEO-PHASE1-RUNBOOK.md`
- `docs/BING-WEBMASTER-API.md`
- `Sensitive/Credential-Registry/credential-routing.md` (variable names only)
