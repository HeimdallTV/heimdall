import yt from '@yt'
import { useCallback, useEffect } from 'react'
import { usePaginated } from '@/hooks/usePaginated'
import { VideoGrid } from '@/components/Video/Grid'

export default function VideosTab({ channelId }: { channelId: string }) {
  const videos = usePaginated(useCallback(() => yt.listChannelVideos(channelId), [channelId]))
  useEffect(() => {
    if (videos.errors.length) {
      console.error(videos.errors)
    }
  }, [videos.errors])
  return <VideoGrid loading={videos.loading} videos={videos.data?.flat() ?? []} getNext={videos.next} />
}
