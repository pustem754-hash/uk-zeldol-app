import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();
    
    // TODO: Проверка кода в Supabase
    // TODO: Создание сессии
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid code' },
      { status: 401 }
    );
  }
}


