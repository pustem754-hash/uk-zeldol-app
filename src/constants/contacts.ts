import { Contact } from '../types/contact';

// Контакты УК и экстренных служб
export const MOCK_CONTACTS: Contact[] = [
  // Экстренные службы
  {
    id: '1',
    name: 'Единая служба спасения',
    role: 'Экстренная служба',
    phone: '112',
    category: 'экстренные',
    is24h: true,
  },
  {
    id: '2',
    name: 'Пожарная служба',
    role: 'Экстренная служба',
    phone: '101',
    category: 'экстренные',
    is24h: true,
  },
  {
    id: '3',
    name: 'Полиция',
    role: 'Экстренная служба',
    phone: '102',
    category: 'экстренные',
    is24h: true,
  },
  {
    id: '4',
    name: 'Скорая помощь',
    role: 'Экстренная служба',
    phone: '103',
    category: 'экстренные',
    is24h: true,
  },
  {
    id: '5',
    name: 'Аварийная служба газа',
    role: 'Экстренная служба',
    phone: '104',
    category: 'экстренные',
    is24h: true,
  },
  // Управление УК
  {
    id: '6',
    name: 'Диспетчерская служба',
    role: 'Приём заявок',
    phone: '8 960 072 03 21',
    category: 'управление',
    is24h: false,
  },
  {
    id: '7',
    name: 'Бухгалтерия',
    role: 'Расчёты и платежи',
    phone: '8 960 072 03 21',
    email: 'uk-zeldol@yandex.ru',
    category: 'управление',
    is24h: false,
  },
  {
    id: '8',
    name: 'Приёмная директора',
    role: 'Руководство',
    phone: '8 960 072 03 21',
    email: 'uk-zeldol@yandex.ru',
    category: 'управление',
    is24h: false,
  },
  // Обслуживание
  {
    id: '9',
    name: 'Аварийная служба УК',
    role: 'Круглосуточная служба',
    phone: '8 960 072 03 21',
    category: 'обслуживание',
    is24h: true,
  },
  {
    id: '10',
    name: 'Офис УК',
    role: 'Приём граждан',
    phone: '8 960 072 03 21',
    email: 'uk-zeldol@yandex.ru',
    address: 'г. Зеленодольск, ул. Шустова, д. 4А',
    category: 'обслуживание',
    is24h: false,
  },
];

