'use client'
import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'

import yt from '@yt'

export default function Home() {
  const [videoPages, , getNextPage] = usePaginated(yt.getRecommended!)
  return <VideoGrid as="main" header="Recommended" videos={videoPages.flat()} getNext={getNextPage} />
}
