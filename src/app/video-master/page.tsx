import VideoMaster from '@/components/VideoMaster';

export default function VideoMasterPage() {
  // TODO: Получить userId из сессии. Пока используем admin userId = 1
  const userId = 1;

  return <VideoMaster userId={userId} />;
}
