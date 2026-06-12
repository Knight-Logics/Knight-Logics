"""Export GSC URL Inspection coverage for sitemap + known duplicate/legacy URLs."""
from __future__ import annotations

import csv
import json
import re
import sys
import time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from gsc_api import _config, _get_credentials  # noqa: E402

BASE = "https://knightlogics.com"
AUDIT_DIR = ROOT / "_seo_audit" / datetime.now(timezone.utc).strftime("%Y-%m-%d")

LEGACY_URLS = [
    "/projects",
    "/projects.html",
    "/null",
    "/CRM-Management-System",
    "/Employee-Management-System",
    "/Ecommerce-Management-System",
    "/pricing/index.html",
    "/pricing.html",
]

HTML_SUFFIX_PAGES = [
    "service-websites",
    "service-ecommerce",
    "service-local-seo",
    "service-google-business-profile",
    "service-ai-automation",
    "service-desktop-apps",
    "home-service-websites",
    "free-website-audit",
    "web-designer-st-petersburg",
    "web-designer-tampa",
    "web-designer-clearwater",
    "web-designer-palm-harbor",
    "web-designer-safety-harbor",
    "pixelforge-ai",
    "videoforge",
    "display-control-plus",
    "terms-of-service",
    "privacy-policy",
    "cookie-policy",
    "refund-policy",
    "disclaimer",
    "automation",
    "case-studies",
    "referral-program",
    "contact",
    "book-consultation",
    "nicholas-knight",
    "pricing",
]

MEDIA_URLS = [
    "/images/Knight-Group-Website-Update.mp4",
    "/videos/automation/crm-outreach-dashboard.mp4",
]


def load_sitemap_urls() -> list[str]:
    text = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    return sorted(set(re.findall(r"<loc>([^<]+)</loc>", text)))


def build_url_list() -> list[str]:
    urls = set(load_sitemap_urls())
    for slug in HTML_SUFFIX_PAGES:
        urls.add(f"{BASE}/{slug}.html")
    for path in LEGACY_URLS:
        urls.add(f"{BASE}{path}")
    for path in MEDIA_URLS:
        urls.add(f"{BASE}{path}")
    return sorted(urls)


def inspect_url(service, site: str, url: str) -> dict:
    body = {"inspectionUrl": url, "siteUrl": site}
    resp = service.urlInspection().index().inspect(body=body).execute()
    idx = resp.get("inspectionResult", {}).get("indexStatusResult", {})
    return {
        "url": url,
        "verdict": idx.get("verdict"),
        "coverageState": idx.get("coverageState"),
        "indexingState": idx.get("indexingState"),
        "robotsTxtState": idx.get("robotsTxtState"),
        "pageFetchState": idx.get("pageFetchState"),
        "userCanonical": idx.get("userCanonical"),
        "googleCanonical": idx.get("googleCanonical"),
        "lastCrawlTime": idx.get("lastCrawlTime"),
    }


def write_csv(rows: list[dict], path: Path) -> None:
    fields = [
        "url",
        "coverageState",
        "verdict",
        "pageFetchState",
        "userCanonical",
        "googleCanonical",
        "lastCrawlTime",
        "indexingState",
        "robotsTxtState",
    ]
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def write_runbook(rows: list[dict], path: Path) -> None:
    by_state: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        by_state[row.get("coverageState") or "Unknown"].append(row)

    validate_fix = [
        r for r in rows
        if r.get("coverageState") == "Redirect error"
        or r.get("pageFetchState") == "REDIRECT_ERROR"
    ]
    sitemap_set = set(load_sitemap_urls())
    request_index = [
        r for r in rows
        if r.get("coverageState") in {
            "Discovered - currently not indexed",
            "Crawled - currently not indexed",
        }
        and r["url"] in sitemap_set
    ]

    canonical_mismatch = [
        r for r in rows
        if r.get("userCanonical")
        and r.get("googleCanonical")
        and r["userCanonical"] != r["googleCanonical"]
    ]

    lines = [
        "# GSC Coverage Export Runbook",
        "",
        f"Generated: {datetime.now(timezone.utc).isoformat()}",
        f"URLs inspected: {len(rows)}",
        "",
        "## Summary by coverage state",
        "",
    ]
    for state, count in Counter(r.get("coverageState") or "Unknown" for r in rows).most_common():
        lines.append(f"- **{state}**: {count}")

    lines.extend(["", "## 1. Validate fix (redirect errors)", ""])
    if validate_fix:
        for row in validate_fix:
            lines.append(f"- [ ] `{row['url']}` — GSC → Pages → Redirect error → Test live URL → Validate fix")
    else:
        lines.append("- None detected in this export.")

    lines.extend(["", "## 2. Request indexing (sitemap URLs not indexed)", ""])
    if request_index:
        for row in request_index:
            lines.append(f"- [ ] `{row['url']}` — GSC → URL Inspection → Request indexing")
    else:
        lines.append("- None detected in this export.")

    lines.extend(["", "## 3. Canonical mismatches (user vs Google)", ""])
    if canonical_mismatch:
        for row in canonical_mismatch:
            lines.append(
                f"- `{row['url']}` — user `{row['userCanonical']}` vs Google `{row['googleCanonical']}`"
            )
    else:
        lines.append("- None detected in this export.")

    lines.extend(["", "## Full breakdown", ""])
    for state in sorted(by_state):
        lines.append(f"### {state} ({len(by_state[state])})")
        lines.append("")
        for row in by_state[state]:
            lines.append(f"- `{row['url']}`")
        lines.append("")

    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    from googleapiclient.discovery import build

    cfg = _config()
    creds = _get_credentials(cfg, allow_interactive=False)
    service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    site = cfg["site_url"]
    urls = build_url_list()
    if len(sys.argv) > 1:
        urls = sys.argv[1:]

    AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    total = len(urls)
    for index, url in enumerate(urls, start=1):
        try:
            row = inspect_url(service, site, url)
        except Exception as exc:  # pragma: no cover
            row = {"url": url, "coverageState": "Inspection error", "error": str(exc)}
        rows.append(row)
        state = row.get("coverageState") or row.get("error") or "?"
        print(f"[{index}/{total}] {state:42} {url}")
        time.sleep(0.35)

    json_path = AUDIT_DIR / "gsc-coverage-export.json"
    csv_path = AUDIT_DIR / "gsc-coverage-export.csv"
    runbook_path = AUDIT_DIR / "gsc-coverage-runbook.md"

    json_path.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    write_csv(rows, csv_path)
    write_runbook(rows, runbook_path)

    print(f"\nWrote {json_path}")
    print(f"Wrote {csv_path}")
    print(f"Wrote {runbook_path}")


if __name__ == "__main__":
    main()
