import React from 'react'
import { formatDateAgo, formatNumberShort } from '@libs/format'
import * as std from '@std'
import { Badge, Text } from '@mantine/core'
import { Row } from 'lese'

export const LiveNow = () => <Badge>LIVE NOW</Badge>

export const VideoSubLine: React.FC<{
  video: Pick<std.Video, 'type' | 'viewCount' | 'publishDate'>
  short?: boolean
  size?: 'sm' | 'md'
}> = ({ video, short, size = 'md' }) => {
  if (video.type === std.VideoType.Live) {
    return (
      <Row separation="4px">
        <Text c="dimmed" size={size}>
          {formatNumberShort(video.viewCount!)} watching
        </Text>
        <LiveNow />
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
