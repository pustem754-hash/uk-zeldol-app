// Кладовая
export interface Storage {
  id: string;
  number: string; // Номер кладовой (например "К-1", "К-18", "ПОМ.№4")
  apartment: string; // Номер квартиры владельца
  area: number; // Площадь в м²
  floor: number; // Этаж
  building: string; // Корпус/дом
  owner?: string; // ФИО владельца (опционально)
  status: 'занята' | 'свободна';
  location: string; // Расположение (например "Подвал, секция А")
}

