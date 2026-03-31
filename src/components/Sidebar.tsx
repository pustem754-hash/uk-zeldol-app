'use client';

import { useState } from 'react';

const navItems = [
  { label: 'Чат', href: '/', icon: '💬' },
  { label: 'SEO Тексты', href: '/seo', icon: '📝' },
  { label: 'Проекты', href: '/projects', icon: '📁' },
  { label: 'Настройки', href: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  const [active, setActive] = useState('/');

  return (
    <aside className="hidden md:flex flex-col w-64 bg-marquis-secondary border-r border-gray-700 p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-marquis-accent">Маркиз</h2>
        <p className="text-xs text-gray-400">AI Agent v0.8</p>
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
