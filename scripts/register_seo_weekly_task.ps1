# Register Windows Task Scheduler job for weekly SEO baseline.
# Run once in PowerShell (Admin not required for tasks in your own profile).

$ErrorActionPreference = "Stop"
$TaskName = "KnightLogics-SEO-Weekly-Baseline"
$ScriptPath = Join-Path $PSScriptRoot "seo_weekly_baseline.ps1"
$WorkingDir = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path $ScriptPath)) {
    throw "Missing $ScriptPath"
}

$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`"" `
    -WorkingDirectory $WorkingDir

$Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At "08:00"

$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2)

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "GSC + Bing + Serper weekly pull for knightlogics.com (MainSite/scripts/seo_weekly_baseline.py)" `
    -Force | Out-Null

Write-Host "Registered scheduled task: $TaskName"
Write-Host "  Runs: Every Monday 8:00 AM"
Write-Host "  Script: $ScriptPath"
Write-Host "  Logs: $WorkingDir\_seo_audit\_logs\"
Write-Host ""
Write-Host "Test now:  Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "Remove:    Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
