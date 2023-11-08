import { VideoCard } from '@/components/Video/Card'
import { usePaginated } from '@/hooks/usePaginated'

import * as std from '@std'
import yt from '@yt'
import { styled } from '@linaria/react'

const HomeGrid = styled('section')`
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

  // useEffect(() => {
  //   getNextPage()
  // }, [getNextPage])

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
