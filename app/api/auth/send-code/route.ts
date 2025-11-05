import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    
    // TODO: Интеграция с SMS Gateway (SMSC.ru или SMS.ru)
    // TODO: Генерация кода и сохранение в Supabase
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send code' },
      { status: 500 }
    );
  }
}


