'use client';

import { useState, useCallback } from 'react';
import { PRICING, PRICING_DISPLAY } from '@/lib/pricing';
import { checkCredits, deductCredit, isAdmin } from '@/lib/credits';

type Marketplace = 'wildberries' | 'ozon';

export default function BundlePage() {
  const [product, setProduct] = useState('');
  const [brand, setBrand] = useState('');
  const [material, setMaterial] = useState('');
  const [marketplace, setMarketplace] = useState<Marketplace>('wildberries');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const userId = 1;

  const handleSubmit = useCallback(async () => {
    if (!product.trim()) {
      alert('Укажите название товара');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      if (!isAdmin(userId)) {
        const hasCredits = await checkCredits(userId, 'ALL_IN_ONE');
        if (!hasCredits) {
          alert('Недостаточно средств на балансе');
          setLoading(false);
          return;
        }
      }

      // Simulate bundle generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!isAdmin(userId)) {
        await deductCredit(userId, 'ALL_IN_ONE');
      }

      setResult('Пакет успешно сгенерирован! SEO-описание, фото и удаление фона выполнены.');
    } catch (error) {
      console.error('Bundle generation error:', error);
      alert('Ошибка при генерации пакета');
    } finally {
      setLoading(false);
    }
  }, [product, brand, material, marketplace, userId]);

  const originalPrice = 650;
  const discountedPrice = PRICING.ALL_IN_ONE;
  const discountPercent = Math.round((1 - discountedPrice / originalPrice) * 100);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => window.history.back()} className="text-gray-400 hover:text-white text-2xl">
          &larr;
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="text-purple-400">⚡</span> ВСЁ СРАЗУ
        </h1>
      </div>
      <p className="text-gray-400 mb-8 ml-10">
        SEO + Фото + Удаление фона — пакет со скидкой {discountPercent}%
      </p>

      {/* Main content: form + package info */}
      <div className="flex flex-col xl:flex-row gap-8 w-full">
        {/* Left: Form */}
        <div className="flex-1 w-full space-y-6">
          {/* Товар */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Товар <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Кроссовки Nike Air Max 90"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-base"
            />
          </div>

          {/* Бренд */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">Бренд</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Nike, Adidas..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-base"
            />
          </div>

          {/* Материал */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-2">Материал</label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="Текстиль, кожа..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-base"
            />
          </div>

          {/* Маркетплейс */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 mb-4">Маркетплейс</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <button
                onClick={() => setMarketplace('wildberries')}
                className={`w-full p-5 rounded-xl text-lg font-bold transition-all ${
                  marketplace === 'wildberries'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                Wildberries
              </button>
              <button
                onClick={() => setMarketplace('ozon')}
                className={`w-full p-5 rounded-xl text-lg font-bold transition-all ${
                  marketplace === 'ozon'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                Ozon
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !product.trim()}
            className="w-full p-5 rounded-xl text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> Генерация...
              </>
            ) : (
              <>
                <span className="text-yellow-300">⚡</span> Запустить пакет
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="w-full p-5 bg-green-900/30 border border-green-500/30 rounded-xl text-green-300">
              {result}
            </div>
          )}
        </div>

        {/* Right: Package info card */}
        <div className="xl:w-[420px] flex-shrink-0">
          <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 sticky top-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📦</span> Состав пакета:
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-gray-200">SEO-описание</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-gray-200">Фото товара (GPT Image)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-gray-200">Удаление фона</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-gray-500 line-through text-lg">{originalPrice} ₽</span>
              <span className="text-3xl font-bold text-white">{discountedPrice} ₽</span>
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">-{discountPercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
