import { VideoCard } from '@components/Video/Card'
import yt from '@yt'
import styled from '@emotion/styled'
import { usePaginated } from 'hooks/usePaginated'
import { useEffect } from 'react'
import * as std from '@std'

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
  }, [])

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
