"""
Google Search Console API — Phase 1 reporting (Search Analytics).

OAuth desktop flow. Credentials in .env.gsc.local (gitignored).
First run: python scripts/gsc_api.py auth

Docs: https://developers.google.com/webmaster-tools/v1/api_reference_index

Usage (from MainSite/):
  python scripts/gsc_api.py auth
  python scripts/gsc_api.py check
  python scripts/gsc_api.py queries --days 90
  python scripts/gsc_api.py queries --days 90 --export _seo_audit/2026-06-02/gsc-queries-api.json
  python scripts/gsc_api.py pages --days 90
  python scripts/gsc_api.py coverage-export
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOKEN_PATH = ROOT / ".gsc-token.json"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
DEFAULT_SITE = "sc-domain:knightlogics.com"


def _load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def _config() -> dict[str, str]:
    _load_env_file(ROOT / ".env.gsc.local")
    _load_env_file(ROOT / ".env.local")
    client_id = (os.getenv("GSC_OAUTH_CLIENT_ID") or "").strip()
    client_secret = (os.getenv("GSC_OAUTH_CLIENT_SECRET") or "").strip()
    if not client_id or not client_secret:
        raise SystemExit(
            "GSC_OAUTH_CLIENT_ID / GSC_OAUTH_CLIENT_SECRET missing. "
            "Copy .env.gsc.example to .env.gsc.local and fill from GCP."
        )
    return {
        "client_id": client_id,
        "client_secret": client_secret,
        "site_url": (os.getenv("GSC_SITE_URL") or DEFAULT_SITE).strip(),
        "gcp_project": (os.getenv("GSC_GCP_PROJECT") or "").strip(),
    }


def _oauth_client_config(cfg: dict[str, str]) -> dict:
    return {
        "installed": {
            "client_id": cfg["client_id"],
            "client_secret": cfg["client_secret"],
            "redirect_uris": ["http://localhost"],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }


def _get_credentials(cfg: dict[str, str], *, allow_interactive: bool):
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow

    creds = None
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if creds and creds.valid:
        return creds

    if creds and creds.expired and creds.refresh_token:
        try:
            creds.refresh(Request())
            TOKEN_PATH.write_text(creds.to_json(), encoding="utf-8")
            print("GSC access token refreshed (saved to .gsc-token.json)", file=sys.stderr)
            return creds
        except Exception as error:
            if not allow_interactive:
                raise SystemExit(
                    f"GSC token refresh failed ({error}). Run: python scripts/gsc_api.py auth"
                ) from error
            print(
                f"GSC refresh token unusable ({error}); opening browser for re-auth...",
                file=sys.stderr,
            )
            creds = None

    if not allow_interactive:
        raise SystemExit(
            f"No valid token at {TOKEN_PATH}. Run: python scripts/gsc_api.py auth"
        )

    flow = InstalledAppFlow.from_client_config(_oauth_client_config(cfg), SCOPES)
    creds = flow.run_local_server(port=0)
    TOKEN_PATH.write_text(creds.to_json(), encoding="utf-8")
    return creds


def _service(cfg: dict[str, str], *, allow_interactive: bool = True):
    from googleapiclient.discovery import build

    creds = _get_credentials(cfg, allow_interactive=allow_interactive)
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def cmd_auth(cfg: dict[str, str]) -> int:
    _get_credentials(cfg, allow_interactive=True)
    print(f"Authorized. Token saved to {TOKEN_PATH}")
    print("Ensure your Google account is a test user on the OAuth consent screen (Testing mode).")
    return 0


def cmd_check(cfg: dict[str, str]) -> int:
    svc = _service(cfg)
    resp = svc.sites().list().execute()
    sites = resp.get("siteEntry") or []
    print(f"GCP project (env): {cfg['gcp_project'] or '(not set)'}")
    print(f"Configured site:   {cfg['site_url']}")
    print(f"Verified sites:    {len(sites)}")
    for entry in sites:
        mark = " <-- configured" if entry.get("siteUrl") == cfg["site_url"] else ""
        print(f"  {entry.get('permissionLevel', '?'):12} {entry.get('siteUrl')}{mark}")
    return 0


def _date_range(days: int) -> tuple[str, str]:
    end = date.today()
    start = end - timedelta(days=max(1, days))
    return start.isoformat(), end.isoformat()


def _search_analytics(
    svc,
    site_url: str,
    *,
    days: int,
    dimensions: list[str],
    row_limit: int = 25000,
) -> list[dict]:
    start, end = _date_range(days)
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": dimensions,
        "rowLimit": row_limit,
        "dataState": "all",
    }
    resp = svc.searchanalytics().query(siteUrl=site_url, body=body).execute()
    rows = resp.get("rows") or []
    out: list[dict] = []
    for row in rows:
        keys = row.get("keys") or []
        label = keys[0] if keys else ""
        clicks = int(row.get("clicks") or 0)
        impressions = int(row.get("impressions") or 0)
        ctr = float(row.get("ctr") or 0)
        position = float(row.get("position") or 0)
        out.append(
            {
                "key": label,
                "clicks": clicks,
                "impressions": impressions,
                "ctr": round(ctr, 4),
                "position": round(position, 2),
            }
        )
    out.sort(key=lambda r: r["impressions"], reverse=True)
    return out


def cmd_queries(
    cfg: dict[str, str],
    days: int,
    export: Path | None,
    *,
    allow_interactive: bool = True,
) -> int:
    svc = _service(cfg, allow_interactive=allow_interactive)
    rows = _search_analytics(svc, cfg["site_url"], days=days, dimensions=["query"])
    normalized = [{**r, "query": r.pop("key")} for r in rows]
    payload = {
        "site_url": cfg["site_url"],
        "report": "queries",
        "days": days,
        "date_range": dict(zip(("start", "end"), _date_range(days), strict=True)),
        "pulled_at": datetime.now(timezone.utc).isoformat(),
        "row_count": len(normalized),
        "queries": normalized,
    }
    if export:
        export.parent.mkdir(parents=True, exist_ok=True)
        export.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"Wrote {export} ({len(normalized)} queries)")
    else:
        print(json.dumps(payload, indent=2))
    return 0


def cmd_pages(
    cfg: dict[str, str],
    days: int,
    export: Path | None,
    *,
    allow_interactive: bool = True,
) -> int:
    svc = _service(cfg, allow_interactive=allow_interactive)
    rows = _search_analytics(svc, cfg["site_url"], days=days, dimensions=["page"])
    normalized = [{**r, "page": r.pop("key")} for r in rows]
    payload = {
        "site_url": cfg["site_url"],
        "report": "pages",
        "days": days,
        "date_range": dict(zip(("start", "end"), _date_range(days), strict=True)),
        "pulled_at": datetime.now(timezone.utc).isoformat(),
        "row_count": len(normalized),
        "pages": normalized,
    }
    if export:
        export.parent.mkdir(parents=True, exist_ok=True)
        export.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(f"Wrote {export} ({len(normalized)} pages)")
    else:
        print(json.dumps(payload, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Google Search Console API helper")
    parser.add_argument(
        "--non-interactive",
        action="store_true",
        help="Fail fast instead of opening a browser when OAuth needs reauthorization",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("auth", help="Run OAuth consent (opens browser once)")
    sub.add_parser("check", help="List verified sites")

    q = sub.add_parser("queries", help="Search Analytics by query")
    q.add_argument("--days", type=int, default=90, help="Lookback days (default 90)")
    q.add_argument("--export", type=Path, default=None)

    p = sub.add_parser("pages", help="Search Analytics by page")
    p.add_argument("--days", type=int, default=90)
    p.add_argument("--export", type=Path, default=None)

    c = sub.add_parser("coverage-export", help="URL Inspection export for sitemap + legacy URLs")
    c.add_argument("--export-dir", type=Path, default=None, help="Output directory (default: _seo_audit/YYYY-MM-DD)")

    args = parser.parse_args()
    cfg = _config()

    if args.command == "auth":
        return cmd_auth(cfg)
    if args.command == "check":
        return cmd_check(cfg)
    if args.command == "queries":
        return cmd_queries(cfg, args.days, args.export, allow_interactive=not args.non_interactive)
    if args.command == "pages":
        return cmd_pages(cfg, args.days, args.export, allow_interactive=not args.non_interactive)
    if args.command == "coverage-export":
        from gsc_coverage_export import main as coverage_main

        coverage_main()
        return 0
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
