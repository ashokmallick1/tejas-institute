# ==============================================================================
# TEJAS Unified QA Framework - 1-Click Automated Runner
# Executes Multi-Device Playwright Suites & Generates Markdown Report
# ==============================================================================

param (
    [string]$Project = "Desktop Chrome",
    [int]$Port = 3004,
    [string]$BaseUrl = "http://localhost:3004"
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  TEJAS UNIFIED QA & MULTI-DEVICE AUTOMATION RUNNER" -ForegroundColor Cyan
Write-Host "  Port: $Port | Target URL: $BaseUrl" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$serverStartedByScript = $false
$serverJob = $null

# 1. Healthcheck: Check if dev server is already running on target port
Write-Host "[1/4] Checking local dev server availability on port $Port..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -WarningAction SilentlyContinue

if (-not $connection.TcpTestSucceeded) {
    Write-Host "[INFO] Port $Port not responding. Spawning background dev server..." -ForegroundColor Yellow
    $serverJob = Start-Job -ScriptBlock {
        param($p)
        Set-Location "f:\antigravity\tejas institute"
        npm run dev -- -p $p
    } -ArgumentList $Port
    $serverStartedByScript = $true

    # Wait for server to become healthy
    $maxWaitSec = 40
    $waited = 0
    $healthy = $false
    while ($waited -lt $maxWaitSec -and -not $healthy) {
        Start-Sleep -Seconds 2
        $waited += 2
        try {
            $response = Invoke-WebRequest -Uri "$BaseUrl" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                $healthy = $true
            }
        } catch {}
        Write-Host "  Waiting for dev server... ($waited s)" -ForegroundColor Gray
    }

    if (-not $healthy) {
        Write-Host "[ERROR] Dev server failed to boot within $maxWaitSec seconds." -ForegroundColor Red
        if ($serverJob) { Stop-Job $serverJob; Remove-Job $serverJob }
        exit 1
    }
    Write-Host "[SUCCESS] Dev server is online and responding with HTTP 200." -ForegroundColor Green
} else {
    Write-Host "[SUCCESS] Active dev server detected on port $Port." -ForegroundColor Green
}

# 2. Run Playwright Automated Suite
Write-Host "[2/4] Executing Playwright E2E suites for project: $Project..." -ForegroundColor Yellow
$startTime = Get-Date

$env:BASE_URL = $BaseUrl
$testOutput = npx playwright test --project="$Project" 2>&1 | Out-String

$endTime = Get-Date
$durationSec = [math]::Round(($endTime - $startTime).TotalSeconds, 1)

Write-Host $testOutput

# 3. Parse Outcomes
$passedMatch = [regex]::Match($testOutput, "(\d+) passed")
$failedMatch = [regex]::Match($testOutput, "(\d+) failed")

$passedCount = if ($passedMatch.Success) { $passedMatch.Groups[1].Value } else { "0" }
$failedCount = if ($failedMatch.Success) { $failedMatch.Groups[1].Value } else { "0" }
$totalCount = [int]$passedCount + [int]$failedCount

# 4. Generate Markdown Summary Report: latest_test_results.md
Write-Host "[3/4] Generating latest_test_results.md artifact..." -ForegroundColor Yellow

$statusBadge = if ([int]$failedCount -eq 0 -and [int]$passedCount -gt 0) { "PASSED (100%)" } else { "FAILED ($failedCount Failures)" }
$dateStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$passRate = if ($totalCount -gt 0) { [math]::Round(([double]$passedCount / [double]$totalCount) * 100, 1) } else { 0 }
$failRate = if ($totalCount -gt 0) { [math]::Round(([double]$failedCount / [double]$totalCount) * 100, 1) } else { 0 }

$lines = @(
    "# TEJAS Unified Automated QA Test Report",
    "",
    "- **Execution Date**: $dateStamp",
    "- **Target Host**: $BaseUrl",
    "- **Device Profile**: $Project",
    "- **Execution Duration**: $durationSec seconds",
    "- **Overall Status**: **$statusBadge**",
    "",
    "## Summary Metrics",
    "| Metric | Count | Rate |",
    "| :--- | :--- | :--- |",
    "| **Total Test Cases Executed** | $totalCount | 100% |",
    "| **Passed** | $passedCount | $passRate% |",
    "| **Failed** | $failedCount | $failRate% |",
    "",
    "## Real-Time Synchronization",
    "All test outcomes were automatically tagged with `@TCxx` annotations and synced into:",
    "1. **QA Command Center**: $BaseUrl/test-data",
    "2. **Tester Activity Monitor**: $BaseUrl/tester-activity",
    "3. **Database Records**: `qa_test_results` (run_mode: 'automated')",
    "",
    "## Console Execution Log",
    "````",
    $testOutput,
    "````"
)
$mdContent = $lines -join "`r`n"

$mdPath = "f:\antigravity\tejas institute\latest_test_results.md"
Set-Content -Path $mdPath -Value $mdContent -Encoding UTF8
Write-Host "[SUCCESS] Markdown report generated at: $mdPath" -ForegroundColor Green

# 5. Cleanup if needed
if ($serverStartedByScript -and $serverJob) {
    Write-Host "[4/4] Shutting down temporary background dev server job..." -ForegroundColor Yellow
    Stop-Job $serverJob
    Remove-Job $serverJob
} else {
    Write-Host "[4/4] Leaving existing dev server online." -ForegroundColor Green
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  TEJAS TEST RUN COMPLETE: $passedCount PASSED | $failedCount FAILED" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
