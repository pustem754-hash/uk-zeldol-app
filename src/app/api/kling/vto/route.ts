import { NextRequest, NextResponse } from 'next/server';
import { checkCredits, deductCredit, isAdmin } from '@/lib/credits';
import { validateVtoRequest } from '@/lib/vto-validation';

/**
 * Kling Virtual Try-On API Route
 * POST /api/kling/vto
 *
 * Принимает:
 *   - modelId: string — ID модели Kling
 *   - garmentImageUrl: string — URL изображения одежды
 *   - personImageUrl: string — URL изображения человека
 *   - userId: number — ID пользователя
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId: number = body.userId ?? 0;
    const modelId = typeof body.modelId === 'string' ? body.modelId : String(body.modelId || '');
    const garmentImageUrl =
      typeof body.garmentImageUrl === 'string'
        ? body.garmentImageUrl
        : String(body.garmentImageUrl || '');
    const personImageUrl =
      typeof body.personImageUrl === 'string'
        ? body.personImageUrl
        : String(body.personImageUrl || '');

    // 1. Валидация входных данных
    const validation = validateVtoRequest({ modelId, garmentImageUrl, personImageUrl });
    if (!validation.valid) {
      // Для админа — тихий fallback вместо ошибки валидации
      if (isAdmin(userId)) {
        return NextResponse.json({
          success: true,
          resultImageUrl: garmentImageUrl || personImageUrl,
          cost: '0 ₽',
          message: 'Admin fallback: валидация пропущена',
        });
      }
      return NextResponse.json(
        { error: 'Ошибка валидации данных', details: validation.errors },
        { status: 400 },
      );
    }

    // 2. Проверка баланса (администраторы пропускаются)
    const hasCredits = await checkCredits(userId, 'VIRTUAL_TRY_ON');
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Недостаточно средств на балансе для виртуальной примерки (399 ₽)' },
        { status: 402 },
      );
    }

    const normalized = validation.normalized!;

    // 3. Вызов Kling API
    const klingApiKey = process.env.KLING_API_KEY;
    let resultImageUrl = '';

    if (klingApiKey) {
      try {
        const klingResponse = await fetch(
          'https://api.klingai.com/v1/images/kolors-virtual-try-on',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${klingApiKey}`,
            },
            body: JSON.stringify({
              model_name: String(normalized.modelId),
              cloth_image: String(normalized.garmentImageUrl),
              human_image: String(normalized.personImageUrl),
            }),
          },
        );

        if (!klingResponse.ok) {
          const errText = await klingResponse.text();
          console.error('Kling API error:', klingResponse.status, errText);

          // Admin fallback — возвращаем оригинал вместо ошибки
          if (isAdmin(userId)) {
            return NextResponse.json({
              success: true,
              resultImageUrl: normalized.personImageUrl,
              cost: '0 ₽',
              message: 'Admin fallback: Kling API вернул ошибку, используется оригинал',
            });
          }

          return NextResponse.json(
            { error: `Ошибка Kling API: ${klingResponse.status}`, details: errText },
            { status: 502 },
          );
        }

        const klingData = await klingResponse.json();
        resultImageUrl = klingData?.data?.result_image || klingData?.result_image || '';
      } catch (apiErr) {
        console.error('Kling API call failed:', apiErr);

        // Admin fallback — при сетевой ошибке
        if (isAdmin(userId)) {
          return NextResponse.json({
            success: true,
            resultImageUrl: normalized.personImageUrl,
            cost: '0 ₽',
            message: 'Admin fallback: сетевая ошибка Kling API',
          });
        }

        return NextResponse.json(
          { error: 'Ошибка соединения с сервисом виртуальной примерки' },
          { status: 502 },
        );
      }
    } else {
      // Fallback — демо-режим без реального API
      console.warn('KLING_API_KEY not set — returning placeholder result');
      resultImageUrl = normalized.garmentImageUrl;
    }

    // 4. Списание средств (администраторы пропускаются)
    await deductCredit(userId, 'VIRTUAL_TRY_ON');

    return NextResponse.json({
      success: true,
      resultImageUrl,
      cost: '399 ₽',
    });
  } catch (error) {
    console.error('Kling VTO API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера при обработке виртуальной примерки' },
      { status: 500 },
    );
  }
}
