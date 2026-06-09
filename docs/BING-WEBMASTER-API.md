# Bing Webmaster Tools API — Knight Logics

Credentials live in **`MainSite/.env.bing.local`** (gitignored). Do not commit that file.

## Quick start

```powershell
cd E:\KnightLogics-Growth-System\MainSite
python scripts/bing_webmaster.py check
python scripts/bing_webmaster.py sites
python scripts/bing_webmaster.py queries --export _seo_audit/2026-06-02/bing-queries-api.json
```

## Auth modes

| Mode | Use when |
| --- | --- |
| **API key** (`BING_WEBMASTER_API_KEY`) | Your own verified sites — query stats, site list (Phase 1 default) |
| **OAuth** (client ID + secret) | Third-party / multi-user apps; optional for future automation |

Variable names are listed in `Sensitive/Credential-Registry/credential-routing.md` (values only in `.env.bing.local`).

## OAuth (optional)

1. Register redirect URI in Bing (e.g. `http://localhost:8765/oauth/callback`).
2. `python scripts/bing_webmaster.py oauth-url`
3. Exchange `code` at `POST https://www.bing.com/webmasters/oauth/token`

API key mode is enough for weekly Phase 1 keyword pulls on `knightlogics.com`.

## Limitations

- **No API for “backlink compare vs competitor”** — keep using Bing Webmaster UI for that.
- Query stats update in **weekly buckets** (not daily like GSC).
- Rotate compromised keys in Bing → Settings → API Access → delete + regenerate.

## Related

- `docs/SEO-PHASE1-RUNBOOK.md`
- Manual CSV exports vs API: compare periodically; API reduces manual export steps.
