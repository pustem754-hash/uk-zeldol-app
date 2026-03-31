'use client';

import { useState, useCallback } from 'react';
import { checkCredits, deductCredit, isAdmin } from '@/lib/credits';

/** Regex для удаления эмодзи — полный Unicode-диапазон */
const EMOJI_RE = new RegExp(
  '[\\u{1F600}-\\u{1F64F}\\u{1F300}-\\u{1F5FF}\\u{1F680}-\\u{1F6FF}' +
    '\\u{1F1E0}-\\u{1F1FF}\\u{2600}-\\u{27BF}\\u{FE00}-\\u{FE0F}' +
    '\\u{1F900}-\\u{1F9FF}\\u{1FA00}-\\u{1FA6F}\\u{1FA70}-\\u{1FAFF}' +
    '\\u{200D}\\u{20E3}\\u{E0020}-\\u{E007F}]',
  'gu',
);

/**
 * Удаляет все эмодзи из строки
 */
function stripEmoji(text: string): string {
  return text.replace(EMOJI_RE, '').replace(/\s{2,}/g, ' ').trim();
}

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
   */
  const handleCopyAll = useCallback(() => {
    const assistantMessages = messages.filter((m) => m.role === 'assistant');
    if (assistantMessages.length === 0) {
      setCopyStatus('Нет текста для копирования');
      setTimeout(() => setCopyStatus(null), 2000);
      return;
    }

    const lastReply = assistantMessages[assistantMessages.length - 1].content;

    // Пытаемся распарсить структурированный ответ
    let copyText = '';

    const titleMatch = lastReply.match(/(?:Наименование|Название|Заголовок)[:\s]*(.+)/i);
    const descMatch = lastReply.match(
      /(?:Описание)[:\s]*([\s\S]+?)(?=\n(?:Характеристик|Тег|Ключев|$))/i,
    );
    const specsMatch = lastReply.match(
      /(?:Характеристик[аи]?)[:\s]*([\s\S]+?)(?=\n(?:Тег|Ключев|$))/i,
    );
    const tagsMatch = lastReply.match(/(?:Теги|Ключевые слова)[:\s]*(.+)/i);

    if (titleMatch || descMatch || specsMatch || tagsMatch) {
      if (titleMatch) {
        const title = stripEmoji(titleMatch[1] || '');
        if (title) copyText += `Наименование: ${title}\n\n`;
      }

      if (descMatch) {
        const description = stripEmoji(descMatch[1] || '');
        if (description) copyText += `Описание: ${description}\n\n`;
      }

      if (specsMatch) {
        const specsRaw = (specsMatch[1] || '').trim();
        if (specsRaw) {
          const specs = specsRaw
            .split(/\n|;/)
            .map((s: string) => stripEmoji(s.replace(/^[-–—•*\s]+/, '')))
            .filter(Boolean);
          copyText += 'Характеристики:\n';
          specs.forEach((spec: string) => {
            copyText += `- ${spec}\n`;
          });
          copyText += '\n';
        }
      }

      if (tagsMatch) {
        const tags = stripEmoji(tagsMatch[1] || '');
        if (tags) copyText += `Теги: ${tags}\n`;
      }
    } else {
      // Если структура не распознана — копируем весь текст
      copyText = stripEmoji(lastReply);
    }

    // Убираем артефакты
    copyText = copyText.replace(/\bundefined\b/g, '').replace(/\bnull\b/g, '').trim();

    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopyStatus('Текст скопирован');
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch(() => {
        setCopyStatus('Ошибка копирования');
        setTimeout(() => setCopyStatus(null), 2000);
      });
  }, [messages]);

  const handleSend = useCallback(async () => {
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
  }, [input, messages, userId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSend();
    },
    [handleSend],
  );

  const hasAssistantMessage = messages.some((m) => m.role === 'assistant');

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-marquis-primary/20 ml-12' : 'bg-gray-800 mr-12'
            }`}
          >
            <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
          </div>
        ))}
        {loading && <div className="text-gray-400">Обработка запроса...</div>}
      </div>

      {/* Кнопка «Скопировать всё» */}
      {hasAssistantMessage && (
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleCopyAll}
            className="text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            Скопировать всё
          </button>
          {copyStatus && <span className="text-sm text-green-400">{copyStatus}</span>}
        </div>
      )}

      <div className="flex gap-2 pb-6 md:pb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-marquis-primary"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-marquis-primary px-6 py-3 rounded-lg hover:bg-marquis-primary/80 disabled:opacity-50 transition-colors"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
