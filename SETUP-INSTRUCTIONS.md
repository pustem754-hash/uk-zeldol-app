# 🚀 Инструкция по установке и настройке

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Настройка переменных окружения

Создайте файл `.env.local` на основе `.env.example`:

```bash
# Скопируйте .env.example в .env.local
cp .env.example .env.local
```

Заполните переменные в `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - URL вашего Supabase проекта
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon ключ из Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role ключ из Supabase

## Шаг 3: Первый запуск

```bash
npm run dev
```

Откройте http://localhost:3000 в браузере.

## Шаг 4: Проверка

Убедитесь что:
- ✅ Страница загружается без ошибок
- ✅ Tailwind CSS работает
- ✅ Нет ошибок в консоли браузера

## Следующие шаги

1. Настройте Supabase согласно инструкции в `01-database/README.md`
2. Заполните базу данных начальными данными
3. Настройте деплой на Netlify


