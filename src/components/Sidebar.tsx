'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCreditBalance, isAdmin } from '@/lib/credits';
import { PRICING_DISPLAY } from '@/lib/pricing';

const navItems = [
  { label: 'Главная', href: '/', icon: '🏠' },
  { label: 'SEO-Мастер', href: '/seo', icon: '📝' },
  { label: 'Примерка', href: '/fitting', icon: '👗' },
  { label: 'Всё сразу', href: '/bundle', icon: '⚡', highlight: true },
  { label: 'Фото', href: '/photo', icon: '📷' },
  { label: 'Видео', href: '/video-master', icon: '🎬' },
  { label: 'Video Master', href: '/video-master', icon: '🎥' },
  { label: 'Инфографика', href: '/infographic', icon: '📊' },
  { label: 'Удалить фон', href: '/remove-bg', icon: '🖼' },
  { label: 'Отзывы', href: '/reviews', icon: '💬' },
  { label: 'Ключевые слова', href: '/keywords', icon: '🔑' },
  { label: 'Характеристики', href: '/specs', icon: '📋' },
  { label: 'Размерная сетка', href: '/sizes', icon: '📐' },
  { label: 'Массовая генерация', href: '/bulk', icon: '🚀' },
  { label: 'История', href: '/history', icon: '📜' },
];

export function Sidebar() {
  const [active, setActive] = useState('/');
  const [balance, setBalance] = useState<number | null>(null);

  const userId = 1;

  useEffect(() => {
    getCreditBalance(userId).then(setBalance);
    // Detect current path
    if (typeof window !== 'undefined') {
      setActive(window.location.pathname);
    }
  }, [userId]);

  const displayBalance = isAdmin(userId) ? '∞ ₽' : `${balance ?? 0} ₽`;

  const handleRefill = useCallback(() => {
    alert('Функция пополнения баланса будет доступна в ближайшее время');
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-marquis-secondary border-r border-gray-700 p-4 z-10 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-wide">МАРКИЗ</h2>
        <p className="text-xs text-gray-500">СЕЛЛЕР</p>
      </div>

      {/* Баланс */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-400 mb-1">Баланс</p>
        <p className="text-lg font-semibold text-white">{displayBalance}</p>
        {!isAdmin(userId) && (
          <button
            onClick={handleRefill}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Пополнить баланс
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.href + item.label}
            href={item.href}
            onClick={() => setActive(item.href)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
              active === item.href
                ? 'bg-marquis-primary text-white font-medium'
                : item.highlight
                  ? 'text-purple-300 hover:bg-purple-900/30 font-medium'
                  : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">v13.2 — Wide Screen</p>
        <p className="text-xs text-gray-600 mt-1">© 2026 Marquis AI</p>
      </div>
    </aside>
  );
}
