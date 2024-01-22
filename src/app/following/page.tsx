'use client'
import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'

import yt from '@yt'

export default function Following() {
  const videoPages = usePaginated(yt.listFollowedUsersVideos!)
  if (videoPages.errors.length) return <div>{videoPages.errors.map(e => e.message).join('\n')}</div>
  return <VideoGrid as="main" header="Following" videos={videoPages.data.flat()} getNext={videoPages.next} />
}
