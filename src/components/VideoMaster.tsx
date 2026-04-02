'use client';

import { useState, useCallback, useEffect } from 'react';
import { MarketplaceType, MusicTrack } from '@/types/video';
import { VIDEO_FORMATS } from '@/lib/video-formats';
import { isAdmin } from '@/lib/credits';
import { PRICING } from '@/lib/pricing';

export default function VideoMaster({ userId }: { userId: number }) {
  const [marketplace, setMarketplace] = useState<MarketplaceType>('wildberries');
  const [selectedMusic, setSelectedMusic] = useState<string>('energy');
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);

  // Загрузка списка треков
  useEffect(() => {
    fetch('/assets/music/tracks.json')
      .then(res => res.json())
      .then(data => setMusicTracks(data.tracks))
      .catch(err => console.error('Failed to load music tracks:', err));
  }, []);

  // Обработчик выбора изображений
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 10));
  }, []);

  // Удаление изображения
  const handleRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Прослушивание трека
  const handlePreviewMusic = useCallback((trackId: string) => {
    const track = musicTracks.find(t => t.id === trackId);
    if (!track || !track.file) return;

    if (audioPreview) {
      audioPreview.pause();
      audioPreview.currentTime = 0;
    }

    const audio = new Audio(track.file);
    audio.volume = 0.5;
    audio.play();
    setAudioPreview(audio);
  }, [musicTracks, audioPreview]);

  // Генерация видео
  const handleGenerateVideo = useCallback(async () => {
    if (images.length === 0) {
      alert('Добавьте хотя бы одно изображение');
      return;
    }

    setIsGenerating(true);
    setGeneratedVideoUrl(null);

    try {
      const formData = new FormData();
      images.forEach((img, idx) => {
        formData.append(`image_${idx}`, img);
      });
      formData.append('marketplace', marketplace);
      formData.append('musicTrack', selectedMusic);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('userId', userId.toString());

      const response = await fetch('/api/video/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedVideoUrl(data.videoUrl);
        setImages([]);
        setTitle('');
        setDescription('');
      } else {
        if (isAdmin(userId)) {
          setGeneratedVideoUrl('/mock-video.mp4');
        } else {
          alert(data.error || 'Ошибка генерации видео');
        }
      }
    } catch (error) {
      console.error('Video generation error:', error);
      if (isAdmin(userId)) {
        setGeneratedVideoUrl('/mock-video.mp4');
      } else {
        alert('Ошибка генерации видео');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [images, marketplace, selectedMusic, title, description, userId]);

  const videoPrice = PRICING.VIDEO;

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="max-w-md md:max-w-none">
        <h1 className="text-3xl font-bold mb-6">Video Master</h1>

        {/* Выбор маркетплейса */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Выберите маркетплейс</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <button
              onClick={() => setMarketplace('ozon')}
              className={`w-full p-8 rounded-xl border-2 transition-all ${
                marketplace === 'ozon'
                  ? 'border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-600/20 ring-2 ring-blue-400'
                  : 'border-gray-700 bg-gray-800 hover:border-blue-400 hover:bg-gray-750'
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <img src="/assets/logos/ozon.svg" alt="Ozon" className="w-14 h-14" />
                <span className="text-xl font-bold">Ozon</span>
              </div>
              <div className="text-sm text-gray-400">
                {VIDEO_FORMATS.ozon.width}x{VIDEO_FORMATS.ozon.height} ({VIDEO_FORMATS.ozon.aspectRatio})
              </div>
              <div className="text-xs text-gray-500 mt-1">Квадратный формат</div>
            </button>

            <button
              onClick={() => setMarketplace('wildberries')}
              className={`w-full p-8 rounded-xl border-2 transition-all ${
                marketplace === 'wildberries'
                  ? 'border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-600/20 ring-2 ring-purple-400'
                  : 'border-gray-700 bg-gray-800 hover:border-purple-400 hover:bg-gray-750'
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <img src="/assets/logos/wildberries.svg" alt="Wildberries" className="w-14 h-14" />
                <span className="text-xl font-bold">Wildberries</span>
              </div>
              <div className="text-sm text-gray-400">
                {VIDEO_FORMATS.wildberries.width}x{VIDEO_FORMATS.wildberries.height} ({VIDEO_FORMATS.wildberries.aspectRatio})
              </div>
              <div className="text-xs text-gray-500 mt-1">Вертикальный формат (Reels)</div>
            </button>
          </div>
        </div>

        {/* Выбор музыки */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Выберите музыку</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {musicTracks.map(track => (
              <button
                key={track.id}
                onClick={() => setSelectedMusic(track.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedMusic === track.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{track.name}</span>
                  <span className="text-xs text-gray-500">{track.size}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{track.description}</p>
                {track.file && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewMusic(track.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation();
                        handlePreviewMusic(track.id);
                      }
                    }}
                    className="text-xs text-blue-600 hover:underline cursor-pointer"
                  >
                    Прослушать
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Загрузка изображений */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Загрузите изображения</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Дополнительные поля */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название (опционально)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название товара"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Описание (опционально)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Кнопка генерации */}
        <div className="mb-6">
          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating || images.length === 0}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            {isGenerating ? 'Генерация...' : `Создать видео (${videoPrice} ₽)`}
          </button>
          {!isAdmin(userId) && (
            <p className="text-sm text-gray-500 mt-2">
              Стоимость генерации: {videoPrice} ₽
            </p>
          )}
        </div>

        {/* Превью сгенерированного видео */}
        {generatedVideoUrl && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Ваше видео готово!</h2>
            <div className="w-full max-w-none">
              <video
                src={generatedVideoUrl}
                controls
                className="w-full rounded-lg shadow-lg"
                style={{
                  aspectRatio: marketplace === 'wildberries' ? '9/16' : '1/1',
                }}
              />
              <div className="mt-4 flex gap-2">
                <a
                  href={generatedVideoUrl}
                  download
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700"
                >
                  Скачать видео
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + generatedVideoUrl);
                    alert('Ссылка скопирована!');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Копировать ссылку
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
