import * as std from '@std'
import styled from 'styled-components'
import { VideoCard, VideoCardSkeleton } from './Card'
import { Text } from '@mantine/core'
import { InfiniteScrollDetector } from '../InfiniteScrollDetector'

export const VideoGrid: FC<{
  as: React.ElementType
  header: React.ReactElement | string
  videos: (std.Video | std.Shelf)[]
  getNext?: () => void
}> = ({ as, header, videos, getNext }) => {
  return (
    <VideoGridContainer as={as}>
      <VideoGridHeader header={header} />
      <Grid>
        {videos.length === 0 && Array.from({ length: 32 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        {videos
          .filter((shelfOrVideo): shelfOrVideo is std.Video => 'id' in shelfOrVideo)
          .map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        <InfiniteScrollDetector onLoad={getNext} />
      </Grid>
    </VideoGridContainer>
  )
}

const VideoGridContainer = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr;
  grid-gap: 8px;
  align-items: start;
  padding: 24px;
  padding-top: 0;
  container-type: inline-size;
  transform: translateZ(0);
`

const VideoGridHeader: FC<{ header: React.ReactElement | string }> = ({ header }) =>
  typeof header === 'string' ? (
    <Text size="xl" fw={700} style={{ alignSelf: 'center' }}>
      {header}
    </Text>
  ) : (
    header
  )

const Grid = styled.section`
  display: grid;
  gap: 32px 16px;
  justify-content: stretch;
  position: relative;

  /*
  * Fails when the number of elements is less than the max number of columns
  * So we do the only sensible thing... repeat the query for every 320px
  */
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  @container (max-width: 3840px) {
    grid-template-columns: repeat(10, 1fr);
  }
  @container (max-width: 3520px) {
    grid-template-columns: repeat(9, 1fr);
  }
  @container (max-width: 3200px) {
    grid-template-columns: repeat(8, 1fr);
  }
  @container (max-width: 2880px) {
    grid-template-columns: repeat(7, 1fr);
  }
  @container (max-width: 2560px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @container (max-width: 1920px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @container (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @container (max-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @container (max-width: 940px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @container (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`
