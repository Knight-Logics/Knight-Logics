# Weekly SEO baseline — run via Task Scheduler (Mondays 8:00 AM default).
# Logs: MainSite/_seo_audit/_logs/seo-weekly-YYYY-MM-DD.log

$ErrorActionPreference = "Stop"
$MainSite = Split-Path -Parent $PSScriptRoot
$LogDir = Join-Path $MainSite "_seo_audit\_logs"
$Stamp = Get-Date -Format "yyyy-MM-dd"
$LogFile = Join-Path $LogDir "seo-weekly-$Stamp.log"

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log([string]$Message) {
    $line = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
    Write-Host $line
}

Write-Log "Starting SEO weekly baseline"
Set-Location $MainSite

$python = $null
foreach ($candidate in @("python", "py")) {
    if (Get-Command $candidate -ErrorAction SilentlyContinue) {
        $python = $candidate
        break
    }
}
if (-not $python) {
    Write-Log "ERROR: python not found on PATH"
    exit 1
}

Write-Log "Using: $python"
& $python scripts/seo_weekly_baseline.py 2>&1 | ForEach-Object { Write-Log $_ }
$code = $LASTEXITCODE
if ($code -ne 0) {
    Write-Log "FAILED exit code $code (if GSC: run python scripts/gsc_api.py auth)"
    exit $code
}
Write-Log "Completed OK"
exit 0
