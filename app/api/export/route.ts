import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: Генерация Excel файла с данными
  // TODO: Возврат файла для скачивания
  return NextResponse.json({ success: true });
}


