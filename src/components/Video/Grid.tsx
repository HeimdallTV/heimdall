import * as std from '@std'
import styled from 'styled-components'
import { VideoCard } from './Card'
import { Text } from '@mantine/core'

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr;
  grid-gap: 8px;
  align-items: start;
  padding: 24px;
  padding-top: 0;
`

const Grid = styled.section`
  display: grid;
  gap: 32px 16px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  justify-content: stretch;

  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
`

export const VideoGrid: FC<{
  as: React.ElementType
  header: React.ReactElement | string
  videos: (std.Video | std.Shelf)[]
  getNext?: () => void
}> = ({ as, header, videos, getNext }) => (
  <GridContainer as={as}>
    {typeof header === 'string' ? (
      <Text size="xl" fw={700} style={{ alignSelf: 'center' }}>
        {header}
      </Text>
    ) : (
      header
    )}
    <Grid>
      {videos
        .filter((shelfOrVideo): shelfOrVideo is std.Video => 'id' in shelfOrVideo)
        .map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
    </Grid>
  </GridContainer>
)
