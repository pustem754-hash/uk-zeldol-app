// SMS.RU API сервис для отправки SMS кодов
const SMS_RU_API_ID = 'YOUR_API_ID_HERE'; // TODO: Получить на sms.ru
const SMS_RU_BASE_URL = 'https://sms.ru';

interface SmsResponse {
  status: 'OK' | 'ERROR';
  code?: string;
  message?: string;
}

// Генерация 4-значного кода
const generateCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Отправка SMS с кодом подтверждения
export const sendVerificationCode = async (phone: string): Promise<SmsResponse> => {
  try {
    const code = generateCode();

    // TODO: Раскомментировать для реальной отправки SMS
    /*
    const response = await fetch(`${SMS_RU_BASE_URL}/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_id: SMS_RU_API_ID,
        to: phone,
        msg: `Ваш код подтверждения: ${code}\n\nУК Зелёная Долина\nНе сообщайте код никому!`,
        json: 1,
      }),
    });

    const data = await response.json();

    if (data.status === 'OK') {
      // Сохранить код на сервере для проверки
      await saveCodeToServer(phone, code);
      return { status: 'OK', code };
    } else {
      return { status: 'ERROR', message: data.status_text };
    }
    */

    // ДЕМО-РЕЖИМ (для тестирования без реального SMS)
    console.log(`📱 SMS код для ${phone}: ${code}`);

    // В демо-режиме сохраняем код локально
    if (typeof global !== 'undefined') {
      (global as any).__SMS_CODES__ = (global as any).__SMS_CODES__ || {};
      (global as any).__SMS_CODES__[phone] = code;
    }

    return { status: 'OK', code };
  } catch (error) {
    console.error('Ошибка отправки SMS:', error);
    return { status: 'ERROR', message: 'Ошибка соединения с SMS-сервисом' };
  }
};

// Проверка кода (в реальном приложении - на backend)
export const verifyCode = async (phone: string, code: string): Promise<boolean> => {
  try {
    // TODO: Заменить на реальный API вызов к вашему backend
    /*
    const response = await fetch('https://your-api.com/api/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    });

    const data = await response.json();
    return data.valid === true;
    */

    // ДЕМО-РЕЖИМ (для тестирования)
    if (typeof global !== 'undefined') {
      const savedCode = (global as any).__SMS_CODES__?.[phone];
      console.log(`🔐 Проверка кода для ${phone}: ${code} === ${savedCode}`);
      return code === savedCode;
    }

    return false;
  } catch (error) {
    console.error('Ошибка проверки кода:', error);
    return false;
  }
};

// Вспомогательная функция (временная, для демо)
const saveCodeToServer = async (phone: string, code: string) => {
  // В реальном приложении код должен сохраняться на backend
  // и иметь срок жизни (например, 5 минут)
  console.log(`💾 Сохранение кода для ${phone}: ${code}`);
};

