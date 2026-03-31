/**
 * Валидация данных для Kling Virtual Try-On API
 */

/**
 * Проверяет, что строка является валидным URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Проверяет, что modelId является валидной строкой (UUID или Kling-формат)
 */
export function isValidModelId(id: unknown): boolean {
  if (typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }
  // UUID формат или строковый ID (минимум 1 символ, макс 128)
  return id.length >= 1 && id.length <= 128;
}

/**
 * Нормализует URL изображения: относительные пути преобразуются в абсолютные
 */
export function normalizeImageUrl(url: string, baseUrl?: string): string {
  if (!url) return '';

  // Уже абсолютный URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Относительный путь — конвертируем в абсолютный
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://marquis-app.vercel.app';
  return `${base.replace(/\/$/, '')}${url.startsWith('/') ? '' : '/'}${url}`;
}

export interface VtoRequestData {
  modelId: string;
  garmentImageUrl: string;
  personImageUrl: string;
}

/**
 * Полная валидация запроса к Kling VTO API
 */
export function validateVtoRequest(data: Partial<VtoRequestData>): {
  valid: boolean;
  errors: string[];
  normalized?: VtoRequestData;
} {
  const errors: string[] = [];

  // Проверка modelId
  if (!data.modelId) {
    errors.push('Не указан ID модели (modelId)');
  } else if (!isValidModelId(data.modelId)) {
    errors.push('Некорректный формат ID модели');
  }

  // Нормализация и проверка URL изображения одежды
  let garmentImageUrl = data.garmentImageUrl || '';
  if (!garmentImageUrl) {
    errors.push('Не указан URL изображения одежды (garmentImageUrl)');
  } else {
    garmentImageUrl = normalizeImageUrl(garmentImageUrl);
    if (!isValidUrl(garmentImageUrl)) {
      errors.push('Некорректный URL изображения одежды');
    }
  }

  // Нормализация и проверка URL изображения человека
  let personImageUrl = data.personImageUrl || '';
  if (!personImageUrl) {
    errors.push('Не указан URL изображения человека (personImageUrl)');
  } else {
    personImageUrl = normalizeImageUrl(personImageUrl);
    if (!isValidUrl(personImageUrl)) {
      errors.push('Некорректный URL изображения человека');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    normalized: {
      modelId: String(data.modelId).trim(),
      garmentImageUrl,
      personImageUrl,
    },
  };
}
