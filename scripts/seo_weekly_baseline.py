"""
Weekly Phase 1 SEO baseline — GSC + Bing + Serper snapshot.

Runs all automatable pulls into MainSite/_seo_audit/<YYYY-MM-DD>/.
Bing backlink *compare* stays manual (no API).

Usage (from MainSite/):
  python scripts/seo_weekly_baseline.py
  python scripts/seo_weekly_baseline.py --days 90
  python scripts/seo_weekly_baseline.py --skip-serp
  python scripts/seo_weekly_baseline.py --dry-run

Schedule (Windows Task Scheduler):
  Program: python
  Args: scripts/seo_weekly_baseline.py
  Start in: E:\\KnightLogics-Growth-System\\MainSite
  Weekly, e.g. Monday 8:00 AM

Prerequisites:
  - pip install -r scripts/requirements-seo.txt
  - .env.gsc.local + .gsc-token.json (gsc_api.py auth once)
  - .env.bing.local (BING_WEBMASTER_API_KEY)
  - CRM/OutreachEngine/.env with SERPER_API_KEY
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parent
OUTREACH = REPO_ROOT / "CRM" / "OutreachEngine"
SERP_CONFIG = OUTREACH / "seo" / "phase1_serp_config.json"


def _run(cmd: list[str], *, cwd: Path, dry_run: bool) -> int:
    label = " ".join(cmd)
    print(f"\n>> {label}")
    if dry_run:
        return 0
    result = subprocess.run(cmd, cwd=cwd)
    if result.returncode != 0:
        print(f"!! failed (exit {result.returncode}): {label}", file=sys.stderr)
    return result.returncode


def main() -> int:
    parser = argparse.ArgumentParser(description="Weekly SEO baseline (GSC + Bing + Serper)")
    parser.add_argument("--days", type=int, default=90, help="GSC/Bing lookback days (default 90)")
    parser.add_argument("--skip-serp", action="store_true", help="Skip Serper snapshot (saves credits)")
    parser.add_argument("--dry-run", action="store_true", help="Print commands only")
    args = parser.parse_args()

    audit_date = date.today().isoformat()
    out_dir = ROOT / "_seo_audit" / audit_date
    rel = f"_seo_audit/{audit_date}"
    py = sys.executable

    if not args.dry_run:
        out_dir.mkdir(parents=True, exist_ok=True)

    manifest: dict = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "audit_date": audit_date,
        "days": args.days,
        "output_dir": str(out_dir),
        "steps": [],
    }
    failures = 0

    gsc_exports = [
        ("gsc-queries", ["queries"]),
        ("gsc-pages", ["pages"]),
    ]
    for name, subcmd in gsc_exports:
        export = f"{rel}/{name}-api.json"
        cmd = [
            py,
            "scripts/gsc_api.py",
            "--non-interactive",
            *subcmd,
            "--days",
            str(args.days),
            "--export",
            export,
        ]
        code = _run(cmd, cwd=ROOT, dry_run=args.dry_run)
        manifest["steps"].append({"tool": "gsc_api", "name": name, "export": export, "ok": code == 0})
        failures += code != 0

    bing_export = f"{rel}/bing-queries-api.json"
    code = _run(
        [py, "scripts/bing_webmaster.py", "queries", "--export", bing_export],
        cwd=ROOT,
        dry_run=args.dry_run,
    )
    manifest["steps"].append({"tool": "bing_webmaster", "name": "queries", "export": bing_export, "ok": code == 0})
    failures += code != 0

    code = _run([py, "scripts/bing_webmaster.py", "check"], cwd=ROOT, dry_run=args.dry_run)
    manifest["steps"].append({"tool": "bing_webmaster", "name": "check", "ok": code == 0})
    failures += code != 0

    if not args.skip_serp:
        if not SERP_CONFIG.exists():
            print(f"!! missing Serper config: {SERP_CONFIG}", file=sys.stderr)
            manifest["steps"].append({"tool": "serp_intel", "ok": False, "error": "config missing"})
            failures += 1
        else:
            serp_report = out_dir / "serp-phase1-report.md"
            cmd = [
                py,
                "serp_intel.py",
                "--config",
                str(SERP_CONFIG),
                "--report",
                "--json",
                "--notes",
                f"weekly-{audit_date}",
            ]
            code = _run(cmd, cwd=OUTREACH, dry_run=args.dry_run)
            manifest["steps"].append(
                {
                    "tool": "serp_intel",
                    "config": str(SERP_CONFIG),
                    "db": str(OUTREACH / "state" / "outreach.db"),
                    "ok": code == 0,
                }
            )
            failures += code != 0
            if not args.dry_run and code == 0:
                # Re-print latest snapshot report into audit folder for diffing week over week
                snap_cmd = [
                    py,
                    "-c",
                    "import serp_intel; serp_intel.print_snapshot_report(1)",
                ]
                if serp_report.exists() is False:
                    try:
                        proc = subprocess.run(
                            snap_cmd,
                            cwd=OUTREACH,
                            capture_output=True,
                            text=True,
                            encoding="utf-8",
                            errors="replace",
                        )
                        if proc.stdout.strip():
                            serp_report.write_text(proc.stdout, encoding="utf-8")
                            manifest["steps"][-1]["report_copy"] = str(serp_report)
                    except OSError as exc:
                        manifest["steps"][-1]["report_copy_error"] = str(exc)

    manifest["manual_steps"] = [
        "Bing Webmaster → Backlinks → Compare (knightlogics.com vs 2 competitors)",
        "GSC → URL Inspection on changed city/service pages after deploy",
        "Review St. Pete page avg position trend (target: 59 → 30 → 20 over weeks)",
    ]
    manifest["phase2_deferred"] = [
        "No /local-seo-tampa URL yet — use /service-local-seo + city web-designer pages",
        "No mass industry landing pages until city pages hold top-20 in GSC 4+ weeks",
    ]
    manifest["ok"] = failures == 0

    manifest_path = out_dir / "weekly-manifest.json"
    if args.dry_run:
        print(json.dumps(manifest, indent=2))
    else:
        manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        print(f"\nWrote {manifest_path}")

    if failures:
        print(f"\nCompleted with {failures} failed step(s). Fix credentials or deps and re-run.", file=sys.stderr)
        return 1
    print("\nWeekly baseline complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
