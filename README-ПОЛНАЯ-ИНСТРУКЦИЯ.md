# 🏢 УК "ЗЕЛЁНАЯ ДОЛИНА" - ПОЛНАЯ ИНСТРУКЦИЯ

## 📋 ЧТО НУЖНО СДЕЛАТЬ ПЕРЕД ЗАПУСКОМ

### 1. Скачать логотипы ⚠️ ВАЖНО!

Откройте файл: **СКАЧАТЬ-ЛОГОТИПЫ.txt**

Скачайте эти файлы и разместите в `public/`:
- `logo.png` (логотип УК)
- `palgate-logo.png` (логотип PalGate)
- `favicon.ico` (16x16 и 32x32)
- `logo-192.png` (192x192 для PWA)
- `logo-512.png` (512x512 для PWA)

**Ссылки:**
1. Логотип УК: https://page.gensparksite.com/v1/base64_upload/e50ecd4a6226287d71b6a8b7f7cab0cd
2. Логотип PalGate: https://page.gensparksite.com/v1/base64_upload/63603ae7344bbded19a8c3805ec7937b

### 2. Установить PostgreSQL

Если у вас нет PostgreSQL:
1. Скачайте с https://www.postgresql.org/download/
2. Установите
3. Создайте базу данных:
   ```bash
   psql -U postgres
   CREATE DATABASE uk_zeldol;
   \q
   ```

### 3. Создать базу данных

```bash
cd uk-zeldol-app
psql -U postgres -d uk_zeldol -f database.sql
```

### 4. Установить зависимости Node.js

```bash
cd uk-zeldol-app
npm install express pg multer exceljs axios cors dotenv
```

### 5. Создать файл .env

Создайте файл `.env` в корне проекта:

```env
# База данных
DATABASE_URL=postgresql://postgres:password@localhost:5432/uk_zeldol

# Сервер
PORT=3000
NODE_ENV=development

# SMS (SMS.ru / Twilio)
SMS_API_KEY=your_sms_api_key
SMS_SENDER=UKZelDol

# PalGate (шлагбаум)
PALGATE_MAYAK_IP=192.168.1.100
PALGATE_ZELDOL_IP=192.168.1.101
PALGATE_API_KEY=your_palgate_key

# Dali Telecom (видеонаблюдение)
DALI_TELECOM_API_URL=https://api.dalitelecom.ru
DALI_TELECOM_API_KEY=your_dali_key

# ЮKassa (оплата)
YUKASSA_SHOP_ID=your_shop_id
YUKASSA_SECRET_KEY=your_secret_key

# JWT
JWT_SECRET=your_jwt_secret

# Контакты УК
UK_PHONE=89600720321
UK_PHONE_FORMATTED=8 960 072 03 21
UK_EMAIL=uk-zeldol@yandex.ru
```

### 6. Запустить сервер

```bash
npm start
# или в режиме разработки:
npm run dev
```

Откройте: **http://localhost:3000**

---

## 📱 ТЕСТОВЫЕ ДАННЫЕ ДЛЯ ВХОДА

### Директор:
- Телефон: `89600720321`
- Код: любой 4-значный

### Житель:
- Телефон: `79001234567`
- Код: любой 4-значный

### Диспетчер:
- Телефон: `79001234568`
- Код: любой 4-значный

### Мастер:
- Телефон: `79001234569`
- Код: любой 4-значный

### Админ:
- Телефон: `79001234570`
- Код: любой 4-значный

---

## 📁 СТРУКТУРА ПРОЕКТА

```
uk-zeldol-app/
├── public/
│   ├── index.html              ✅ Главная (вход)
│   ├── dashboard.html          ✅ Личный кабинет
│   ├── payments.html           ✅ Платежи
│   ├── meters.html             ✅ Счётчики
│   ├── requests.html           ✅ Заявки
│   ├── profile.html            ✅ Профиль
│   ├── notifications.html      ✅ Уведомления
│   ├── cameras.html            ✅ Видеонаблюдение
│   ├── access.html             ✅ Шлагбаум
│   ├── dispatcher.html         ✅ Панель диспетчера
│   ├── manager.html            ✅ Панель директора
│   ├── admin.html              ✅ Админ-панель
│   ├── logo.png                ⚠️ НУЖНО СКАЧАТЬ
│   ├── palgate-logo.png        ⚠️ НУЖНО СКАЧАТЬ
│   ├── favicon.ico             ⚠️ НУЖНО СОЗДАТЬ
│   ├── logo-192.png            ⚠️ НУЖНО СОЗДАТЬ
│   ├── logo-512.png            ⚠️ НУЖНО СОЗДАТЬ
│   ├── styles.css              ✅ Стили
│   ├── app.js                  ✅ JavaScript
│   ├── manifest.json           ✅ PWA
│   └── sw.js                   ✅ Service Worker
├── uploads/
│   ├── receipts/               (платёжки)
│   └── meters/                  (фото счётчиков)
├── server.js                   ✅ Backend
├── database.sql                ✅ База данных
├── package.json                ✅ Зависимости
└── .env                        ⚠️ НУЖНО СОЗДАТЬ
```

---

## 🎨 ЦВЕТОВАЯ СХЕМА

- **Основной зелёный**: `#4CAF50`
- **Тёмно-зелёный**: `#2E7D32`
- **Светло-зелёный**: `#81C784`
- **Белый**: `#FFFFFF`
- **Серый фон**: `#F5F5F5`
- **Красный (долги)**: `#f44336`

---

## 🔧 ФУНКЦИОНАЛ

### Для жителей:
✅ Вход по телефону + SMS-код  
✅ Просмотр начислений и квитанций  
✅ Передача показаний счётчиков  
✅ Создание заявок с фото/видео  
✅ Управление шлагбаумом  
✅ Просмотр видеокамер  
✅ Уведомления от УК  

### Для диспетчеров:
✅ Приём заявок жителей  
✅ Назначение мастеров  
✅ Чат с жителями  

### Для директора:
✅ Финансовая статистика  
✅ Проверка оплат по чекам  
✅ Управление должниками  
✅ Рассылки  

### Для админа:
✅ Управление пользователями  
✅ Экспорт формы 4.0 для ЕРЦ  
✅ Управление камерами  
✅ Настройки системы  

---

## 🚀 БЫСТРЫЙ СТАРТ

```bash
# 1. Установите зависимости
npm install

# 2. Создайте .env файл (см. выше)

# 3. Создайте базу данных
psql -U postgres -d uk_zeldol -f database.sql

# 4. Запустите сервер
npm start

# 5. Откройте браузер
http://localhost:3000
```

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **Логотипы** нужно скачать вручную (см. СКАЧАТЬ-ЛОГОТИПЫ.txt)
2. **PostgreSQL** должен быть установлен и запущен
3. **.env** файл обязателен для работы
4. **Учетные записи** см. в секции "Тестовые данные"

---

**Приятного использования! 🎉**








