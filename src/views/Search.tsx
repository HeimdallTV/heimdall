import { Grid } from 'lese'
import { VideoListItem } from '@components/Video/ListItem'
import styled from '@emotion/styled'
import { useParams } from 'react-router'
import * as std from '@std'
import provider from '@yt'
import { usePaginated } from 'hooks/usePaginated'

const SearchContainer = styled('div')`
  display: flex;
  max-width: 1000px;
  margin: auto;

  padding: 24px;
`

const Search: FC = () => {
  const params = useParams()
  const [videos, , getMoreVideos] = usePaginated(() =>
    provider.getSearch([std.ResourceType.Video])(params.query ?? ''),
  )

  return (
    <SearchContainer>
      <Grid autoRows="220px" gap="24px">
        {videos.flat().map(video => (
          <VideoListItem video={video} />
        ))}
      </Grid>
    </SearchContainer>
  )
}

export default Search
