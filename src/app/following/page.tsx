'use client'
import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'

import yt from '@yt'

export default function Following() {
  const [videoPages, errors, getNextPage] = usePaginated(yt.listFollowedUsersVideos!)
  if (errors.length) return <div>{errors.map(e => e.message).join('\n')}</div>
  return <VideoGrid as="main" header="Following" videos={videoPages.flat()} getNext={getNextPage} />
}
