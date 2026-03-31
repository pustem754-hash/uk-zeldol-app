'use client';

import { useState } from 'react';
import { checkCredits, deductCredit } from '@/lib/credits';
import { getSeoPrompt, getGeneralPrompt } from '@/lib/prompts';

export function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Идентификатор пользователя (в рабочей версии определяется из сессии)
  const userId = 1;

  const handleSend = async () => {
    if (!input.trim()) return;

    const hasCredits = await checkCredits(userId);
    if (!hasCredits) {
      alert('Недостаточно средств на балансе. Пожалуйста, пополните баланс.');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Вызов API для генерации ответа
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], userId }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      await deductCredit(userId);
    } catch (error) {
      console.error('Ошибка генерации:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-marquis-primary/20 ml-12'
                : 'bg-gray-800 mr-12'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">Обработка запроса...</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Введите сообщение..."
          className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marquis-primary"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-marquis-primary px-6 py-2 rounded-lg hover:bg-marquis-primary/80 disabled:opacity-50 transition-colors"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
