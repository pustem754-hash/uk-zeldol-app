# Скрипт для перезапуска приложения с выбором режима
# Использование: .\RESTART-APP.ps1

Write-Host ""
Write-Host "🔄 ПЕРЕЗАПУСК ПРИЛОЖЕНИЯ" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Остановка всех процессов
Write-Host "📋 Остановка процессов..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2
Write-Host "✅ Процессы остановлены" -ForegroundColor Green
Write-Host ""

# Выбор режима
Write-Host "Выберите режим запуска:" -ForegroundColor Yellow
Write-Host "  1. LAN (быстро, требует одну Wi-Fi сеть)" -ForegroundColor White
Write-Host "  2. Tunnel (медленнее, но работает везде)" -ForegroundColor White
Write-Host "  3. Обычный (автоматический выбор)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Введите номер (1-3) или нажмите Enter для LAN"

if ($choice -eq "2") {
    $mode = "tunnel"
    $modeText = "ТУННЕЛЬ"
} elseif ($choice -eq "3") {
    $mode = "normal"
    $modeText = "ОБЫЧНЫЙ"
} else {
    $mode = "lan"
    $modeText = "LAN"
}

Write-Host ""
Write-Host "🚀 Запуск в режиме: $modeText" -ForegroundColor Green
Write-Host ""

# Очистка кешей
Write-Host "🧹 Очистка кешей..." -ForegroundColor Yellow
Remove-Item -Path ".expo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Кеш очищен" -ForegroundColor Green
Write-Host ""

# Запуск в зависимости от режима
$script = @'
cd '$PWD'
Write-Host "🚀 Expo сервер запускается..." -ForegroundColor Green
Write-Host "📱 Дождитесь QR-кода`n" -ForegroundColor Yellow
Write-Host "ВАЖНО: Когда появится запрос на авторизацию:" -ForegroundColor Yellow
Write-Host "  → Используйте стрелку ВНИЗ ↓" -ForegroundColor Cyan
Write-Host "  → Выберите 'Proceed anonymously'" -ForegroundColor Cyan
Write-Host "  → Нажмите Enter`n" -ForegroundColor Cyan
'@

if ($mode -eq "tunnel") {
    $script += "npx expo start --tunnel --clear"
    Write-Host "⏳ Создание туннеля... (30-60 секунд)" -ForegroundColor Gray
} elseif ($mode -eq "lan") {
    $script += "npx expo start --lan --clear"
    Write-Host "⏳ Запуск в LAN режиме... (10-20 секунд)" -ForegroundColor Gray
} else {
    $script += "npx expo start --clear"
    Write-Host "⏳ Запуск... (10-20 секунд)" -ForegroundColor Gray
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", $script -WindowStyle Normal

Write-Host ""
Write-Host "✅ Сервер запущен в новом окне!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Yellow
Write-Host "  1. Найдите новое окно PowerShell" -ForegroundColor White
Write-Host "  2. Дождитесь QR-кода" -ForegroundColor White
Write-Host "  3. Если появится запрос - выберите 'Proceed anonymously'" -ForegroundColor White
Write-Host "  4. Откройте Expo Go → Scan QR code" -ForegroundColor White
Write-Host ""

