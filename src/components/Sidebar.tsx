'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCreditBalance, isAdmin } from '@/lib/credits';
import { PRICING_DISPLAY } from '@/lib/pricing';

const navItems = [
  { label: 'Чат', href: '/', icon: '💬' },
  { label: 'SEO Тексты', href: '/seo', icon: '📝' },
  { label: 'Проекты', href: '/projects', icon: '📁' },
  { label: 'Настройки', href: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  const [active, setActive] = useState('/');
  const [balance, setBalance] = useState<number | null>(null);

  // Идентификатор пользователя (в рабочей версии определяется из сессии)
  const userId = 1;

  useEffect(() => {
    getCreditBalance(userId).then(setBalance);
  }, [userId]);

  const displayBalance = isAdmin(userId) ? '∞ ₽' : `${balance ?? 0} ₽`;

  const handleRefill = useCallback(() => {
    alert('Функция пополнения баланса будет доступна в ближайшее время');
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-marquis-secondary border-r border-gray-700 p-4 z-10">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-marquis-accent">Маркиз</h2>
        <p className="text-xs text-gray-400">AI Agent v12.4</p>
      </div>

      {/* Блок баланса */}
      <div className="mb-6 p-3 bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-400 mb-1">Баланс</p>
        <p className="text-lg font-semibold text-white">{displayBalance}</p>
        {!isAdmin(userId) && (
          <button
            onClick={handleRefill}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            Пополнить баланс
          </button>
        )}
      </div>

      {/* Тарифы */}
      <div className="mb-6 p-3 bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-400 mb-2">Тарифы</p>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>Фото — {PRICING_DISPLAY.PHOTO}</li>
          <li>Видео — {PRICING_DISPLAY.VIDEO}</li>
          <li>Удаление фона — {PRICING_DISPLAY.BACKGROUND_REMOVAL}</li>
          <li>Примерка — {PRICING_DISPLAY.VIRTUAL_TRY_ON}</li>
          <li>Всё сразу — {PRICING_DISPLAY.ALL_IN_ONE}</li>
        </ul>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setActive(item.href)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              active === item.href
                ? 'bg-marquis-primary text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">© 2026 Marquis AI</p>
      </div>
    </aside>
  );
}
