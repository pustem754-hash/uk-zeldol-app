'use client';

import { useState, useEffect } from 'react';
import { VideoHistoryItem } from '@/types/video';
import { VIDEO_FORMATS } from '@/lib/video-formats';

export default function HistoryPage() {
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/video/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load history:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6">История видео</h1>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">История видео</h1>

      {history.length === 0 ? (
        <p className="text-gray-500">История пуста. Создайте первое видео!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map(item => {
            const format = VIDEO_FORMATS[item.marketplace];
            return (
              <div key={item.id} className="border rounded-lg overflow-hidden shadow-lg">
                <div className="relative">
                  <video
                    src={item.videoUrl}
                    poster={item.thumbnailUrl}
                    controls
                    className="w-full"
                    style={{
                      aspectRatio: item.marketplace === 'wildberries' ? '9/16' : '1/1',
                    }}
                  />
                  <div
                    className="absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: format.color }}
                  >
                    {format.label}
                  </div>
                </div>
                <div className="p-4">
                  {item.title && (
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                  )}
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={item.videoUrl}
                      download
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg text-center hover:bg-blue-700"
                    >
                      Скачать
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + item.videoUrl);
                        alert('Ссылка скопирована!');
                      }}
                      className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
                    >
                      Копировать
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
