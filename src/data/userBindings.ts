// Интерфейс связи пользователя с помещениями
export interface UserBinding {
  phone: string; // +79600720321
  apartments: string[]; // ['144', '256'] - номера квартир
  storages: string[]; // ['К-1', 'К-18'] - номера кладовых
  accountNumbers: string[]; // ['12345678', '87654321'] - лицевые счета
  fullName: string; // ФИО собственника
  address: string; // Адрес
}

// ДЕМО-ДАННЫЕ (в реальном приложении будут загружаться из API)
export const USER_BINDINGS: UserBinding[] = [
  {
    phone: '+79600720321',
    apartments: ['45'],
    storages: ['К-12'],
    accountNumbers: ['8105059550'],
    fullName: 'Иванов Иван Иванович',
    address: 'ЖК Маяк, ул. Рогачёва, 25, корпус 1',
  },
  {
    phone: '+79123456789',
    apartments: ['78'],
    storages: [],
    accountNumbers: ['8105059551'],
    fullName: 'Петрова Мария Сергеевна',
    address: 'ЖК Зелёная долина, мкр. Зелёная Долина, д. 3',
  },
  {
    phone: '+79876543210',
    apartments: ['120'],
    storages: ['К-45'],
    accountNumbers: ['8105059552'],
    fullName: 'Сидоров Петр Александрович',
    address: 'ЖК Зелёная долина, мкр. Зелёная Долина, д. 5',
  },
  // Дополнительные пользователи для демонстрации
  {
    phone: '+79001234567',
    apartments: ['12', '87'],
    storages: ['К-1', 'К-18'],
    accountNumbers: ['8105059553', '8105059554'],
    fullName: 'Петрова Мария Сергеевна',
    address: 'ЖК Зелёная Долина, ул. Шустова, 4А',
  },
  {
    phone: '+79107654321',
    apartments: ['156'],
    storages: [],
    accountNumbers: ['8105059555'],
    fullName: 'Сидоров Пётр Александрович',
    address: 'ЖК Маяк, ул. Рогачёва, 25, корпус 2',
  },
];

// Функция получения данных пользователя по телефону
export const getUserByPhone = (phone: string): UserBinding | undefined => {
  return USER_BINDINGS.find((u) => u.phone === phone);
};

// Функция получения всех помещений пользователя
export const getUserProperties = (phone: string) => {
  const user = getUserByPhone(phone);
  if (!user) return null;

  return {
    fullName: user.fullName,
    address: user.address,
    apartments: user.apartments.map((apt, index) => ({
      number: apt,
      accountNumber: user.accountNumbers[index] || '',
    })),
    storages: user.storages,
    totalAccounts: user.accountNumbers.length,
  };
};

// Функция проверки существования пользователя
export const isPhoneRegistered = (phone: string): boolean => {
  return USER_BINDINGS.some((u) => u.phone === phone);
};

