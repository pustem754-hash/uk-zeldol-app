'use client';

import { useState, useCallback } from 'react';
import { checkCredits, deductCredit, isAdmin } from '@/lib/credits';
import { getSeoPrompt, getGeneralPrompt } from '@/lib/prompts';

export function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Идентификатор пользователя (в рабочей версии определяется из сессии)
  const userId = 1;

  /**
   * handleCopyAll — копирует последний ответ ассистента в буфер обмена.
   * Формат: чистый текст без эмодзи и сленга.
   * Структура: Наименование, Описание, Характеристики (через дефис), Теги (через запятую).
   */
  const handleCopyAll = useCallback(() => {
    // Находим последний ответ ассистента
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    if (assistantMessages.length === 0) {
      setCopyStatus('Нет текста для копирования');
      setTimeout(() => setCopyStatus(null), 2000);
      return;
    }

    const lastReply = assistantMessages[assistantMessages.length - 1].content;

    // Пытаемся распарсить структурированный ответ
    let copyText = '';

    // Пробуем найти секции в тексте
    const titleMatch = lastReply.match(/(?:Наименование|Название|Заголовок)[:\s]*(.+)/i);
    const descMatch = lastReply.match(/(?:Описание)[:\s]*([\s\S]+?)(?=\n(?:Характеристик|Тег|Ключев|$))/i);
    const specsMatch = lastReply.match(/(?:Характеристик[аи]?)[:\s]*([\s\S]+?)(?=\n(?:Тег|Ключев|$))/i);
    const tagsMatch = lastReply.match(/(?:Теги|Ключевые слова)[:\s]*(.+)/i);

    if (titleMatch || descMatch || specsMatch || tagsMatch) {
      // Структурированный формат
      if (titleMatch) {
        const title = (titleMatch[1] || '').trim();
        if (title) copyText += `Наименование: ${title}\n\n`;
      }

      if (descMatch) {
        const description = (descMatch[1] || '').trim();
        if (description) copyText += `Описание: ${description}\n\n`;
      }

      if (specsMatch) {
        const specsRaw = (specsMatch[1] || '').trim();
        if (specsRaw) {
          const specs = specsRaw
            .split(/\n|;|,/)
            .map((s: string) => s.replace(/^[-–—•*\s]+/, '').trim())
            .filter(Boolean);
          copyText += `Характеристики:\n`;
          specs.forEach((spec: string) => {
            copyText += `- ${spec}\n`;
          });
          copyText += '\n';
        }
      }

      if (tagsMatch) {
        const tags = (tagsMatch[1] || '').trim();
        if (tags) copyText += `Теги: ${tags}\n`;
      }
    } else {
      // Если структура не распознана — копируем весь текст как есть (полностью)
      copyText = lastReply;
    }

    // Удаляем эмодзи из финального текста
    copyText = copyText
      .replace(/📌|💡|👔|🔥|✨|⭐|🎯|💰|🛒|📦|✅|❌|⚡|🏷️|📋|🔍|💎|🎁|👉|📊|🚀|💪|🌟|❤️|👍|🎉/g, '')
      .replace(/[\u2600-\u27BF]/g, '')
      .trim();

    // Убираем возможные "undefined" / "null"
    copyText = copyText.replace(/\bundefined\b/g, '').replace(/\bnull\b/g, '');

    console.log('Копируемый текст:', copyText);
    console.log('Длина текста:', copyText.length);

    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopyStatus('Текст скопирован');
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch((err) => {
        console.error('Ошибка копирования:', err);
        setCopyStatus('Ошибка копирования');
        setTimeout(() => setCopyStatus(null), 2000);
      });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Администраторы пропускают проверку баланса
    if (!isAdmin(userId)) {
      const hasCredits = await checkCredits(userId);
      if (!hasCredits) {
        alert('Недостаточно средств на балансе. Пожалуйста, пополните баланс.');
        return;
      }
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

  const hasAssistantMessage = messages.some((m) => m.role === 'assistant');

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
            <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
          </div>
        ))}
        {loading && <div className="text-gray-400">Обработка запроса...</div>}
      </div>

      {/* Кнопка «Скопировать всё» — появляется когда есть ответ */}
      {hasAssistantMessage && (
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleCopyAll}
            className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            Скопировать всё
          </button>
          {copyStatus && (
            <span className="text-sm text-green-400">{copyStatus}</span>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-6 md:mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Введите сообщение..."
          className="flex-1 bg-gray-800 rounded-lg px-4 py-3 pb-4 md:pb-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marquis-primary"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-marquis-primary px-6 py-3 pb-4 md:pb-3 rounded-lg hover:bg-marquis-primary/80 disabled:opacity-50 transition-colors"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
