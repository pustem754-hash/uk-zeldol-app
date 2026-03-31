'use client';

import { useState } from 'react';
import { isAdmin } from '@/lib/credits';
import { PRICING_DISPLAY } from '@/lib/pricing';

interface FittingItem {
  label: string;
  imageUrl?: string;
  garmentId?: string;
}

interface FittingGridProps {
  items: FittingItem[];
  personImageUrl?: string;
  userId?: number;
}

/**
 * Сетка примерки — 2 колонки на мобиле, 4 на десктопе
 * Включает кнопку "Примерить" с валидацией и вызовом Kling VTO API
 */
export function FittingGrid({ items, personImageUrl, userId = 1 }: FittingGridProps) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleTryOn = async (item: FittingItem, index: number) => {
    setError(null);
    setResultImage(null);

    // Валидация на клиенте
    if (!item.imageUrl) {
      setError('Нет изображения одежды для примерки');
      return;
    }
    if (!personImageUrl) {
      setError('Загрузите фото человека для примерки');
      return;
    }

    setLoadingIndex(index);

    try {
      const response = await fetch('/api/kling/vto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: String(item.garmentId || 'kolors-virtual-try-on'),
          garmentImageUrl: String(item.imageUrl),
          personImageUrl: String(personImageUrl),
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data.details
          ? Array.isArray(data.details)
            ? data.details.join('; ')
            : String(data.details)
          : data.error || 'Ошибка виртуальной примерки';
        setError(errMsg);
        return;
      }

      if (data.resultImageUrl) {
        setResultImage(data.resultImageUrl);
      }
    } catch (err) {
      console.error('VTO fetch error:', err);
      setError('Ошибка сети при виртуальной примерке');
    } finally {
      setLoadingIndex(null);
    }
  };

  const adminUser = isAdmin(userId);

  return (
    <section className="w-full">
      <h2 className="text-xl font-bold mb-4">Примерка</h2>

      {/* Ошибки — не показываем для админа */}
      {error && !adminUser && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Результат примерки */}
      {resultImage && (
        <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
          <p className="text-green-300 text-sm mb-2">Результат примерки:</p>
          <img src={resultImage} alt="Результат примерки" className="max-w-full h-auto rounded-lg" />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden flex flex-col items-center justify-center p-2"
          >
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.label} className="object-cover w-full h-full rounded" />
            ) : (
              <span className="text-gray-500 text-sm">👗 {item.label}</span>
            )}
            <p className="text-xs text-gray-400 mt-1 truncate w-full text-center">{item.label}</p>

            {/* Кнопка "Примерить" */}
            <div className="w-full mt-2 mb-6 md:mb-4">
              <button
                onClick={() => handleTryOn(item, i)}
                disabled={loadingIndex !== null}
                className="w-full bg-marquis-primary hover:bg-marquis-primary/80 text-white text-xs py-3 px-4 pb-4 md:pb-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loadingIndex === i ? 'Обработка...' : `Примерить — ${PRICING_DISPLAY.VIRTUAL_TRY_ON}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
