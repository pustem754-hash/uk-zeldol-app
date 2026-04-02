import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { VIDEO_FORMATS, AUDIO_SETTINGS, VIDEO_EFFECTS } from '@/lib/video-formats';
import { isAdmin, checkCredits, deductCredit } from '@/lib/credits';
import { PRICING } from '@/lib/pricing';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const marketplace = formData.get('marketplace') as 'ozon' | 'wildberries';
    const musicTrack = formData.get('musicTrack') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const userId = parseInt(formData.get('userId') as string);

    // Получаем изображения
    const images: File[] = [];
    for (let i = 0; i < 10; i++) {
      const img = formData.get(`image_${i}`) as File | null;
      if (img) images.push(img);
    }

    if (images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No images provided' },
        { status: 400 }
      );
    }

    // Проверка баланса (кроме админа)
    if (!isAdmin(userId)) {
      const hasBalance = await checkCredits(userId, 'VIDEO');
      if (!hasBalance) {
        return NextResponse.json(
          { success: false, error: 'Insufficient balance' },
          { status: 402 }
        );
      }
    }

    // Создаем временную директорию
    const timestamp = Date.now();
    const tempDir = join(process.cwd(), 'temp', `video_${timestamp}`);
    await mkdir(tempDir, { recursive: true });

    // Сохраняем изображения
    const imagePaths: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const buffer = Buffer.from(await images[i].arrayBuffer());
      const imagePath = join(tempDir, `image_${i}.jpg`);
      await writeFile(imagePath, buffer);
      imagePaths.push(imagePath);
    }

    // Получаем формат видео
    const format = VIDEO_FORMATS[marketplace];
    const outputPath = join(process.cwd(), 'public', 'generated', `video_${timestamp}.mp4`);
    await mkdir(join(process.cwd(), 'public', 'generated'), { recursive: true });

    // Генерируем видео с FFmpeg
    try {
      await generateVideoWithFFmpeg(
        imagePaths,
        outputPath,
        format.width,
        format.height,
        musicTrack
      );

      // Списываем кредиты (кроме админа)
      if (!isAdmin(userId)) {
        await deductCredit(userId, 'VIDEO');
      }

      // Сохраняем в историю
      await saveToHistory(userId, {
        marketplace,
        videoUrl: `/generated/video_${timestamp}.mp4`,
        thumbnailUrl: `/generated/video_${timestamp}_thumb.jpg`,
        title,
        musicTrack,
      });

      return NextResponse.json({
        success: true,
        videoUrl: `/generated/video_${timestamp}.mp4`,
      });
    } catch (ffmpegError) {
      console.error('FFmpeg error:', ffmpegError);

      // Для админа возвращаем mock
      if (isAdmin(userId)) {
        return NextResponse.json({
          success: true,
          videoUrl: '/mock-video.mp4',
          message: 'Admin mode: FFmpeg error bypassed',
        });
      }

      return NextResponse.json(
        { success: false, error: 'Video generation failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateVideoWithFFmpeg(
  imagePaths: string[],
  outputPath: string,
  width: number,
  height: number,
  musicTrack: string
): Promise<void> {
  // Создаем список файлов для FFmpeg
  const fileListPath = join(process.cwd(), 'temp', `filelist_${Date.now()}.txt`);
  const fileListContent = imagePaths
    .map(path => `file '${path}'\nduration 3`)
    .join('\n');
  await writeFile(fileListPath, fileListContent);

  // Путь к музыке
  const musicPath =
    musicTrack !== 'none'
      ? join(process.cwd(), 'public', 'assets', 'music', `${musicTrack}.mp3`)
      : null;

  // FFmpeg команда с "золотыми стандартами"
  let ffmpegCmd = `ffmpeg -f concat -safe 0 -i ${fileListPath} `;

  // Видео фильтры: масштабирование + плавный zoom
  ffmpegCmd += `-vf "scale=${VIDEO_EFFECTS.scale}:-1,zoompan=z='min(zoom+0.0002,${VIDEO_EFFECTS.zoomEnd})':d=${VIDEO_EFFECTS.fps * 3}:s=${width}x${height}:fps=${VIDEO_EFFECTS.fps}" `;

  // Если есть музыка
  if (musicPath) {
    ffmpegCmd += `-i ${musicPath} `;
    ffmpegCmd += `-af "volume=${AUDIO_SETTINGS.volume},aloop=loop=-1:size=2e+09" `;
    ffmpegCmd += `-shortest `;
  }

  // Выходные параметры
  ffmpegCmd += `-c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p `;
  ffmpegCmd += `-c:a aac -b:a 128k -ar 44100 -ac ${AUDIO_SETTINGS.channels} `;
  ffmpegCmd += `-y ${outputPath}`;

  await execAsync(ffmpegCmd);
}

async function saveToHistory(
  userId: number,
  data: {
    marketplace: string;
    videoUrl: string;
    thumbnailUrl: string;
    title?: string;
    musicTrack: string;
  }
): Promise<void> {
  // TODO: Сохранить в базу данных
  console.log('Saving to history:', { userId, ...data });
}
