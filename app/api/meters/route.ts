import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // TODO: Получить показания из Supabase
  return NextResponse.json({ meters: [] });
}

export async function POST(request: NextRequest) {
  // TODO: Сохранить показания в Supabase
  return NextResponse.json({ success: true });
}


