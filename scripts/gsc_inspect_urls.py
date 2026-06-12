"""One-off URL Inspection batch for GSC coverage triage."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from gsc_api import _config, _get_credentials  # noqa: E402

DEFAULT_URLS = [
    "https://knightlogics.com/pricing/index.html",
    "https://knightlogics.com/pricing.html",
    "https://knightlogics.com/pricing",
    "https://knightlogics.com/web-designer-st-petersburg",
    "https://knightlogics.com/home-service-websites",
    "https://knightlogics.com/service-local-seo",
    "https://knightlogics.com/automation",
    "https://knightlogics.com/free-website-audit",
    "https://knightlogics.com/service-ecommerce",
    "https://knightlogics.com/referral-program",
    "https://knightlogics.com/case-study-farrell-electric",
    "https://knightlogics.com/images/Knight-Group-Website-Update.mp4",
    "https://knightlogics.com/pixelforge-ai.html",
    "https://knightlogics.com/null",
    "https://knightlogics.com/CRM-Management-System",
    "https://knightlogics.com/projects",
    "https://knightlogics.com/terms-of-service",
    "https://knightlogics.com/terms-of-service.html",
    "https://knightlogics.com/videoforge.html",
    "https://knightlogics.com/service-websites.html",
    "https://knightlogics.com/web-designer-st-petersburg.html",
]


def main() -> None:
    from googleapiclient.discovery import build

    cfg = _config()
    creds = _get_credentials(cfg, allow_interactive=False)
    service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    site = cfg["site_url"]
    urls = sys.argv[1:] or DEFAULT_URLS
    results = []

    for url in urls:
        body = {"inspectionUrl": url, "siteUrl": site}
        try:
            resp = service.urlInspection().index().inspect(body=body).execute()
            idx = resp.get("inspectionResult", {}).get("indexStatusResult", {})
            results.append(
                {
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
            )
        except Exception as exc:  # pragma: no cover
            results.append({"url": url, "error": str(exc)})

    out = ROOT / "_seo_audit" / "2026-06-12" / "gsc-url-inspection.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Wrote {out} ({len(results)} URLs)")
    for row in results:
        if row.get("error"):
            print(f"ERR  {row['url']}: {row['error']}")
            continue
        print(
            f"{row.get('coverageState','?'):40} | {row.get('verdict','?'):12} | {row['url']}"
        )


if __name__ == "__main__":
    main()
