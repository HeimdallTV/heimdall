/** TODO (@aaditya-sahay): refactor to not have to mark the entire component as use client   */
'use client'

import { useEffect } from 'react'

import styled from 'styled-components'

import { usePaginated } from '@/hooks/usePaginated'
import { VideoCard } from '@components/Video/Card'
import * as std from '@std'
import yt from '@yt'

const HomeGrid = styled('div')`
  display: grid;
  gap: 48px 16px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin: 24px;
  justify-content: stretch;

  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
`

export default function Home() {
  const [videoPages, , getNextPage] = usePaginated(yt.getRecommended!)

  useEffect(() => {
    getNextPage()
  }, [getNextPage])

  return (
    <HomeGrid>
      {videoPages
        .flat()
        .filter((shelfOrVideo): shelfOrVideo is std.Video => 'id' in shelfOrVideo)
        .map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
    </HomeGrid>
  )
}
