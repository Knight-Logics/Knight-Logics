# SEO Phase 1 Runbook — KnightLogics.com

Last updated: 2026-06-02

Phase 1 = **measure and map gaps** for **knightlogics.com** (`MainSite/`). Data sources: Google GSC, Serper (SERP snapshots), and Bing Webmaster / Bing Places. No new landing pages until this baseline is done and reviewed.

**Note:** Serper CLI lives in `CRM/OutreachEngine` only because that folder already has `.env` and Python deps. It is not OutreachEngine product work — reports are saved under `MainSite/_seo_audit/`.

## Weekly rhythm (~15 min automated + ~30 min review)

**Automated (recommended):**

```powershell
cd E:\KnightLogics-Growth-System\MainSite
python scripts/seo_weekly_baseline.py
```

**Task Scheduler (set once):**

```powershell
cd E:\KnightLogics-Growth-System\MainSite\scripts
.\register_seo_weekly_task.ps1
Start-ScheduledTask -TaskName "KnightLogics-SEO-Weekly-Baseline"   # optional test
```

Logs: `MainSite/_seo_audit/_logs/seo-weekly-YYYY-MM-DD.log`

See `docs/SEO-APIS.md` for APIs, scheduling, and what stays manual.

| Step | Tool | Output |
| --- | --- | --- |
| 1 | `seo_weekly_baseline.py` | `_seo_audit/<date>/` GSC JSON + Bing JSON + Serper snapshot |
| 2 | Review manifest + position trends | St. Pete page: target ~59 → ~30 → ~20 over weeks |
| 3 | Bing UI (every 2 weeks) | Backlink compare vs 2 competitors — **no API** |
| 4 | Optional GSC `.xlsx` | `gsc_phase1_analyze.py` if you want the markdown report |
| 5 | On-page only | **Existing pages** — no `/local-seo-tampa` until Phase 2 |

**URL note:** There is **no** `/local-seo-tampa` page today. Tampa local intent is split across `/web-designer-tampa` and `/service-local-seo`. Phase 2 would add dedicated city×service URLs only after city pages hold top-20 in GSC for 4+ weeks.

---

## 1) Google Search Console data

**Automated (recommended):** `MainSite/scripts/gsc_api.py` — see `docs/GSC-API.md`.

```powershell
cd E:\KnightLogics-Growth-System\MainSite
pip install -r scripts/requirements-seo.txt
python scripts/gsc_api.py auth
python scripts/gsc_api.py queries --days 90 --export _seo_audit/2026-06-02/gsc-queries-api.json
python scripts/gsc_api.py pages --days 90 --export _seo_audit/2026-06-02/gsc-pages-api.json
```

**Manual fallback:** GSC UI → Performance → Export `.xlsx`, then:

```powershell
cd E:\KnightLogics-Growth-System\CRM\OutreachEngine
python seo/gsc_phase1_analyze.py "E:\KnightLogics-Growth-System\knightlogics.com-Performance-on-Search-2026-06-02.xlsx"
```

---

## 2) Serper MVP (one-time setup)

### Get API key

1. Sign up at [serper.dev](https://serper.dev) (free tier includes starter credits).
2. Copy API key.

### Configure

```powershell
cd E:\KnightLogics-Growth-System\CRM\OutreachEngine
# If .env does not exist:
copy .env.example .env
# Edit .env — add: SERPER_API_KEY=your_key_here
```

### Verify setup

```powershell
python seo/serp_setup_check.py
```

### Run Phase 1 baseline (14 searches ≈ low cost)

```powershell
python serp_intel.py --config seo/phase1_serp_config.json --report --json
```

Config file: `CRM/OutreachEngine/seo/phase1_serp_config.json` — keyword/location pairs chosen from your 2026-06-02 GSC export.

### Re-read last snapshot

```powershell
python -c "import serp_intel; serp_intel.print_snapshot_report(1)"
```

Replace `1` with snapshot id from JSON output.

### Optional: via OutreachEngine API

If `python app.py` is running:

```powershell
Invoke-RestMethod "http://127.0.0.1:5050/api/seo/serp/snapshots?business_id=kl&limit=5"
```

---

## 3) Bing — two different products

| Product | Purpose | Knight Logics |
| --- | --- | --- |
| [Bing Webmaster Tools](https://www.bing.com/webmasters) | Organic SEO for `knightlogics.com` | Site verified; export Performance + Keywords CSVs |
| [Bing Places for Business](https://www.bingplaces.com) | Local map listing (like GBP) | **Pending publish** (1–14 days after verification) — normal; analytics empty until live |

Ensure **phone, address, URL** match Google Business + website before Places goes live.

Bing notes from 2026-06-02 exports: `MainSite/_seo_audit/2026-06-02/bing-webmaster-notes.md`

### Bing Webmaster (manual for now)

Until we build Bing automation, do this every 2 weeks:

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) → **Backlinks** → **Compare**
2. Your site: `knightlogics.com`
3. Compare to **2** local competitors (rotate), e.g.:
   - `skywayweb.com`
   - `noblewebworks.com`
   - `tampaseoagency.com`
4. Log in spreadsheet tab **Backlink Gap**: source URL, competitor listed, type (directory/chamber/client footer), replicable Y/N

**Keyword research (Bing):** Keywords → Research → note volumes for Tampa/Clearwater/Safety Harbor variants; cross-check with GSC impressions.

---

## 4) What Phase 1 data says (2026-06-02 export)

### Headline

- **St. Petersburg** city page: ~7,500 impressions, avg position ~**60**, **0 clicks** — biggest gap, not biggest quick win.
- **Tampa** city page: ~456 impressions, position ~**64**, 0 clicks.
- **Safety Harbor** queries: smaller volume but positions **1–19** — best near-term CTR/snippet wins.
- **Homepage** still earns most clicks; city pages need SERP competitiveness before Phase 2 new URLs.

### Phase 1 focus order

1. Serper top-10 for St. Pete / Tampa / Clearwater / Safety Harbor head terms — who owns page 1?
2. Snippet/title pass on Safety Harbor + `local seo` + GBP optimization query.
3. Internal links: homepage → city pages → `service-local-seo` → relevant case studies.
4. Bing backlink compare vs 2 competitors.
5. **Defer** new `/local-seo-tampa` style pages until Serper shows stable competitor patterns.

Full machine report: `MainSite/_seo_audit/2026-06-02/gsc-phase1-report.md`

---

## 5) Competitor SERP log (manual columns)

After each Serper run, copy into a spreadsheet:

| Keyword | Location | #1 domain | #2 | #3 | KL rank? | Page to improve |
| --- | --- | --- | --- | --- | --- | --- |
| web design st petersburg | St. Pete | | | | | web-designer-st-petersburg |

---

## Bing Webmaster API (automated keyword pull)

Credentials: `MainSite/.env.bing.local` (see `docs/BING-WEBMASTER-API.md`).

```powershell
cd E:\KnightLogics-Growth-System\MainSite
python scripts/bing_webmaster.py check
python scripts/bing_webmaster.py queries --export _seo_audit/2026-06-02/bing-queries-api.json
```

**Backlink compare** remains manual in the Bing UI (no compare API).

## Future: more Bing automation

- OAuth token refresh script for delegated access
- ~~Scheduled weekly pulls~~ → use `scripts/seo_weekly_baseline.py` + Task Scheduler

---

## Related files

| File | Purpose |
| --- | --- |
| `MainSite/scripts/seo_weekly_baseline.py` | One-shot weekly GSC + Bing + Serper |
| `MainSite/docs/SEO-APIS.md` | API matrix + Phase 2 deferrals |
| `CRM/OutreachEngine/serp_intel.py` | Serper snapshots → `state/outreach.db` |
| `CRM/OutreachEngine/seo/phase1_serp_config.json` | Phase 1 keyword/location pairs |
| `CRM/OutreachEngine/SERPER_MVP_SETUP.md` | API reference |
| `MainSite/docs/MAIN-SITE-MASTER.md` | Site-wide growth priorities |
