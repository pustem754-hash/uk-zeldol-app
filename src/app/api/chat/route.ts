import { NextRequest, NextResponse } from 'next/server';
import { checkCredits, deductCredit } from '@/lib/credits';
import { getGeneralPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json();

    const hasCredits = await checkCredits(userId);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Недостаточно кредитов' },
        { status: 402 }
      );
    }

    // Здесь интеграция с OpenAI или другим LLM
    const systemPrompt = getGeneralPrompt();

    // Заглушка для ответа (в продакшене — вызов OpenAI API)
    const reply = `Маркиз получил ваше сообщение. Обработка...`;

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
