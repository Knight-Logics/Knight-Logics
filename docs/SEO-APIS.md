# SEO APIs & Weekly Automation — Knight Logics

Last updated: 2026-06-02

## One-command weekly baseline

```powershell
cd E:\KnightLogics-Growth-System\MainSite
pip install -r scripts/requirements-seo.txt
python scripts/seo_weekly_baseline.py
```

Outputs: `MainSite/_seo_audit/<date>/`

| File | Source |
| --- | --- |
| `gsc-queries-api.json` | Google Search Console API |
| `gsc-pages-api.json` | GSC API |
| `bing-queries-api.json` | Bing Webmaster API |
| `weekly-manifest.json` | This script (step status + manual reminders) |
| `serp-phase1-report.md` | Copy of latest Serper report (when Serper run succeeds) |

Serper raw history lives in `CRM/OutreachEngine/state/outreach.db`.

Schedule via **Windows Task Scheduler** (weekly) or run manually after deploys.

---

## APIs in use (Phase 1)

| API | Cost | What it gives you | Setup |
| --- | --- | --- | --- |
| **Google Search Console** | Free | Impressions, clicks, position by query/page | `docs/GSC-API.md`, `.env.gsc.local` |
| **Bing Webmaster** | Free | Bing organic queries, site list, crawl stats | `docs/BING-WEBMASTER-API.md`, `.env.bing.local` |
| **Serper** | Paid (low per search) | Live Google SERP top 10 by keyword + location | `CRM/OutreachEngine/.env` → `SERPER_API_KEY` |

### Manual only (no good free API for our workflow)

| Task | Why manual |
| --- | --- |
| Bing **backlink compare** vs competitors | Bing has no public “compare two domains” API |
| Bing Places publish / NAP | UI workflow; see `docs/BING-PLACES-AND-CHAMBER-CHECKLIST.md` |
| GSC URL Inspection after deploy | API exists but weekly bulk inspection is rarely worth automating early |

---

## APIs to consider later (not required for Phase 1)

| API | When it helps | Notes |
| --- | --- | --- |
| **Google Analytics Data API** | Tie clicks to on-site goals beyond GSC | GA4 **measurement tag** is on the site; a **Data API** script is not in this repo yet (can live in `GSC-Analytics-Tracker` or a separate GCP project) |
| **Google Business Profile APIs** | Bulk post/review automation | Documented under `customeraccounts-a29eb` in credential registry (review sync); **not** wired to `seo_weekly_baseline.py` |
| **Ahrefs / Semrush API** | Backlink gap at scale | Paid; Ahrefs Webmaster free tier is UI-only for small sites |
| **DataForSEO / Bright Data** | Cheaper SERP at volume than Serper | Only if Serper cost becomes an issue |
| **IndexNow** | Faster Bing/Yandex recrawl | Already wired via `.github/workflows/indexnow.yml` on deploy |

**Do not add** a new `/local-seo-tampa` URL for Phase 1. You already have:

- `/service-local-seo` — Tampa Bay **service** page (ranks for generic `local seo` ~pos 8)
- `/web-designer-tampa`, `/web-designer-st-petersburg`, etc. — **city** pages

Phase 2 `/local-seo-tampa` would be a **city × service** landing page — deferred until city pages improve in GSC for 4+ weeks.

---

## Footer backlinks & Bing “4 referring domains”

~21 client footer credits (“Site by Knight Logics”) are **live**. Bing’s backlink count often lags **weeks to months** — watching “4 → 20” in Bing compare is a **lag indicator**, not proof footers failed.

Weekly: run the script for GSC/Serper; every **2 weeks** do Bing backlink compare manually and log in your spreadsheet.

---

## Credential files (gitignored)

| File | Service |
| --- | --- |
| `MainSite/.env.gsc.local` | GSC OAuth client |
| `MainSite/.gsc-token.json` | GSC refresh token |
| `MainSite/.env.bing.local` | Bing Webmaster API key |
| `CRM/OutreachEngine/.env` | `SERPER_API_KEY` |

See `Sensitive/Credential-Registry/credential-routing.md` for variable names (no secret values).
