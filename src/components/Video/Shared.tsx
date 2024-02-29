import React from 'react'
import { formatDateAgo, formatNumberShort } from '@libs/format'
import * as std from '@std'
import { Text } from '@mantine/core'
import { Row } from 'lese'

export const getVideoUrl = (video: std.Video) =>
  `/w/${video.id}${video.viewedLength ? `?t=${video.viewedLength}` : ''}`

// todo: better name
// todo: is size used?
export const VideoSubLine: React.FC<{
  video: Pick<std.Video, 'type' | 'viewCount' | 'publishDate'>
  short?: boolean
  size?: 'sm' | 'md'
}> = ({ video, short, size = 'sm' }) => {
  if (video.type === std.VideoType.Live) {
    return (
      <Row separation="4px">
        <Text c="dimmed" size={size}>
          {formatNumberShort(video.viewCount!)} viewers
        </Text>
      </Row>
    )
  }

  return (
    <Text c="dimmed" size={size}>
      {formatNumberShort(video.viewCount!)}
      {short ? '' : ' views'}
      {video.publishDate ? ` • ${formatDateAgo(video.publishDate!)}` : ''}
    </Text>
  )
}
