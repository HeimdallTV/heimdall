import { CompactVideoListItem } from '@/components/Video/ListItem'
import { usePaginated } from '@/hooks/usePaginated'
import { Video } from '@/parser/std'
import { Column } from 'lese'

export const RelatedVideos: React.FC<{ video: Video }> = ({ video }) => {
  const [videos, errors, getNextVideos] = usePaginated(video.related!)
  return (
    <Column separation="8px">
      {videos
        .flat()
        // TODO: Concrete way of telling its a video
        .filter((video): video is Video => 'type' in video)
        .map((video, i) => (
          <CompactVideoListItem key={i} video={video} />
        ))}
    </Column>
  )
}
