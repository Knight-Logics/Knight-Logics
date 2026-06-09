# SEO Roadmap — Knight Logics (knightlogics.com)

Last updated: 2026-06-02

This is the full sequence after Phase 1 measurement — not “wait and do nothing.”

## Phase 1 — Measure & fix what exists (current)

**Goal:** Baseline + on-page fixes on URLs Google already knows.

| Work | Status |
| --- | --- |
| GSC API + weekly script | Done |
| Bing Webmaster API + weekly script | Done |
| Serper SERP baseline | Done |
| City pages (St. Pete, Tampa, Clearwater, Safety Harbor) title/meta/H1 | Done (deploy pending) |
| `service-local-seo`, `service-google-business-profile` | Done (deploy pending) |
| Bing Places + chamber | Manual — you |
| Weekly `seo_weekly_baseline.py` | Run after each deploy |

**Exit criteria:** Deployed changes live; 2+ weekly baselines saved for trend comparison.

---

## Phase 1b — Recrawl & inspect (immediately after deploy)

**Goal:** Google/Bing pick up changes without waiting a month.

| Action | Tool |
| --- | --- |
| Push to `main` | GitHub → Vercel + IndexNow workflow (changed URLs only) |
| URL Inspection | GSC UI — 3–5 changed URLs (St. Pete, Safety Harbor, `service-local-seo`) |
| Optional API | GSC [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect) — not in our script yet; quota ~2k/day |
| Sitemap | **Do not** resubmit if `sitemap.xml` unchanged — IndexNow + normal crawl suffice |
| Sitemap resubmit | Only when you **add new URLs** to `sitemap.xml` or GSC shows sitemap errors |

---

## Phase 2 — Targeted expansion (data-gated, not “wait 4 weeks for everything”)

**Old rule (too blunt):** “No new URLs for 4 weeks.”

**Revised rule:**

| Do now (no new URL required) | Gate before **new** landing URLs |
| --- | --- |
| Homepage already says **Tampa Bay** — keep that; add internal links + snippet tests on existing Tampa/St. Pete pages | Mass city×service pages or industry silos |
| Strengthen `/web-designer-tampa` + `/service-local-seo` with Tampa-specific sections and anchors | Duplicate thin `/local-seo-{city}` for every city |
| Safety Harbor GBP + web page (GSC pos ~9–19) | — |

### `/local-seo-tampa` — research conclusion (2026-06-02 GSC)

| Signal | Finding |
| --- | --- |
| GSC queries (90d) | **No** meaningful `local seo tampa` query; you **do** rank ~pos **8** for generic `local seo` on `/service-local-seo` |
| Homepage | Already optimized for **Tampa Bay Web Design & Local SEO** |
| Tampa gap | `/web-designer-tampa` ~pos **64**, low clicks — **web design** intent, not missing “local SEO Tampa” URL |
| Risk | New `/local-seo-tampa` can **cannibalize** `/service-local-seo` unless content is clearly distinct |

**Recommendation:** Do **not** add `/local-seo-tampa` yet. Instead:

1. Add a **“Local SEO in Tampa”** section on `/service-local-seo` linking to `/web-designer-tampa`.
2. Add a **“Local SEO + web design”** block on `/web-designer-tampa` linking back to `/service-local-seo`.
3. Add Serper watch: `local seo tampa` — if competitors own page 1 with dedicated URLs *and* GSC shows impressions, then build **one** page.

**4-week wait applies to:** bulk new URL programs (10+ pages), not headline tweaks or internal linking.

---

## Phase 3 — Authority & trust

| Work | Notes |
| --- | --- |
| Client footer backlinks | ~21 live; Bing count lags |
| Safety Harbor Chamber + Bing Places NAP | Manual |
| Directory / citation layer | From `MAIN-SITE-MASTER` / legacy audit |
| Case study links from city pages | Ongoing |

---

## Phase 4 — Automation & optional APIs

| Integration | You have | Wired to weekly SEO? |
| --- | --- | --- |
| GSC API | Yes (`gsc_api.py`) | Yes |
| Bing Webmaster API | Yes | Yes |
| Serper | Yes | Yes |
| GA4 **tag** on site | Yes (`G-VX36QR7HJW`) | N/A |
| GA4 **Data API** | GCP possible; **no script in repo** | No — add if you want sessions/conversions beside GSC |
| GBP APIs | `customeraccounts-a29eb` — review/sync | No — separate from Search Console |
| Ahrefs / Semrush API | Paid | No — free Site Audit / UI only today |
| GSC URL Inspection API | Available | Optional Phase 4 script |

---

## Related docs

- `docs/SEO-PHASE1-RUNBOOK.md` — weekly ops
- `docs/SEO-APIS.md` — credentials & API matrix
- `docs/GSC-API.md` — OAuth & token refresh
