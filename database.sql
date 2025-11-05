-- БАЗА ДАННЫХ УК "ЗЕЛЁНАЯ ДОЛИНА"
-- PostgreSQL

CREATE DATABASE uk_zeldol;

\c uk_zeldol;

-- Пользователи
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'житель',
  sms_code VARCHAR(4),
  sms_code_expires TIMESTAMP,
  is_blocked BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Объекты недвижимости
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type VARCHAR(20), -- квартира/кладовая
  complex VARCHAR(50), -- Маяк/Зелёная Долина
  address TEXT,
  building VARCHAR(50),
  number VARCHAR(10), -- кв. 45 / кл. 12
  account_number VARCHAR(20) UNIQUE,
  area DECIMAL(10,2),
  registered INT DEFAULT 0,
  is_debtor BOOLEAN DEFAULT FALSE,
  debt_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Начисления
CREATE TABLE charges (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(id),
  month VARCHAR(7), -- YYYY-MM
  service VARCHAR(50),
  amount DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'ожидает',
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Платежи
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  charge_id INT REFERENCES charges(id),
  payment_date TIMESTAMP,
  amount DECIMAL(10,2),
  method VARCHAR(50),
  receipt_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Загруженные чеки
CREATE TABLE payment_receipts (
  id SERIAL PRIMARY KEY,
  account_number VARCHAR(20),
  user_id INT REFERENCES users(id),
  service VARCHAR(50),
  amount DECIMAL(10,2),
  payment_date DATE,
  payment_method VARCHAR(50),
  receipt_url TEXT,
  status VARCHAR(20) DEFAULT 'Проверяется',
  approved_by INT REFERENCES users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Счётчики
CREATE TABLE meters (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(id),
  meter_type VARCHAR(50), -- electricity, cold_water, hot_water, gas
  meter_number VARCHAR(50),
  previous_reading DECIMAL(10,2),
  current_reading DECIMAL(10,2),
  reading_date DATE,
  photo_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Заявки
CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  property_id INT REFERENCES properties(id),
  user_id INT REFERENCES users(id),
  category VARCHAR(50),
  description TEXT,
  urgency VARCHAR(20), -- обычная/срочная/аварийная
  status VARCHAR(50) DEFAULT 'новая',
  assigned_to INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  rejection_reason TEXT,
  rating INT,
  review TEXT
);

-- Медиафайлы заявок
CREATE TABLE request_media (
  id SERIAL PRIMARY KEY,
  request_id INT REFERENCES requests(id),
  media_type VARCHAR(20), -- photo/video/audio
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Уведомления
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Камеры Dali Telecom
CREATE TABLE cameras (
  id SERIAL PRIMARY KEY,
  complex VARCHAR(50),
  building VARCHAR(50),
  location VARCHAR(100),
  stream_url TEXT,
  dali_camera_id VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE
);

-- Логи шлагбаума PalGate
CREATE TABLE gate_access_log (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  phone VARCHAR(20),
  address TEXT,
  action VARCHAR(20), -- open/close
  timestamp TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20), -- success/error
  error_message TEXT
);

-- Индексы для быстрого поиска
CREATE INDEX idx_properties_user ON properties(user_id);
CREATE INDEX idx_charges_property ON charges(property_id);
CREATE INDEX idx_requests_user ON requests(user_id);
CREATE INDEX idx_gate_log_phone ON gate_access_log(phone);
CREATE INDEX idx_receipts_status ON payment_receipts(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Тестовые данные
INSERT INTO users (phone, full_name, role) VALUES 
  ('89600720321', 'Галлямов Руслан Рафисович', 'директор'),
  ('79001234567', 'Иванов Иван Иванович', 'житель'),
  ('79001234568', 'Петров Петр Петрович', 'диспетчер'),
  ('79001234569', 'Сидоров Сидор Сидорович', 'мастер'),
  ('79001234570', 'Дмитриев Дмитрий Дмитриевич', 'админ');

INSERT INTO properties (user_id, type, complex, address, number, account_number, area, registered_count, is_debtor, debt_amount) VALUES 
  (2, 'квартира', 'Зелёная Долина', 'мкр. Зелёная Долина, д. 3, кв. 45', 'кв. 45', '1234567890', 65.5, 3, FALSE, 0),
  (2, 'кладовая', 'Зелёная Долина', 'мкр. Зелёная Долина, д. 3, кл. 12', 'кл. 12', '0987654321', 5.0, 0, TRUE, 432.50),
  (1, 'квартира', 'Зелёная Долина', 'мкр. Зелёная Долина, д. 7, кв. 10', 'кв. 10', '1111111111', 55.0, 2, FALSE, 0);

INSERT INTO charges (property_id, service, amount, due_date, status) VALUES
  (1, 'Электричество', 1234.56, '2025-11-15', 'неоплачено'),
  (1, 'Газ', 567.89, '2025-11-10', 'оплачено'),
  (1, 'Холодная вода', 890.12, '2025-11-20', 'неоплачено');

INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
  (2, 'платеж', 'Новое начисление', 'Выставлена квитанция на сумму 5,432 ₽', FALSE),
  (2, 'заявка', 'Заявка принята', 'Ваша заявка №1234 принята в работу', FALSE),
  (2, 'объявление', 'Отключение воды', '29 октября с 9:00 до 12:00', TRUE);

INSERT INTO requests (property_id, user_id, category, description, urgency, status) VALUES
  (1, 2, 'Сантехника', 'Протекает кран на кухне', 'срочная', 'новая'),
  (1, 2, 'Электрика', 'Не работает розетка в спальне', 'обычная', 'в работе');

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Пользователи системы (жители, диспетчеры, директор)';
COMMENT ON TABLE properties IS 'Объекты недвижимости (квартиры, кладовые)';
COMMENT ON TABLE charges IS 'Начисления за коммунальные услуги';
COMMENT ON TABLE payment_receipts IS 'Загруженные чеки об оплате для проверки';
COMMENT ON TABLE meters IS 'Показания счётчиков';
COMMENT ON TABLE requests IS 'Заявки жителей';
COMMENT ON TABLE request_media IS 'Фото/видео/аудио к заявкам';
COMMENT ON TABLE notifications IS 'Уведомления пользователям';
COMMENT ON TABLE cameras IS 'Камеры Dali Telecom для видеонаблюдения';
COMMENT ON TABLE gate_access_log IS 'Логи открытий шлагбаума PalGate';


