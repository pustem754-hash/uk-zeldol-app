# Скрипт для автоматической сборки iOS приложения через EAS Build
# Использование: .\build-ios-new.ps1
#Requires -Version 5.1

Write-Host ""
Write-Host "🚀 СБОРКА iOS ПРИЛОЖЕНИЯ ЧЕРЕЗ EAS BUILD" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# ШАГ 1: Остановка процессов Node.js
Write-Host "📋 ШАГ 1: Остановка процессов Node.js..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Процессы Node.js остановлены" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Процессы Node.js не найдены (это нормально)" -ForegroundColor Gray
}
Start-Sleep -Seconds 2

# ШАГ 2: Проверка EAS CLI
Write-Host ""
Write-Host "📋 ШАГ 2: Проверка EAS CLI..." -ForegroundColor Yellow
$easVersion = eas --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ EAS CLI установлен: $easVersion" -ForegroundColor Green
} else {
    Write-Host "❌ EAS CLI не установлен. Устанавливаю..." -ForegroundColor Red
    Write-Host ""
    npm install -g eas-cli --legacy-peer-deps
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ EAS CLI установлен" -ForegroundColor Green
    } else {
        Write-Host "❌ Ошибка установки EAS CLI" -ForegroundColor Red
        exit 1
    }
}

# Функция для вывода сообщения об отсутствии авторизации
function Show-AuthRequired {
    Write-Host "❌ Не авторизован в EAS!" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  ТРЕБУЕТСЯ АВТОРИЗАЦИЯ:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Выполните в терминале одну из команд:" -ForegroundColor White
    Write-Host "  eas login      - для входа в существующий аккаунт" -ForegroundColor Cyan
    Write-Host "  eas register   - для создания нового аккаунта" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "После авторизации запустите этот скрипт снова:" -ForegroundColor Yellow
    Write-Host "  .\build-ios-new.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Или выполните сборку вручную:" -ForegroundColor Yellow
    Write-Host "  eas build --platform ios --profile preview --clear-cache" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# ШАГ 3: Проверка авторизации
Write-Host ""
Write-Host "📋 ШАГ 3: Проверка авторизации в Expo..." -ForegroundColor Yellow

# Проверка авторизации через eas whoami
$whoamiOutput = eas whoami 2>&1
$whoamiExitCode = $LASTEXITCODE

# Проверяем результат команды
if ($whoamiExitCode -ne 0) {
    Show-AuthRequired
}

$outputString = if ($whoamiOutput -is [array]) { 
    $whoamiOutput -join [Environment]::NewLine
} else { 
    $whoamiOutput.ToString() 
}

if (-not $outputString -or $outputString -match "Not logged in" -or $outputString -match "Error" -or $outputString.Trim().Length -eq 0) {
    Show-AuthRequired
}

$username = ($whoamiOutput | Select-Object -First 1).ToString().Trim()
if (-not $username -or $username.Length -eq 0) {
    Show-AuthRequired
}

Write-Host "✅ Авторизован как: $username" -ForegroundColor Green

# ШАГ 4: Проверка конфигурации
Write-Host ""
Write-Host "📋 ШАГ 4: Проверка конфигурации..." -ForegroundColor Yellow
if (-not (Test-Path "app.json")) {
    Write-Host "❌ Файл app.json не найден!" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "eas.json")) {
    Write-Host "❌ Файл eas.json не найден!" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "assets\icon\app-icon.png")) {
    Write-Host "❌ Иконка не найдена: assets\icon\app-icon.png" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Конфигурация проверена" -ForegroundColor Green

# ШАГ 5: Запуск сборки
Write-Host ""
Write-Host "📋 ШАГ 5: Запуск iOS сборки..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  ВАЖНО:" -ForegroundColor Red
Write-Host "  • Сборка займёт 10-20 минут" -ForegroundColor White
Write-Host "  • НЕ закрывайте терминал!" -ForegroundColor White
Write-Host "  • Дождитесь сообщения 'Build finished'" -ForegroundColor White
Write-Host ""
Write-Host "🚀 ЗАПУСК СБОРКИ..." -ForegroundColor Cyan
Write-Host ""

# Запуск сборки с обработкой ошибок
Write-Host "Запуск команды сборки..." -ForegroundColor Gray

# Запуск команды и захват вывода
$buildOutput = @()
try {
    # Захватываем весь вывод команды
    $buildOutput = eas build --platform ios --profile preview --clear-cache 2>&1
    $buildExitCode = $LASTEXITCODE
} catch {
    Write-Host "Ошибка при запуске команды сборки: $_" -ForegroundColor Red
    $buildExitCode = 1
}

# Выводим результат в консоль
$buildOutput | ForEach-Object { Write-Host $_ }

# Сохранение полного вывода в файл для последующего анализа
$buildOutput | Out-File -FilePath "build_output.txt" -Encoding UTF8

if ($buildExitCode -eq 0) {
    Write-Host ""
    Write-Host "✅ Сборка завершена успешно!" -ForegroundColor Green
    
    # Попытка извлечь ссылку на сборку из вывода
    $buildUrl = $null
    if ($buildOutput) {
        # Преобразуем массив в строку
        $outputText = if ($buildOutput -is [array]) { 
            $buildOutput -join [Environment]::NewLine
        } else { 
            $buildOutput.ToString() 
        }
        
        if ($outputText) {
            # Ищем URL сборки в разных форматах
            $patterns = @(
                "https://expo\.dev/accounts/[^/\s]+/projects/[^/\s]+/builds/[^\s]+",
                "https://expo\.dev/accounts/[^/\s]+/builds/[^\s]+",
                "https://expo\.dev/builds/[^\s]+"
            )
            
            foreach ($pattern in $patterns) {
                $urlMatches = [regex]::Matches($outputText, $pattern)
                if ($urlMatches.Count -gt 0) {
                    $buildUrl = $urlMatches[0].Value
                    break
                }
            }
        }
    }
    
    Write-Host ""
    Write-Host "📱 СЛЕДУЮЩИЕ ШАГИ:" -ForegroundColor Yellow
    if ($buildUrl) {
        Write-Host "  Ссылка на сборку: $buildUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  1. Скопируйте ссылку выше" -ForegroundColor White
        
        # Сохранение ссылки в файл
        $buildUrl | Out-File -FilePath "BUILD_URL.txt" -Encoding UTF8 -NoNewline
        Write-Host "  ✅ Ссылка сохранена в BUILD_URL.txt" -ForegroundColor Green
    } else {
        Write-Host "  1. Найдите ссылку на сборку в выводе выше" -ForegroundColor White
        Write-Host "     Или проверьте: eas build:list --platform ios" -ForegroundColor Gray
    }
    Write-Host "  2. Откройте ссылку в Safari на iPhone (НЕ в Expo Go!)" -ForegroundColor White
    Write-Host "  3. Установите приложение" -ForegroundColor White
    Write-Host "  4. Следуйте инструкции в INSTALL-INSTRUCTIONS.md" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Ошибка при сборке" -ForegroundColor Red
    Write-Host ""
    Write-Host "Проверьте:" -ForegroundColor Yellow
    Write-Host "  • Логи выше для деталей ошибки" -ForegroundColor White
    Write-Host "  • Файл build_output.txt с полным выводом" -ForegroundColor White
    Write-Host "  • Статус сборки: eas build:list --platform ios" -ForegroundColor White
    Write-Host "  • Детали сборки: eas build:view [ID]" -ForegroundColor White
    Write-Host ""
    
    # Попытка получить список последних сборок
    Write-Host "Последние сборки:" -ForegroundColor Yellow
    eas build:list --platform ios --limit 3 2>&1 | Out-Host
    
    exit 1
}

# Вывод сохранён в build_output.txt для анализа

