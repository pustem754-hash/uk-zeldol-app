'use client';

interface FittingItem {
  label: string;
  imageUrl?: string;
}

interface FittingGridProps {
  items: FittingItem[];
}

/**
 * Сетка примерки — 2 колонки на мобиле, 4 на десктопе
 * Directive V8.7: grid-cols-2 md:grid-cols-4
 */
export function FittingGrid({ items }: FittingGridProps) {
  return (
    <section className="w-full">
      <h2 className="text-xl font-bold mb-4">Примерка</h2>
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
          </div>
        ))}
      </div>
    </section>
  );
}
