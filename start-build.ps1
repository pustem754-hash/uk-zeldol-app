# Script to start iOS build
Write-Host "Starting iOS build for iPhone..." -ForegroundColor Green
Write-Host ""

# Check authorization
Write-Host "Checking authorization..." -ForegroundColor Yellow
$whoami = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You are not logged in. Login required." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please login first:" -ForegroundColor Yellow
    Write-Host "  eas login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After login, run this script again or execute:" -ForegroundColor Yellow
    Write-Host "  eas build --platform ios --profile preview --clear-cache" -ForegroundColor Cyan
    exit 1
}

Write-Host "Authorization successful" -ForegroundColor Green
Write-Host ""

# Check configuration
Write-Host "Checking configuration..." -ForegroundColor Yellow
if (-not (Test-Path "app.json")) {
    Write-Host "app.json not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "eas.json")) {
    Write-Host "eas.json not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "assets\icon\app-icon.png")) {
    Write-Host "Icon not found: assets\icon\app-icon.png" -ForegroundColor Red
    exit 1
}

Write-Host "Configuration OK" -ForegroundColor Green
Write-Host ""

# Start build
Write-Host "Starting iOS build..." -ForegroundColor Cyan
Write-Host "This may take 10-20 minutes..." -ForegroundColor Yellow
Write-Host ""

eas build --platform ios --profile preview --clear-cache

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Build completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Check QR code above or download link" -ForegroundColor White
    Write-Host "  2. Open link in Safari on iPhone" -ForegroundColor White
    Write-Host "  3. Install the app" -ForegroundColor White
    Write-Host "  4. Trust developer in iPhone settings" -ForegroundColor White
    Write-Host ""
    Write-Host "Or run to view details:" -ForegroundColor Gray
    Write-Host "  eas build:view" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Build failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check logs above or run:" -ForegroundColor Yellow
    Write-Host "  eas build:list --platform ios" -ForegroundColor Cyan
    exit 1
}
