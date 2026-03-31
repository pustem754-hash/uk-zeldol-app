'use client';

interface PhotoGridProps {
  images: { src: string; alt: string }[];
}

/**
 * Сетка фото товаров — 2 колонки на мобиле, 4 на десктопе
 * Directive V8.7: grid-cols-2 md:grid-cols-4
 */
export function PhotoGrid({ images }: PhotoGridProps) {
  return (
    <section className="w-full">
      <h2 className="text-xl font-bold mb-4">Фото товара</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center"
          >
            {img.src ? (
              <img src={img.src} alt={img.alt} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500 text-sm">📷 {img.alt}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
