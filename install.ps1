# NetPhantom v3.3.2 Automated PowerShell Installer
# Run: iwr -useb https://netphantom.luckyverse.tech/install.ps1 | iex

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$setupUrl = "https://github.com/lucky-om/NetPhantom/raw/main/installers/windows/dist/NetPhantom_Setup.exe"
# After building NetPhantom_Setup.exe, compute hash: (Get-FileHash .\NetPhantom_Setup.exe -Algorithm SHA256).Hash
$expectedHash = "F2CE19236A4D86D7BABC119CB889AB08C0C9E927544CDD43264169129C9CB29F"
$tempDir = [System.IO.Path]::GetTempPath()
$setupExe = Join-Path $tempDir "NetPhantom_Setup.exe"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   NetPhantom v3.3.2 — Automated Windows Setup Installer  " -ForegroundColor Cyan
Write-Host "   Publisher: Luckyverse Security                        " -ForegroundColor DarkCyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Downloading NetPhantom_Setup.exe..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $setupUrl -OutFile $setupExe -UseBasicParsing

Write-Host "[2/4] Verifying file integrity (SHA256)..." -ForegroundColor Yellow
$actualHash = (Get-FileHash -Path $setupExe -Algorithm SHA256).Hash
if ($actualHash -ne $expectedHash) {
    Write-Host "[ERROR] SHA256 hash mismatch!" -ForegroundColor Red
    Write-Host "  Expected: $expectedHash" -ForegroundColor Red
    Write-Host "  Actual:   $actualHash" -ForegroundColor Red
    Write-Host "  The downloaded file may be corrupted or tampered with." -ForegroundColor Red
    Remove-Item -Path $setupExe -Force -ErrorAction SilentlyContinue
    exit 1
}
Write-Host "  Hash verified: $actualHash" -ForegroundColor Green

Write-Host "[3/4] Verifying and unblocking binary security tags..." -ForegroundColor Yellow
if (Test-Path $setupExe) {
    Unblock-File -Path $setupExe -ErrorAction SilentlyContinue
    $motw = "$setupExe:Zone.Identifier"
    if (Test-Path $motw) {
        Remove-Item $motw -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "[4/4] Launching NetPhantom Setup Wizard with Administrator privileges..." -ForegroundColor Green
Write-Host ""

Start-Process -FilePath $setupExe -Verb RunAs
