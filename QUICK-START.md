# ⚡ БЫСТРЫЙ СТАРТ - УК "Зелёная долина"

## 🎯 ЧТО ВАМ НУЖНО СДЕЛАТЬ

Этот документ - **ваша пошаговая инструкция** для запуска проекта в Cursor AI.

---

## 📋 ЧЕКЛИСТ ПОДГОТОВКИ

### ✅ Установленное ПО:
- [ ] **Node.js 18+** (скачать: https://nodejs.org/)
- [ ] **Git** (скачать: https://git-scm.com/)
- [ ] **GitHub Desktop** (скачать: https://desktop.github.com/)
- [ ] **Cursor AI** (скачать: https://cursor.sh/)

### ✅ Аккаунты (бесплатные):
- [ ] **GitHub** (регистрация: https://github.com/)
- [ ] **Supabase** (регистрация: https://supabase.com/)
- [ ] **Netlify** (регистрация: https://netlify.com/)

---

## 🚀 5 ШАГОВ ДО ЗАПУСКА

### ШАГ 1: Создайте папку проекта (5 минут)

1. Создайте папку на компьютере, например: `C:\Projects\uk-zeldol-app` (Windows) или `~/Projects/uk-zeldol-app` (Mac/Linux)

2. Скопируйте ВСЕ файлы из этого архива в созданную папку

3. Откройте папку в Cursor AI:
   - Запустите Cursor
   - File → Open Folder
   - Выберите `uk-zeldol-app`

---

### ШАГ 2: Установите зависимости (3 минуты)

1. В Cursor нажмите `` Ctrl+` `` (Windows) или `` Cmd+` `` (Mac) — откроется терминал

2. Выполните команды:

```bash
# Проверьте что Node.js установлен
node --version
# Должно показать v18.x.x или выше

# Установите зависимости
npm install

# Дождитесь окончания (2-3 минуты)
```

---

### ШАГ 3: Настройте Supabase (10 минут)

#### 3.1 Создайте проект

1. Зайдите на https://supabase.com/dashboard
2. Нажмите **New project**
3. Заполните:
   - Name: `uk-zeldol-app`
   - Database Password: придумайте сложный пароль (сохраните!)
   - Region: выберите ближайший (Europe West или Central)
4. Нажмите **Create new project**
5. Дождитесь создания (2-3 минуты)

#### 3.2 Скопируйте ключи API

1. В левом меню: **Settings** (⚙️) → **API**
2. Найдите раздел **Project API keys**
3. Скопируйте три значения:
   - **URL** (Project URL)
   - **anon public** (anon key)
   - **service_role** (service_role key) — нажмите "Reveal" чтобы увидеть

#### 3.3 Создайте файл .env.local

1. В Cursor откройте файл `.env.example`
2. Скопируйте его содержимое
3. Создайте новый файл `.env.local` в корне проекта
4. Вставьте скопированное и замените значения:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_ключ
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_ключ

# Остальные оставьте пока пустыми
SMSC_LOGIN=
SMSC_PASSWORD=
```

#### 3.4 Создайте базу данных

1. В Supabase Dashboard: **SQL Editor** → **New query**
2. Откройте файлы из папки `01-database/sql/` по порядку:
   - `01-enable-extensions.sql`
   - `02-residential-structure.sql`
   - `11-seed-data.sql`
3. Скопируйте содержимое каждого файла
4. Вставьте в SQL Editor
5. Нажмите **Run** (▶️)
6. Дождитесь "Success" для каждого скрипта

---

### ШАГ 4: Запустите проект (1 минута)

В терминале Cursor выполните:

```bash
npm run dev
```

Увидите:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

**Откройте браузер:** http://localhost:3000

Должна открыться главная страница приложения!

---

### ШАГ 5: Загрузите на GitHub (5 минут)

#### 5.1 Инициализируйте Git

В терминале Cursor:

```bash
git init
git add .
git commit -m "🎉 Initial commit: Project setup"
```

#### 5.2 Опубликуйте через GitHub Desktop

1. Откройте **GitHub Desktop**
2. **File** → **Add Local Repository**
3. Выберите папку `uk-zeldol-app`
4. Нажмите **Add Repository**
5. Нажмите **Publish repository**
6. Название: `uk-zeldol-app`
7. Описание: "Приложение УК Зелёная долина"
8. ✅ **Keep this code private** (если хотите приватный репозиторий)
9. Нажмите **Publish repository**

Готово! Код на GitHub!

---

## 🌐 БОНУС: Деплой на Netlify (опционально, 5 минут)

1. Зайдите на https://app.netlify.com
2. **Add new site** → **Import an existing project**
3. Выберите **GitHub**
4. Найдите репозиторий `uk-zeldol-app`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. **Environment variables** — добавьте:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [ваш URL из .env.local]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [ваш ключ из .env.local]
   SUPABASE_SERVICE_ROLE_KEY = [ваш service role из .env.local]
   ```
7. Нажмите **Deploy site**

Через 3-5 минут приложение будет доступно онлайн!

---

## ✅ ПРОВЕРКА: Всё работает?

### Локально (http://localhost:3000):
- [ ] Страница загружается без ошибок
- [ ] В консоли браузера (F12) нет красных ошибок
- [ ] Tailwind CSS работает (видны зеленые цвета)

### Supabase:
- [ ] В **Table Editor** видны таблицы: `residential_complexes`, `buildings`, `apartments`
- [ ] В таблице `residential_complexes` есть 2 записи (Маяк и Зелёная долина)

### GitHub:
- [ ] Репозиторий создан
- [ ] Все файлы загружены
- [ ] `.env.local` НЕ загружен (это правильно!)

---

## 🎯 ЧТО ДАЛЬШЕ?

### 1. Изучите документацию:
- [00-PROJECT-OVERVIEW.md](./00-PROJECT-OVERVIEW.md) — обзор проекта
- [00-project-setup/README.md](./00-project-setup/README.md) — детали настройки
- [01-database/README.md](./01-database/README.md) — структура БД

### 2. Начните разработку по модулям:

**Следующий шаг — Модуль 02: Авторизация через SMS**

В Cursor AI попросите:
```
"Создай систему авторизации через SMS код на основе 
документации в модуле 02-auth-sms"
```

### 3. Используйте Cursor AI для кода:

**Примеры промптов:**

```
"Создай компонент кнопки с зеленой темой УК из tailwind.config"
```

```
"Создай страницу входа с полем для телефона и отправкой SMS кода"
```

```
"Создай форму подачи показаний счетчиков с фото загрузкой"
```

---

## 🆘 ПРОБЛЕМЫ?

### "Module not found" при npm install
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Supabase URL is undefined"
Проверьте `.env.local` — все переменные заполнены?

### Ошибка в SQL Editor
- Убедитесь что выполнили скрипты по порядку
- Проверьте что нет опечаток при копировании

### Порт 3000 занят
```bash
# Используйте другой порт
npm run dev -- -p 3001
```

### GitHub Desktop не видит изменения
- Убедитесь что папка правильная
- Перезапустите GitHub Desktop

---

## 📞 НУЖНА ПОМОЩЬ?

1. Откройте Issues в GitHub репозитории
2. Опишите проблему подробно
3. Приложите скриншот ошибки

---

## 🎉 ПОЗДРАВЛЯЕМ!

Вы настроили проект и готовы к разработке!

**Основные файлы для работы:**
- `src/app/` — страницы приложения
- `src/components/` — React компоненты
- `src/lib/` — утилиты и Supabase клиент
- `01-database/sql/` — SQL скрипты

**Рабочий процесс:**
1. Пишете код в Cursor AI
2. Тестируете на `localhost:3000`
3. Commit в GitHub Desktop
4. Push → автоматический деплой на Netlify

---

<div align="center">

**🚀 Готовы создавать приложение для УК!**

[← Вернуться к README](./README.md) | [Обзор проекта →](./00-PROJECT-OVERVIEW.md)

</div>
