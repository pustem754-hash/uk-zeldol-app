// ========================================
// КОНСТАНТЫ: АДРЕСА ДОМОВ И КОМПАНИЯ
// ========================================

const BUILDINGS = {
  "Маяк": [
    {
      address: "ул. Рогачёва, д. 25/1",
      apartments: 105,
      storages: 21,
      totalAccounts: 126
    },
    {
      address: "ул. Рогачёва, д. 25/2",
      apartments: 70,
      storages: 14,
      totalAccounts: 84
    }
  ],
  "Зелёная Долина": [
    {
      address: "мкр. Зелёная Долина, д. 1",
      apartments: 67,
      storages: 64,
      totalAccounts: 131
    },
    {
      address: "мкр. Зелёная Долина, д. 3",
      apartments: 220,
      storages: 181,
      totalAccounts: 401
    },
    {
      address: "мкр. Зелёная Долина, д. 5",
      apartments: 141,
      storages: 102,
      totalAccounts: 243
    },
    {
      address: "мкр. Зелёная Долина, д. 7",
      apartments: 61,
      storages: 48,
      totalAccounts: 109
    }
  ]
};

const COMPANY = {
  name: "ООО «Управляющая Компания Зелёная долина»",
  address: "422550, Респ. Татарстан, г. Зеленодольск, ул. Шустова, д. 4А, пом. 15",
  inn: "1673002229",
  kpp: "167301001",
  ogrn: "1221600054653",
  bank: "Филиал «Центральный» Банка ВТБ (ПАО)",
  bik: "044525411",
  account: "40702810416404207510",
  corrAccount: "30101810145250000411",
  phone: "8 960 072 03 21",
  email: "uk-zeldol@yandex.ru",
  director: "Галлямов Руслан Рафисович"
};

// ИТОГО: 6 домов, 664 квартиры, 430 кладовых, 1094 лицевых счета
const STATS = {
  totalBuildings: 6,
  totalApartments: 664,
  totalStorages: 430,
  totalAccounts: 1094
};

console.log('🏢 Данные УК загружены:', STATS);

// ========================================
// ФОРМА ВХОДА
// ========================================

// Форма входа
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    
    console.log('Попытка входа:', phone);
    
    // Здесь будет подключение к API Supabase
    alert('Вход в систему...\nТелефон: ' + phone);
    
    // TODO: Подключить реальную авторизацию
});

// Маска для телефона
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value[0] !== '7') value = '7' + value;
    }
    e.target.value = value;
});

console.log('✅ ЖК Зелёная Долина - Приложение загружено');
