'use client'
import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'
import { Text } from '@mantine/core'

import yt from '@yt'
import { Column } from 'lese'

export default function Following() {
  const [videoPages, errors, getNextPage] = usePaginated(yt.listFollowedUsersVideos!)
  console.log(videoPages, errors)
  if (errors.length) return <div>{errors.map(e => e.message).join('\n')}</div>
  return <VideoGrid as="main" header="Subscriptions" videos={videoPages.flat()} getNext={getNextPage} />
}
