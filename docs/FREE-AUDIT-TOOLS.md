# Free audit tools — Knight Logics (knightlogics.com)

Last updated: 2026-06-02

**Honest summary:** Phase 1 automated **search demand + SERP** reporting is in place. Impressions/clicks/sales also depend on **rank position**, **off-site trust**, and **conversion** — those use different free tools below.

---

## Already on your site or in automation

| Tool | Role | Automated? |
| --- | --- | --- |
| **Google Search Console** | Impressions, clicks, position, indexing | Yes — `seo_weekly_baseline.py` |
| **Bing Webmaster** | Bing queries, crawl, backlinks UI | Yes — weekly script |
| **Serper** | Google SERP competitors | Yes — weekly script (uses credits) |
| **GA4** (`G-VX36QR7HJW`) | Traffic, conversions | Tag yes; **Data API** not in weekly script |
| **Microsoft Clarity** | Heatmaps, rage clicks, session replay | Tag yes; **you** review UI |
| **IndexNow** | Faster recrawl after deploy | On git push to `main` |
| **PageSpeed Insights API** | CWV / Lighthouse scores | In **OutreachEngine** for leads; **not** on KL weekly schedule |

---

## Free tools worth using (not all automated yet)

### Search visibility (impressions & clicks)

| Tool | Cost | What it tells you | Cadence |
| --- | --- | --- | --- |
| [Ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools) | Free (verified site) | Technical issues, backlinks, referring domains | Monthly |
| GSC → **Experience → Core Web Vitals** | Free | Real-user LCP/CLS hurting rankings | Monthly |
| GSC → **Enhancements** (FAQ, breadcrumbs) | Free | Rich result eligibility | After schema changes |
| [Rich Results Test](https://search.google.com/test/rich-results) | Free | Live schema proof for key URLs | After deploy |
| Bing Webmaster → **Site Scan** | Free | Bing-side SEO issues | Quarterly |
| Bing → **Backlinks → Compare** | Free | vs Skyway, Nathan Currin, etc. | Every 2 weeks (manual) |

### Conversion & sales (clicks → leads)

| Tool | Cost | What it tells you | Cadence |
| --- | --- | --- | --- |
| **GA4** (Explorations) | Free | Which pages → contact/booking; bounce on pricing | Monthly |
| **Microsoft Clarity** | Free | Where users stall on homepage/pricing/audit form | Biweekly (15 min) |
| **Google Business Profile** | Free | Calls, directions, map views — often beats organic for local | Weekly |
| GSC → filter by page `/free-website-audit`, `/contact` | Free | Query → landing page before form submit | Monthly |

### Performance (supports ranking; rarely fixes pos 60 alone)

| Tool | Cost | What it tells you | Cadence |
| --- | --- | --- | --- |
| **PSI API** (same key as OutreachEngine) | Free quota | Lab scores for homepage + 2 money pages | **Monthly** or post-deploy (not weekly) |
| Lighthouse (Chrome or `npm run qa:lighthouse`) | Free | Same, local | After big front-end changes |
| [web.dev/measure](https://web.dev/measure/) | Free | Quick check without scripting | Ad hoc |

### Limited free tiers (use sparingly)

| Tool | Notes |
| --- | --- |
| Semrush / Ubersuggest | Hit limits fast on your tracker; use GSC + Serper instead |
| Screaming Frog free (500 URLs) | You already have crawl exports in `_seo_audit` — re-run after deploy |

---

## PSI scheduling — recommendation

**Do not add PSI to the Monday weekly task** by default. Scores change slowly; weekly runs burn API quota without moving St. Pete from ~pos 60.

**Do run PSI when:**

- After a deploy that touches CSS/JS/images
- Once a month on: `/`, `/web-designer-st-petersburg`, `/free-website-audit`
- When Clarity shows mobile rage clicks on hero/pricing

Optional later: `scripts/kl_psi_monthly.py` on the **first Monday** of the month only.

---

## What still moves the needle (not “more reports”)

1. **Deploy** pending on-page + internal link gaps (pricing body, case studies).
2. **Reviews + live GBP** (map pack and trust in SERPs).
3. **Chamber / Places** (Safety Harbor citations).
4. **Footer backlink recrawl** (weeks).
5. **Clarity + GA4** on whether people reach audit/contact — fixes **sales**, not impressions.

See `docs/SEO-ROADMAP.md` for phases 1b–4.
