# КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ iOS ПРИЛОЖЕНИЯ
# Автоматизация всех шагов исправления

Write-Host "🚀 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ iOS ПРИЛОЖЕНИЯ" -ForegroundColor Green
Write-Host "==========================================`n" -ForegroundColor Green

# ШАГ 3: Проверка иконки
Write-Host "📋 ШАГ 3: Проверка файла иконки..." -ForegroundColor Yellow
$iconPath = "assets\icon\app-icon.png"
if (Test-Path $iconPath) {
    $file = Get-Item $iconPath
    $sizeKB = [math]::Round($file.Length / 1KB, 2)
    Write-Host "✅ Файл иконки найден: $iconPath" -ForegroundColor Green
    Write-Host "   Размер: $sizeKB KB" -ForegroundColor Cyan
    Write-Host "   Формат: $($file.Extension)" -ForegroundColor Cyan
    if ($sizeKB -lt 100) {
        Write-Host "⚠️  ВНИМАНИЕ: Размер файла меньше 100 KB!" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Размер файла в норме" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Файл иконки не найден: $iconPath" -ForegroundColor Red
    Write-Host "   ОСТАНОВКА: Необходимо добавить файл иконки!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 ШАГ 4: Очистка кеша..." -ForegroundColor Yellow

# Остановка всех процессов Node.js
Write-Host "   Остановка процессов Node.js..." -ForegroundColor Gray
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# Очистка кеша npm
Write-Host "   Очистка кеша npm..." -ForegroundColor Gray
npm cache clean --force 2>$null

# Удаление node_modules (если нужно)
Write-Host "   Проверка node_modules..." -ForegroundColor Gray
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules найден" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules отсутствует, будет переустановлен" -ForegroundColor Yellow
}

Write-Host "✅ Кеш очищен`n" -ForegroundColor Green

# ШАГ 5: Проверка авторизации EAS
Write-Host "📋 ШАГ 5: Проверка авторизации EAS..." -ForegroundColor Yellow
$whoami = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Вы не авторизованы в EAS!" -ForegroundColor Red
    Write-Host "`n   Выполните авторизацию:" -ForegroundColor Yellow
    Write-Host "   eas login" -ForegroundColor Cyan
    Write-Host "`n   После авторизации запустите сборку вручную:" -ForegroundColor Yellow
    Write-Host "   eas build --platform ios --profile preview --clear-cache" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Авторизация успешна" -ForegroundColor Green
Write-Host "   Пользователь: $($whoami | Select-Object -First 1)" -ForegroundColor Gray

# ШАГ 6: Запуск сборки
Write-Host "`n📋 ШАГ 6: Запуск сборки iOS приложения..." -ForegroundColor Yellow
Write-Host "   Это может занять 10-20 минут..." -ForegroundColor Gray
Write-Host "   Профиль: preview" -ForegroundColor Gray
Write-Host "   Платформа: iOS" -ForegroundColor Gray
Write-Host "`n🚀 ЗАПУСК СБОРКИ...`n" -ForegroundColor Cyan

eas build --platform ios --profile preview --clear-cache

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Сборка завершена успешно!" -ForegroundColor Green
    Write-Host "`n📱 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Yellow
    Write-Host "   1. Откройте https://expo.dev в браузере" -ForegroundColor White
    Write-Host "   2. Войдите в свой аккаунт" -ForegroundColor White
    Write-Host "   3. Перейдите в раздел 'Builds'" -ForegroundColor White
    Write-Host "   4. Найдите последнюю iOS сборку" -ForegroundColor White
    Write-Host "   5. Скопируйте ссылку для установки" -ForegroundColor White
    Write-Host "   6. Следуйте инструкции в INSTALL-INSTRUCTIONS.md" -ForegroundColor White
} else {
    Write-Host "`n❌ Ошибка при сборке" -ForegroundColor Red
    Write-Host "   Проверьте логи выше" -ForegroundColor Yellow
    Write-Host "   Или выполните: eas build:list --platform ios" -ForegroundColor Cyan
    exit 1
}

