// Контакт
export interface Contact {
  id: string;
  name: string;
  role: string; // Должность/роль
  phone: string;
  email?: string;
  category: 'экстренные' | 'управление' | 'обслуживание';
  is24h?: boolean; // Работает 24/7
  address?: string; // Адрес офиса
}

