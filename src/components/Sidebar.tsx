'use client';

import { useState, useEffect } from 'react';
import { getCreditBalance } from '@/lib/credits';

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

  // Для userId === 1 (admin) отображать «0 ₽»
  const displayBalance = userId === 1 ? '0 ₽' : `${balance ?? 0} ₽`;

  const handleRefill = () => {
    alert('Функция пополнения баланса будет доступна в ближайшее время');
    // TODO: Интеграция с платежной системой
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-marquis-secondary border-r border-gray-700 p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-marquis-accent">Маркиз</h2>
        <p className="text-xs text-gray-400">AI Agent v0.8</p>
      </div>

      {/* Блок баланса */}
      <div className="mb-6 p-3 bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-400 mb-1">Баланс</p>
        <p className="text-lg font-semibold text-white">{displayBalance}</p>
        <button
          onClick={handleRefill}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Пополнить баланс
        </button>
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
