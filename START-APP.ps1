# Скрипт для запуска приложения с туннелем (стабильное подключение)
# Использование: .\START-APP.ps1

Write-Host ""
Write-Host "🚀 ЗАПУСК ПРИЛОЖЕНИЯ С ТУННЕЛЕМ" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Остановка всех процессов Node.js
Write-Host "📋 Остановка процессов Node.js..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Процессы остановлены" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Процессы не найдены (это нормально)" -ForegroundColor Gray
}
Start-Sleep -Seconds 2

# Очистка кешей
Write-Host ""
Write-Host "📋 Очистка кешей..." -ForegroundColor Yellow
Remove-Item -Path ".expo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Кеш очищен" -ForegroundColor Green

# Запуск сервера с туннелем
Write-Host ""
Write-Host "🚀 Запуск Expo сервера с туннелем..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 ПРЕИМУЩЕСТВА ТУННЕЛЯ:" -ForegroundColor Yellow
Write-Host "  • QR-код НЕ изменится при перезапуске" -ForegroundColor White
Write-Host "  • Можно использовать один QR-код многократно" -ForegroundColor White
Write-Host "  • Работает даже при смене Wi-Fi сети" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Создание туннеля... (30-60 секунд)" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  ВАЖНО:" -ForegroundColor Yellow
Write-Host "  Когда появится запрос на авторизацию:" -ForegroundColor White
Write-Host "  → Используйте стрелку ВНИЗ ↓" -ForegroundColor Cyan
Write-Host "  → Выберите 'Proceed anonymously'" -ForegroundColor Cyan
Write-Host "  → Нажмите Enter" -ForegroundColor Cyan
Write-Host ""

# Запуск в новом окне
$script = @'
cd '$PWD'
Write-Host "🚀 Expo сервер запускается с туннелем..." -ForegroundColor Green
Write-Host "📱 Дождитесь QR-кода (30-60 секунд)`n" -ForegroundColor Yellow
npx expo start --tunnel --clear
'@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $script -WindowStyle Normal

Write-Host "✅ Сервер запущен в новом окне!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Yellow
Write-Host "  1. Найдите новое окно PowerShell с Expo сервером" -ForegroundColor White
Write-Host "  2. Дождитесь создания туннеля (30-60 секунд)" -ForegroundColor White
Write-Host "  3. Если появится запрос - выберите 'Proceed anonymously'" -ForegroundColor White
Write-Host "  4. Дождитесь QR-кода (URL будет вида: exp://u.expo.dev/...)" -ForegroundColor White
Write-Host "  5. Откройте Expo Go → Scan QR code" -ForegroundColor White
Write-Host "  6. Отсканируйте QR-код" -ForegroundColor White
Write-Host ""
Write-Host "✨ Этот QR-код можно использовать многократно!" -ForegroundColor Cyan
Write-Host ""

