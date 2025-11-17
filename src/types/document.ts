// Документ
export interface Document {
  id: string;
  title: string;
  type: 'договор' | 'акт' | 'протокол' | 'другое';
  size: string; // Размер файла (например "2.5 МБ")
  createdAt: string;
  downloadUrl?: string; // URL для скачивания
}

