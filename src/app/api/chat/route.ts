import { NextRequest, NextResponse } from 'next/server';
import { checkCredits, deductCredit, isAdmin } from '@/lib/credits';
import { getGeneralPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json();

    // Администраторы пропускают проверку баланса
    if (!isAdmin(userId ?? 0)) {
      const hasCredits = await checkCredits(userId);
      if (!hasCredits) {
        return NextResponse.json(
          { error: 'Недостаточно средств на балансе' },
          { status: 402 }
        );
      }
    }

    // Интеграция с OpenAI или другим LLM
    const systemPrompt = getGeneralPrompt();

    // Fallback-решение для ответа (в рабочей версии — вызов OpenAI API)
    const reply = `Ваше сообщение принято. Выполняется обработка...`;

    // Списание — администраторы пропускаются автоматически в deductCredit
    await deductCredit(userId ?? 0);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
