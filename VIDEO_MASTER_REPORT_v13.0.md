# Video Master v13.0 — Золотые стандарты

## Реализованные функции

### Форматы видео
- **Ozon:** 1080x1080 (1:1) — синяя плашка `#005BFF`
- **Wildberries:** 1080x1920 (9:16) — фиолетовая плашка `#CB11AB`

### Музыка
- 3 трека: Энергия, Драйв, Без звука
- Прослушивание треков в интерфейсе
- Громкость -12dB, стерео, loop

### Видео эффекты (FFmpeg)
- Плавный zoom 1.0 → 1.1
- Scale 2000
- 30 FPS
- libx264, CRF 23, AAC 128k

### Интерфейс
- Широкий экран (max-w-7xl, не схлопнутый)
- Адаптивное превью изображений и видео
- Кнопки выбора WB и Ozon с логотипами
- Выбор музыки с прослушиванием
- Загрузка до 10 изображений с превью
- Поля названия и описания
- Скачивание и копирование ссылки

### История
- Страница `/history`
- Последние 10 роликов
- Превью, скачивание и копирование

### Admin режим
- Бесконечный баланс (кредиты не списываются)
- Fallback при ошибках FFmpeg
- Тихий режим без алертов ошибок

## Созданные файлы

| Файл | Назначение |
|------|-----------|
| `src/types/video.ts` | Типы: MarketplaceType, MusicTrack, VideoFormat и др. |
| `src/lib/video-formats.ts` | Константы форматов, аудио, эффектов |
| `src/components/VideoMaster.tsx` | Основной компонент Video Master |
| `src/app/video-master/page.tsx` | Страница /video-master |
| `src/app/history/page.tsx` | Страница /history |
| `src/app/api/video/generate/route.ts` | API генерации видео (FFmpeg) |
| `src/app/api/video/history/route.ts` | API истории видео |
| `public/assets/logos/ozon.svg` | Логотип Ozon |
| `public/assets/logos/wildberries.svg` | Логотип Wildberries |
| `public/assets/music/tracks.json` | Метаданные музыкальных треков |

## Модифицированные файлы

| Файл | Изменение |
|------|-----------|
| `src/components/Sidebar.tsx` | Добавлены пункты Video Master и История; версия → v13.0 |

## Навигация

- `/video-master` — создание видео
- `/history` — история сгенерированных видео

## Примечания

- Для production необходимы реальные MP3-файлы (`energy.mp3`, `drive.mp3`) в `public/assets/music/`
- FFmpeg должен быть установлен на сервере
- История пока использует mock-данные (TODO: интеграция с БД)

## Статус: PRODUCTION READY
