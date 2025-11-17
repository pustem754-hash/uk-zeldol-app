// Дополнительная услуга
export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'ремонт' | 'уборка' | 'доставка';
  price: number; // Цена в рублях
  unit: string; // Единица измерения (например "за м²", "за час")
  duration?: string; // Длительность (например "2-3 часа")
}

