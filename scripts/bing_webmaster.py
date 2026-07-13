"""
Bing Webmaster Tools API — Phase 1 reporting for knightlogics.com.

Uses API key auth (simplest). OAuth client credentials are stored in
.env.bing.local for future delegated flows.

Docs: https://learn.microsoft.com/en-us/bingwebmaster/getting-access

Usage (from MainSite/):
  python scripts/bing_webmaster.py check
  python scripts/bing_webmaster.py sites
  python scripts/bing_webmaster.py queries
  python scripts/bing_webmaster.py queries --export _seo_audit/2026-06-02/bing-queries-api.json
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode

import requests

ROOT = Path(__file__).resolve().parents[1]
API_BASE = "https://ssl.bing.com/webmaster/api.svc/json"
DEFAULT_SITE = "https://knightlogics.com/"


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


def _load_accounts_env(path: Path) -> None:
    """Parse ~/.copilot-secrets/accounts.env (KEY=VAL, KEY:, and Bing labeled lines)."""
    if not path.exists():
        return
    lines = path.read_text(encoding="utf-8").splitlines()
    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.strip()
        i += 1
        if not line or line.startswith("#"):
            continue
        if "=" in line and not line.lower().startswith(("client id", "client secret", "api key")):
            key, _, value = line.partition("=")
            key, value = key.strip(), value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value
            continue
        labeled = re.match(r"^(Client ID|Client Secret|API Key)\s*:\s*(.+)$", line, re.I)
        if labeled:
            label, value = labeled.group(1).lower(), labeled.group(2).strip()
            env_key = {
                "client id": "BING_WEBMASTER_OAUTH_CLIENT_ID",
                "client secret": "BING_WEBMASTER_OAUTH_CLIENT_SECRET",
                "api key": "BING_WEBMASTER_API_KEY",
            }.get(label)
            if env_key and env_key not in os.environ:
                os.environ[env_key] = value
            continue
        colon = re.match(r"^([A-Z0-9_]+)\s*:\s*(.*)$", line)
        if colon:
            key, value = colon.group(1), colon.group(2).strip()
            if not value and i < len(lines):
                nxt = lines[i].strip()
                if nxt and ":" not in nxt and "=" not in nxt:
                    value, i = nxt, i + 1
            if value and key not in os.environ:
                os.environ[key] = value.strip('"').strip("'")


def _config() -> dict[str, str]:
    accounts = Path(os.environ.get("COPILOT_SECRETS_DIR", Path.home() / ".copilot-secrets")) / "accounts.env"
    _load_accounts_env(accounts)
    _load_env_file(ROOT / ".env.bing.local")
    _load_env_file(ROOT / ".env.local")
    _load_env_file(ROOT / ".env")
    api_key = (os.getenv("BING_WEBMASTER_API_KEY") or "").strip()
    if not api_key:
        raise SystemExit(
            "BING_WEBMASTER_API_KEY missing. Copy .env.bing.example to .env.bing.local and add your key."
        )
    site = (os.getenv("BING_WEBMASTER_SITE_URL") or DEFAULT_SITE).strip()
    if not site.endswith("/"):
        site += "/"
    return {
        "api_key": api_key,
        "site_url": site,
        "oauth_client_id": (os.getenv("BING_WEBMASTER_OAUTH_CLIENT_ID") or "").strip(),
        "oauth_client_secret": (os.getenv("BING_WEBMASTER_OAUTH_CLIENT_SECRET") or "").strip(),
    }


def _api_get(method: str, api_key: str, extra: dict[str, str] | None = None) -> dict:
    params: dict[str, str] = {"apikey": api_key}
    if extra:
        params.update(extra)
    url = f"{API_BASE}/{method}?{urlencode(params)}"
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict):
        raise RuntimeError(f"Unexpected response type from {method}")
    return payload


def _unwrap_list(payload: dict) -> list[dict]:
    data = payload.get("d")
    if data is None:
        return []
    if isinstance(data, list):
        return [x for x in data if isinstance(x, dict)]
    if isinstance(data, dict):
        return [data]
    return []


def _parse_bing_date(value: str | None) -> str:
    if not value:
        return ""
    match = re.search(r"Date\((-?\d+)\)", str(value))
    if not match:
        return str(value)
    try:
        ms = int(match.group(1))
        return datetime.fromtimestamp(ms / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
    except (ValueError, OSError):
        return str(value)


def cmd_check(cfg: dict[str, str]) -> int:
    print("Bing Webmaster API check")
    print(f"  Site URL: {cfg['site_url']}")
    print(f"  API key:  {'set (' + cfg['api_key'][:6] + '...)' if cfg['api_key'] else 'missing'}")
    print(f"  OAuth ID: {'set' if cfg['oauth_client_id'] else 'not set (API key mode only)'}")
    try:
        sites = cmd_sites(cfg, quiet=True)
        print(f"  Sites:    {len(sites)} verified site(s) returned")
        return 0
    except Exception as exc:
        print(f"  ERROR:    {exc}")
        return 1


def cmd_sites(cfg: dict[str, str], quiet: bool = False) -> list[dict]:
    payload = _api_get("GetUserSites", cfg["api_key"])
    sites = _unwrap_list(payload)
    if not quiet:
        print(json.dumps(sites, indent=2))
    return sites


def cmd_queries(cfg: dict[str, str], export: Path | None) -> int:
    payload = _api_get(
        "GetQueryStats",
        cfg["api_key"],
        {"siteUrl": cfg["site_url"]},
    )
    rows = _unwrap_list(payload)
    normalized: list[dict] = []
    for row in rows:
        normalized.append(
            {
                "query": row.get("Query") or row.get("query") or "",
                "date": _parse_bing_date(row.get("Date")),
                "clicks": int(row.get("Clicks") or 0),
                "impressions": int(row.get("Impressions") or 0),
                "avg_click_position": float(row.get("AvgClickPosition") or 0),
                "avg_impression_position": float(row.get("AvgImpressionPosition") or 0),
            }
        )

    # Aggregate by query (API returns weekly buckets)
    agg: dict[str, dict] = {}
    for row in normalized:
        q = row["query"]
        if not q:
            continue
        bucket = agg.setdefault(
            q,
            {
                "query": q,
                "clicks": 0,
                "impressions": 0,
                "avg_impression_position": 0.0,
                "_imp_weight": 0,
            },
        )
        bucket["clicks"] += row["clicks"]
        bucket["impressions"] += row["impressions"]
        if row["impressions"] > 0:
            bucket["avg_impression_position"] += row["avg_impression_position"] * row["impressions"]
            bucket["_imp_weight"] += row["impressions"]

    summary = []
    for bucket in agg.values():
        weight = bucket.pop("_imp_weight", 0) or 1
        bucket["avg_impression_position"] = round(bucket["avg_impression_position"] / weight, 2)
        if bucket["impressions"] > 0:
            bucket["ctr"] = round(bucket["clicks"] / bucket["impressions"], 4)
        else:
            bucket["ctr"] = 0.0
        summary.append(bucket)

    summary.sort(key=lambda x: x["impressions"], reverse=True)

    out = {
        "site_url": cfg["site_url"],
        "pulled_at": datetime.now(timezone.utc).isoformat(),
        "row_count_raw": len(normalized),
        "queries": summary,
    }

    if export:
        export.parent.mkdir(parents=True, exist_ok=True)
        export.write_text(json.dumps(out, indent=2), encoding="utf-8")
        print(f"Wrote {export} ({len(summary)} queries)")
    else:
        print(json.dumps(out, indent=2))
    return 0


def cmd_oauth_url(cfg: dict[str, str], redirect_uri: str) -> int:
    if not cfg["oauth_client_id"]:
        raise SystemExit("BING_WEBMASTER_OAUTH_CLIENT_ID not set in .env.bing.local")
    redirect = redirect_uri or "http://localhost:8765/oauth/callback"
    params = urlencode(
        {
            "response_type": "code",
            "client_id": cfg["oauth_client_id"],
            "redirect_uri": redirect,
            "scope": "webmaster.manage",
        }
    )
    print("Open this URL in a browser (log in to Bing Webmaster, approve access):")
    print(f"https://www.bing.com/webmasters/oauth/authorize?{params}")
    print("\nAfter redirect, exchange the ?code= value with Microsoft's token endpoint")
    print("(see MainSite/docs/BING-WEBMASTER-API.md). API key mode works without OAuth for your own sites.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Bing Webmaster Tools API helper")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("check", help="Verify API key and list site count")
    sub.add_parser("sites", help="List verified sites (JSON)")
    q = sub.add_parser("queries", help="Pull query stats for BING_WEBMASTER_SITE_URL")
    q.add_argument("--export", type=Path, default=None, help="Write aggregated JSON to path")
    o = sub.add_parser("oauth-url", help="Print OAuth authorize URL (optional)")
    o.add_argument("--redirect-uri", default="http://localhost:8765/oauth/callback")

    args = parser.parse_args()
    cfg = _config()

    if args.command == "check":
        return cmd_check(cfg)
    if args.command == "sites":
        cmd_sites(cfg)
        return 0
    if args.command == "queries":
        return cmd_queries(cfg, args.export)
    if args.command == "oauth-url":
        return cmd_oauth_url(cfg, args.redirect_uri)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
