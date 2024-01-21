'use client'
import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'
import { formatDayRelative } from '@/libs/format'

import yt from '@yt'

export default function History() {
  const [historyVideoPages, errors, getNextPage] = usePaginated(yt.listHistory!)
  console.log(historyVideoPages, errors)
  if (errors.length) return <div>{errors.map(e => e.message).join('\n')}</div>
  return (
    <main>
      {historyVideoPages.flat().map(({ date, videos }) => (
        <VideoGrid as="section" key={date.toISOString()} header={formatDayRelative(date)} videos={videos} />
      ))}
    </main>
  )
}
