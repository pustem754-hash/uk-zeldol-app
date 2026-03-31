'use client';

import { PRICING_DISPLAY } from '@/lib/pricing';

interface PhotoGridProps {
  images: { src: string; alt: string }[];
}

/**
 * Сетка фото товаров — 2 колонки на мобиле, 4 на десктопе
 */
export function PhotoGrid({ images }: PhotoGridProps) {
  return (
    <section className="w-full">
      <h2 className="text-xl font-bold mb-4">Фото товара</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-800 rounded-lg overflow-hidden flex flex-col items-center justify-center"
          >
            {img.src ? (
              <img src={img.src} alt={img.alt} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500 text-sm">{img.alt}</span>
            )}
          </div>
        ))}
      </div>

      {/* Пакет «ВСЁ СРАЗУ» */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-marquis-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Пакет «ВСЁ СРАЗУ»</h3>
            <p className="text-sm text-gray-400">Фото + Видео + Удаление фона</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-marquis-accent">{PRICING_DISPLAY.ALL_IN_ONE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
