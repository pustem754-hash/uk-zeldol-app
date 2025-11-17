# Простой скрипт для запуска приложения
# Использование: .\START-SIMPLE.ps1

Write-Host ""
Write-Host "🚀 ПРОСТОЙ ЗАПУСК ПРИЛОЖЕНИЯ" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Остановка процессов
Write-Host "📋 Остановка процессов..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2
Write-Host "✅ Готово" -ForegroundColor Green
Write-Host ""

# Очистка
Write-Host "🧹 Очистка кешей..." -ForegroundColor Yellow
Remove-Item -Path ".expo" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Готово" -ForegroundColor Green
Write-Host ""

# Запуск
Write-Host "🚀 Запуск Expo сервера..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 ИНСТРУКЦИЯ:" -ForegroundColor Yellow
Write-Host "  1. Дождитесь QR-кода в новом окне" -ForegroundColor White
Write-Host "  2. Если появится запрос - выберите 'Proceed anonymously'" -ForegroundColor White
Write-Host "  3. Откройте Expo Go → Scan QR code" -ForegroundColor White
Write-Host ""

# Запуск в новом окне
$script = @'
cd '$PWD'
Write-Host "🚀 Expo сервер запускается..." -ForegroundColor Green
Write-Host "📱 Дождитесь QR-кода...`n" -ForegroundColor Yellow
npx expo start --clear
'@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $script -WindowStyle Normal

Write-Host "✅ Сервер запущен!" -ForegroundColor Green
Write-Host ""
Write-Host "Найдите новое окно PowerShell и следуйте инструкциям выше." -ForegroundColor Cyan
Write-Host ""

