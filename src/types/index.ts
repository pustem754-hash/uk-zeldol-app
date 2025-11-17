export interface User {
  id: string;
  phone: string;
  fullName: string;
  apartment: string;
  address: string;
  storage?: string; // Номер кладовой (опционально)
  storages?: string[]; // Массив номеров кладовых
  balance: number;
}

export interface Request {
  id: string;
  userId: string;
  type: 'ремонт' | 'уборка' | 'другое';
  description: string;
  photos: string[];
  videos?: string[]; // Массив URI видео
  audioRecording?: string; // URI аудиозаписи
  status: 'новая' | 'в работе' | 'выполнена';
  createdAt: string;
  completedAt?: string;
  response?: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  screenshot: string;
  status: 'на проверке' | 'подтверждено' | 'отклонено';
  createdAt: string;
  month: string; // Формат: "2025-01"
}

export interface Meter {
  id: string;
  userId: string;
  type: 'холодная вода' | 'горячая вода' | 'электричество' | 'газ';
  value: number;
  month: string;
  createdAt: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  thumbnail: string;
  streamUrl?: string; // Для будущей интеграции с Телеком Летай
}

// Показания счётчика
export interface MeterReading {
  id: string;
  type: 'ГВС' | 'ХВС' | 'Электроснабжение' | 'Газ';
  serialNumber: string; // Серийный номер счётчика
  lastVerificationDate: string; // Дата последней поверки
  previousReading: number; // Предыдущие показания
  previousReadingDate: string; // Дата предыдущих показаний
  currentReading: number; // Текущие показания
  currentReadingDate: string; // Дата текущих показаний
}

// Услуга ЖКХ в квитанции
export interface UtilityService {
  id: string;
  name: string;
  unit: string; // Единица измерения (м², м³, кВт·ч, Гкал, чел.)
  tariff: number; // Тариф за единицу
  volume: number; // Объём потребления
  amount: number; // Сумма к оплате
  category: 'коммунальные' | 'содержание' | 'домофон' | 'капремонт';
  isSubService?: boolean; // Является ли подуслугой (в т.ч.)
}

// Льготы
export interface Benefit {
  type: string; // Тип льготы
  amount: number; // Сумма льготы
}

// Квитанция
export interface Receipt {
  id: string;
  userId: string;
  month: string; // Период (например "Сентябрь 2025")
  accountNumber: string; // Лицевой счёт
  deliveryAddress: string; // Адрес доставки
  propertyArea: number; // Площадь квартиры (м²)
  residentsCount: number; // Количество жильцов
  managementCompany: {
    name: string;
    address: string;
    phone: string;
  };
  meterReadingsDeadline: string; // Срок передачи показаний (например "25.10.2025")
  paymentDeadline: string; // Срок оплаты (например "28.10.2025")
  services: UtilityService[]; // Список услуг
  meterReadings: MeterReading[]; // Показания счётчиков
  benefits: Benefit[]; // Льготы
  communalServicesTotal: number; // Итого по коммунальным услугам
  housingMaintenanceTotal: number; // Итого за содержание помещения
  intercomAmount: number; // Домофон
  capitalRepairAmount: number; // Капитальный ремонт
  totalAmount: number; // Всего к оплате
  paidAmount: number; // Уже оплачено
  debt: number; // Задолженность
  createdAt: string;
}

