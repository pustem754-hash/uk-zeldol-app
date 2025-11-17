import { Service } from '../types/service';

// Дополнительные услуги УК
export const MOCK_SERVICES: Service[] = [
  // Ремонт
  {
    id: '1',
    name: 'Установка сантехники',
    description: 'Установка смесителей, унитазов, раковин',
    category: 'ремонт',
    price: 1500,
    unit: 'за единицу',
    duration: '2-3 часа',
  },
  {
    id: '2',
    name: 'Электромонтажные работы',
    description: 'Установка розеток, выключателей, прокладка проводов',
    category: 'ремонт',
    price: 800,
    unit: 'за точку',
    duration: '1-2 часа',
  },
  {
    id: '3',
    name: 'Поклейка обоев',
    description: 'Поклейка обоев любой сложности',
    category: 'ремонт',
    price: 300,
    unit: 'за м²',
    duration: '1 день',
  },
  // Уборка
  {
    id: '4',
    name: 'Генеральная уборка квартиры',
    description: 'Полная уборка всех помещений',
    category: 'уборка',
    price: 2500,
    unit: 'за квартиру',
    duration: '3-4 часа',
  },
  {
    id: '5',
    name: 'Уборка после ремонта',
    description: 'Уборка строительного мусора и пыли',
    category: 'уборка',
    price: 3500,
    unit: 'за квартиру',
    duration: '4-5 часов',
  },
  {
    id: '6',
    name: 'Мойка окон',
    description: 'Мойка окон с обеих сторон',
    category: 'уборка',
    price: 200,
    unit: 'за окно',
    duration: '30 минут',
  },
  // Доставка
  {
    id: '7',
    name: 'Доставка продуктов',
    description: 'Доставка продуктов из магазинов',
    category: 'доставка',
    price: 300,
    unit: 'за заказ',
    duration: '1-2 часа',
  },
  {
    id: '8',
    name: 'Доставка мебели',
    description: 'Доставка и подъём мебели в квартиру',
    category: 'доставка',
    price: 1500,
    unit: 'за заказ',
    duration: '2-3 часа',
  },
];

