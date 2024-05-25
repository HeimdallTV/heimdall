import * as std from '@std'
import { Thumbnail, ThumbnailBadge, type ThumbnailProps } from '../Thumbnail'
import { formatNumberDuration } from '@/libs/format'
import { IconRadar2 } from '@tabler/icons-react'

export type VideoThumbnailProps = ThumbnailProps & Pick<std.Video, 'type' | 'viewCount' | 'length'>
export const VideoThumbnail: React.FC<VideoThumbnailProps> = (props) => (
  <Thumbnail {...props}>
    {props.type === std.VideoType.Live && (
      <ThumbnailBadge color="blue" leftSection={<IconRadar2 size={16} />} text="LIVE" />
    )}
    {props.type !== std.VideoType.Live && props.length !== undefined && (
      <ThumbnailBadge text={formatNumberDuration(props.length!)} />
    )}
  </Thumbnail>
)
