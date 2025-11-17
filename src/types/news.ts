// Новость/Объявление
export interface News {
  id: string;
  title: string;
  content: string;
  category: 'новости' | 'объявления' | 'мероприятия';
  isImportant: boolean; // Важное объявление
  createdAt: string;
  imageUrl?: string; // Опциональное изображение
}

