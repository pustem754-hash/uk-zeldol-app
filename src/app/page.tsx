'use client';

import { useState } from 'react';
import { Chat } from '@/components/Chat';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Маркиз — AI Агент</h1>
      <Chat />
    </div>
  );
}
