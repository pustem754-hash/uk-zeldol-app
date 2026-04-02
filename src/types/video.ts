export type MarketplaceType = 'ozon' | 'wildberries';

export type MusicTrack = {
  id: string;
  name: string;
  file: string | null;
  size: string;
  duration: number;
  description: string;
};

export type VideoFormat = {
  width: number;
  height: number;
  aspectRatio: string;
  label: string;
  color: string;
};

export type VideoGenerationRequest = {
  marketplace: MarketplaceType;
  images: string[];
  musicTrack: string;
  title?: string;
  description?: string;
  userId: number;
};

export type VideoGenerationResponse = {
  success: boolean;
  videoUrl?: string;
  taskId?: string;
  error?: string;
};

export type VideoHistoryItem = {
  id: string;
  marketplace: MarketplaceType;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  title?: string;
  musicTrack: string;
};
