import { NextResponse } from 'next/server';
import { VideoHistoryItem } from '@/types/video';

export async function GET() {
  try {
    // TODO: Получить из базы данных
    const mockHistory: VideoHistoryItem[] = [
      {
        id: '1',
        marketplace: 'wildberries',
        videoUrl: '/generated/video_1.mp4',
        thumbnailUrl: '/generated/video_1_thumb.jpg',
        createdAt: new Date().toISOString(),
        title: 'Тестовое видео WB',
        musicTrack: 'energy',
      },
      {
        id: '2',
        marketplace: 'ozon',
        videoUrl: '/generated/video_2.mp4',
        thumbnailUrl: '/generated/video_2_thumb.jpg',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        title: 'Тестовое видео Ozon',
        musicTrack: 'drive',
      },
    ];

    return NextResponse.json({
      success: true,
      history: mockHistory.slice(0, 10),
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
