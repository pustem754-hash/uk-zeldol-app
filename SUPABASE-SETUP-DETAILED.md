# 🔄 ПОДКЛЮЧЕНИЕ SUPABASE - ДЕТАЛЬНАЯ ИНСТРУКЦИЯ

---

## 📋 ШАГ 1: СОЗДАЙТЕ НОВЫЙ ПРОЕКТ (5 минут)

### 1.1 Откройте Supabase Dashboard

1. Зайдите на: https://supabase.com/dashboard
2. Если нужно - войдите в свой аккаунт

### 1.2 Создайте новый проект

1. Нажмите кнопку **"New Project"** (зеленая кнопка справа)

2. Заполните форму:

```
Organization: [выберите существующую или создайте "UK Zeldol"]
Name: uk-zeldol-app
Database Password: [ПРИДУМАЙТЕ СЛОЖНЫЙ ПАРОЛЬ И СОХРАНИТЕ ЕГО!]
              Пример: UkZ3ld0l_2025!@#
              ⚠️ ЗАПИШИТЕ ПАРОЛЬ - ПОНАДОБИТСЯ!

Region: выберите ближайший:
  ✅ Europe West (Ireland) - рекомендую для России
  ✅ Europe Central (Frankfurt)
  
Pricing Plan: FREE (бесплатно)
```

3. Нажмите **"Create new project"**

4. ⏳ Подождите 2-3 минуты пока проект создается
   - Увидите индикатор загрузки
   - НЕ закрывайте страницу!

---

## 📋 ШАГ 2: ПОЛУЧИТЕ API КЛЮЧИ (2 минуты)

### 2.1 Перейдите в настройки API

1. В левом меню найдите: **⚙️ Settings** (внизу)
2. Нажмите **Settings**
3. В подменю выберите: **API**

### 2.2 Скопируйте ключи

Вы увидите раздел **"Project API keys"**. Скопируйте 3 значения:

#### ① Project URL:
```
Пример: https://abcdefghijk.supabase.co
```

#### ② anon public (публичный ключ):
```
Начинается с: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Длина: ~200+ символов
```

#### ③ service_role (приватный ключ):
```
⚠️ Нажмите кнопку "Reveal" чтобы увидеть!
Начинается с: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Длина: ~200+ символов
```

### 2.3 Сохраните ключи

**Вариант А: Создайте текстовый файл на компьютере**

Создайте файл `supabase-keys.txt`:

```
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Вариант Б: Сразу вставьте в .env.local**

Откройте проект в Cursor AI и создайте файл `.env.local` в корне:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SMS Gateway (пока оставьте пустым)
SMSC_LOGIN=
SMSC_PASSWORD=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=УК Зелёная долина
```

⚠️ **ВАЖНО:** Замените `abcdefghijk` и `eyJ...` на ВАШИ реальные значения!

---

## 📋 ШАГ 3: СОЗДАЙТЕ БАЗУ ДАННЫХ (8 минут)

### 3.1 Откройте SQL Editor

1. В левом меню: **SQL Editor** (иконка </> )
2. Нажмите **"New query"**

### 3.2 Выполните SQL скрипты ПО ПОРЯДКУ

Откройте файлы из папки `01-database/sql/` и выполните их:

---

#### 📄 СКРИПТ 1: Расширения и типы (1 минута)

**Файл:** `01-enable-extensions.sql`

1. Откройте файл в текстовом редакторе
2. Скопируйте ВСЁ содержимое (Ctrl+A → Ctrl+C)
3. Вставьте в SQL Editor (Ctrl+V)
4. Нажмите **"Run"** (▶️) или **F5**
5. Дождитесь сообщения: `Success. No rows returned`

✅ **Что создано:**
- Расширения PostgreSQL (uuid, триграммы)
- Enum типы (роли, статусы)

---

#### 📄 СКРИПТ 2: Структура недвижимости (2 минуты)

**Файл:** `02-residential-structure.sql`

1. **Очистите** SQL Editor (удалите предыдущий текст)
2. Откройте файл `02-residential-structure.sql`
3. Скопируйте всё содержимое
4. Вставьте в SQL Editor
5. Нажмите **"Run"** (▶️)
6. Дождитесь: `Success. No rows returned`

✅ **Что создано:**
- `residential_complexes` (ЖК)
- `buildings` (дома)
- `apartments` (квартиры + кладовки)

**Проверка:** Перейдите в **Table Editor** → должны появиться 3 таблицы

---

#### 📄 СКРИПТ 3: Профили и авторизация (2 минуты)

**Файл:** `03-profiles-auth.sql`

Создайте этот файл если его нет (я создам для вас ниже):

```sql
-- ================================================
-- ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ И АВТОРИЗАЦИЯ
-- ================================================

-- Профили пользователей
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  role user_role NOT NULL DEFAULT 'resident',
  is_debtor BOOLEAN DEFAULT false,
  debt_amount NUMERIC(10, 2) DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMS коды для авторизации
CREATE TABLE sms_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Привязка жителей к квартирам/кладовкам
CREATE TABLE resident_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  is_owner BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, apartment_id)
);

-- Индексы
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_sms_codes_phone ON sms_codes(phone);
CREATE INDEX idx_sms_codes_expires ON sms_codes(expires_at);
CREATE INDEX idx_resident_accounts_user ON resident_accounts(user_id);
CREATE INDEX idx_resident_accounts_apartment ON resident_accounts(apartment_id);

-- Триггер обновления updated_at
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON profiles
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Комментарии
COMMENT ON TABLE profiles IS 'Профили пользователей всех ролей';
COMMENT ON TABLE sms_codes IS 'SMS коды для авторизации';
COMMENT ON TABLE resident_accounts IS 'Привязка пользователей к лицевым счетам (квартира + кладовки)';

DO $$
BEGIN
  RAISE NOTICE '✅ Таблицы профилей и авторизации созданы!';
END $$;
```

Выполните как предыдущие скрипты.

✅ **Что создано:**
- `profiles` (пользователи с ролями)
- `sms_codes` (коды авторизации)
- `resident_accounts` (привязка телефона к ЛС)

---

#### 📄 СКРИПТ 4: Счетчики (2 минуты)

**Файл:** `04-meters.sql`

```sql
-- ================================================
-- СЧЕТЧИКИ И ПОКАЗАНИЯ
-- ================================================

-- Счетчики
CREATE TABLE meters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  type meter_type NOT NULL,
  serial_number TEXT,
  installation_date DATE,
  next_verification_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Показания счетчиков (ФОРМА 4)
CREATE TABLE meter_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meter_id UUID NOT NULL REFERENCES meters(id) ON DELETE CASCADE,
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  previous_value NUMERIC(10, 2) NOT NULL,
  current_value NUMERIC(10, 2) NOT NULL,
  consumption NUMERIC(10, 2),
  photo_url TEXT,
  submitted_by UUID NOT NULL REFERENCES profiles(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status reading_status DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Тарифы
CREATE TABLE tariffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type service_type NOT NULL,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_meters_apartment ON meters(apartment_id);
CREATE INDEX idx_meters_type ON meters(type);
CREATE INDEX idx_readings_meter ON meter_readings(meter_id);
CREATE INDEX idx_readings_apartment ON meter_readings(apartment_id);
CREATE INDEX idx_readings_status ON meter_readings(status);
CREATE INDEX idx_readings_date ON meter_readings(submitted_at);

-- Автоматический расчет потребления
CREATE OR REPLACE FUNCTION calculate_consumption()
RETURNS TRIGGER AS $$
BEGIN
  NEW.consumption = NEW.current_value - NEW.previous_value;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_consumption_trigger
BEFORE INSERT OR UPDATE ON meter_readings
FOR EACH ROW
EXECUTE FUNCTION calculate_consumption();

COMMENT ON TABLE meter_readings IS 'ФОРМА 4: Показания счетчиков от жителей';

DO $$
BEGIN
  RAISE NOTICE '✅ Таблицы счетчиков и показаний созданы!';
END $$;
```

---

#### 📄 СКРИПТ 5: Начальные данные (1 минута)

**Файл:** `11-seed-data.sql` (уже есть в проекте)

Выполните как обычно.

✅ **Что добавлено:**
- 2 ЖК (Маяк, Зелёная долина)
- 6 домов с адресами
- Категории заявок
- Тарифы на услуги

---

### 3.3 ПРОВЕРКА: Таблицы созданы?

1. Перейдите в **Table Editor** (левое меню)
2. Должны увидеть таблицы:
   ```
   ✅ residential_complexes
   ✅ buildings
   ✅ apartments
   ✅ profiles
   ✅ sms_codes
   ✅ resident_accounts
   ✅ meters
   ✅ meter_readings
   ✅ tariffs
   ```

3. Кликните на `residential_complexes`
4. Должны увидеть 2 записи:
   - ЖК "Маяк"
   - ЖК "Зелёная долина"

✅ **ЕСЛИ ВСЁ ОК - БАЗА ДАННЫХ ГОТОВА!**

---

## 📋 ШАГ 4: НАСТРОЙТЕ .env.local В ПРОЕКТЕ (2 минуты)

### 4.1 Откройте проект в Cursor AI

1. Откройте папку проекта `uk-zeldol-app`
2. В корне проекта найдите файл `.env.example`

### 4.2 Создайте .env.local

1. Скопируйте `.env.example` → назовите `.env.local`
2. Откройте `.env.local`
3. Вставьте ваши ключи Supabase:

```env
# Supabase (ВСТАВЬТЕ ВАШИ КЛЮЧИ!)
NEXT_PUBLIC_SUPABASE_URL=https://ВАШИХ-abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz... (ваш ключ)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUz... (ваш service_role)

# SMS Gateway (ЕСЛИ УЖЕ ЕСТЬ)
SMSC_LOGIN=ваш_логин
SMSC_PASSWORD=ваш_пароль

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=УК Зелёная долина
```

4. Сохраните файл (Ctrl+S)

---

## 📋 ШАГ 5: ЗАПУСТИТЕ ПРОЕКТ (2 минуты)

### 5.1 Откройте терминал в Cursor

Нажмите `` Ctrl+` `` (Windows) или `` Cmd+` `` (Mac)

### 5.2 Установите зависимости (если еще не делали)

```bash
npm install
```

Подождите 1-2 минуты

### 5.3 Запустите dev server

```bash
npm run dev
```

Должны увидеть:

```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### 5.4 Откройте в браузере

1. Откройте: http://localhost:3000
2. Страница должна загрузиться без ошибок
3. Откройте Console (F12) - не должно быть красных ошибок

✅ **ЕСЛИ СТРАНИЦА ОТКРЫЛАСЬ - SUPABASE ПОДКЛЮЧЕН!**

---

## 📋 ШАГ 6: ДОБАВЬТЕ КЛЮЧИ В NETLIFY (3 минуты)

### 6.1 Откройте Netlify Dashboard

1. Зайдите на: https://app.netlify.com
2. Найдите свой сайт `uk-zeldol-app` (или как вы назвали)
3. Нажмите на него

### 6.2 Добавьте Environment Variables

1. В меню сайта: **Site configuration** → **Environment variables**
2. Нажмите **Add a variable** → **Add a single variable**

Добавьте ПО ОДНОЙ каждую переменную:

#### Переменная 1:
```
Key:   NEXT_PUBLIC_SUPABASE_URL
Value: https://ваш-проект.supabase.co
```
Нажмите **Create variable**

#### Переменная 2:
```
Key:   NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUz... (ваш anon ключ)
```
Нажмите **Create variable**

#### Переменная 3:
```
Key:   SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUz... (ваш service_role)
```
Нажмите **Create variable**

### 6.3 Передеплойте сайт

1. Вверху страницы: **Deploys**
2. Нажмите **Trigger deploy** → **Clear cache and deploy site**
3. Подождите 2-3 минуты

✅ **ГОТОВО! Netlify подключен к новой Supabase БД!**

---

## ✅ ПРОВЕРОЧНЫЙ ЧЕКЛИСТ

Отметьте что сделали:

- [ ] Создал проект в Supabase
- [ ] Скопировал 3 ключа API
- [ ] Выполнил SQL скрипты (01, 02, 03, 04, 11)
- [ ] Проверил что таблицы созданы (Table Editor)
- [ ] Создал `.env.local` в проекте
- [ ] Вставил ключи Supabase в `.env.local`
- [ ] Запустил `npm install`
- [ ] Запустил `npm run dev`
- [ ] Открыл http://localhost:3000 - работает
- [ ] Добавил переменные в Netlify
- [ ] Передеплоил Netlify

---

## 🆘 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ

### Ошибка: "Supabase URL is undefined"
**Решение:** Проверьте `.env.local` - все переменные должны начинаться с `NEXT_PUBLIC_SUPABASE_`

### Ошибка: "relation does not exist"
**Решение:** Не выполнены SQL скрипты. Вернитесь к Шагу 3.2

### Ошибка: "Invalid API key"
**Решение:** 
1. Проверьте что скопировали правильный ключ
2. В Supabase: Settings → API → скопируйте заново
3. Обновите `.env.local`
4. Перезапустите `npm run dev`

### Порт 3000 занят
**Решение:**
```bash
npm run dev -- -p 3001
# Откройте http://localhost:3001
```

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

После успешного подключения:

1. ✅ **Добавьте себя как тестового пользователя** (SQL ниже)
2. ✅ **Попросите Курсор создать страницу входа**
3. ✅ **Протестируйте авторизацию**

### SQL: Добавить себя как админа

```sql
-- 1. Создайте auth пользователя в Supabase Dashboard:
--    Authentication → Users → Add user
--    Email: admin@uk-zeldol.ru
--    Password: (придумайте)
--    Auto Confirm User: ✅

-- 2. Выполните этот SQL (замените UUID на ваш):
INSERT INTO profiles (id, phone, full_name, role) 
VALUES (
  'ВАШ-UUID-ИЗ-auth.users', 
  '+79600720321',
  'Галлямов Руслан Рафисович',
  'admin'
);
```

---

**🎉 SUPABASE ПОДКЛЮЧЕН! ГОТОВО К РАЗРАБОТКЕ!**
