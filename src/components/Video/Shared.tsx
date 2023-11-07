import React from 'react'

import { formatDateAgo, formatNumberShort } from '@libs/format'
import * as std from '@std'

import { LiveNow } from './Badge'
import { Text } from '@mantine/core'

export const VideoSubLine: React.FC<{
  video: Pick<std.Video, 'type' | 'viewCount' | 'publishDate'>
  short?: boolean
  size?: 'sm' | 'md'
}> = ({ video, short, size = 'md' }) => {
  if (video.type === std.VideoType.Live) {
    return (
      <>
        <Text c="dimmed" size={size}>
          {formatNumberShort(video.viewCount!)} watching
        </Text>
        <LiveNow>LIVE NOW</LiveNow>
      </>
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
