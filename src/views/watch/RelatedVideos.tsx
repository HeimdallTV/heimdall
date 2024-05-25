import { CompactVideoListItem, CompactVideoListItemSkeleton } from '@/components/Video/ListItem'
import type * as std from '@/parser/std'
import { Column } from 'lese'

export const RelatedVideos: React.FC<{
  relatedVideos: (std.Video | std.Playlist | std.User)[][]
  loading: boolean
}> = ({ relatedVideos, loading }) => (
  <Column separation="8px">
    {loading && new Array(16).fill(0).map((_, i) => <CompactVideoListItemSkeleton key={i} />)}
    {relatedVideos
      .flat()
      // TODO: Concrete way of telling its a video
      .filter((video): video is std.Video => 'type' in video)
      .map((video, i) => (
        <CompactVideoListItem key={i} video={video} />
      ))}
  </Column>
)
