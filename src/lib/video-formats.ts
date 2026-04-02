import { VideoFormat, MarketplaceType } from '@/types/video';

export const VIDEO_FORMATS: Record<MarketplaceType, VideoFormat> = {
  ozon: {
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    label: 'Ozon (Квадрат)',
    color: '#005BFF',
  },
  wildberries: {
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    label: 'Wildberries / Reels (Вертикаль)',
    color: '#CB11AB',
  },
};

export const AUDIO_SETTINGS = {
  volume: 3.5,
  volumeDb: -12,
  channels: 2,
  loop: true,
};

export const VIDEO_EFFECTS = {
  zoomStart: 1.0,
  zoomEnd: 1.1,
  scale: 2000,
  fps: 30,
  duration: 15,
};
