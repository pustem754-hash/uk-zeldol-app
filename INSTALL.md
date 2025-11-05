# 📦 Установка и запуск проекта

## ✅ Предварительные требования

- **Node.js 16+** (скачать: https://nodejs.org/)
- **npm** (устанавливается вместе с Node.js)

## 🚀 Быстрая установка

### 1. Установите зависимости

```bash
cd uk-zeldol-app
npm install
```

Это займет 1-2 минуты.

### 2. Настройте переменные окружения

Создайте файл `.env` в корне проекта:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_ключ
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_ключ
PORT=3000
```

### 3. Запустите сервер

Для разработки (с автоперезагрузкой):
```bash
npm run dev
```

Для production:
```bash
npm start
```

Сервер будет доступен по адресу: http://localhost:3000

## 📝 API Endpoints

- `GET /` - Информация о сервере
- `GET /health` - Проверка работоспособности

## 🔧 Решение проблем

### Ошибка: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Порт 3000 занят

Измените порт в `.env`:
```env
PORT=3001
```

### Ошибка: "Supabase URL is undefined"

Проверьте, что файл `.env` существует и содержит все необходимые переменные.

## 📚 Документация

- [README.md](./README.md) - Общее описание проекта
- [QUICK-START.md](./QUICK-START.md) - Быстрый старт
- [00-PROJECT-OVERVIEW.md](./00-PROJECT-OVERVIEW.md) - Детальный обзор
- [MODULES-ROADMAP.md](./MODULES-ROADMAP.md) - Дорожная карта модулей

## ✨ Следующие шаги

1. Настройте Supabase (см. [SUPABASE-SETUP-DETAILED.md](./SUPABASE-SETUP-DETAILED.md))
2. Выполните SQL скрипты из `01-database/sql/`
3. Начните разработку API routes по [MODULES-ROADMAP.md](./MODULES-ROADMAP.md)
