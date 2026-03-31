'use client';

import { Chat } from '@/components/Chat';

export default function HomePage() {
  return (
    <div className="w-full max-w-none">
      <h1 className="text-3xl font-bold mb-6">Маркиз — AI Агент</h1>
      <Chat />
    </div>
  );
}
