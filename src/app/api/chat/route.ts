import { NextRequest, NextResponse } from 'next/server';
import { checkCredits, deductCredit } from '@/lib/credits';
import { getGeneralPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json();

    const hasCredits = await checkCredits(userId);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Недостаточно средств на балансе' },
        { status: 402 }
      );
    }

    // Интеграция с OpenAI или другим LLM
    const systemPrompt = getGeneralPrompt();

    // Fallback-решение для ответа (в рабочей версии — вызов OpenAI API)
    const reply = `Ваше сообщение принято. Выполняется обработка...`;

    await deductCredit(userId);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
