import { Grid } from 'lese'
import styled from 'styled-components'

import { usePaginated } from '@/hooks/usePaginated'
import { VideoListItem } from '@components/Video/ListItem'
import * as std from '@std'
import provider from '@yt'

const SearchContainer = styled('div')`
  display: flex;
  max-width: 1000px;
  margin: auto;

  padding: 24px;
`

const Search = ({ params: { query } }: { params: { query: string } }) => {
  const videos = usePaginated(() => provider.listSearch([std.ResourceType.Video])(query ?? ''))
  return (
    <SearchContainer>
      <Grid autoRows="220px" gap="24px">
        {videos.data.flat().map((video) => (
          <VideoListItem key={video.id} video={video} />
        ))}
      </Grid>
    </SearchContainer>
  )
}

export default Search
