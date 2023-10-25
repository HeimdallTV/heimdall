import React from 'react'

import { formatDateAgo, formatNumberShort } from '@libs/format'
import * as std from '@std'

import { LiveNow } from './Badge'
import { Text } from '@mantine/core'

export const VideoSubLine: React.FC<{
  video: Pick<std.Video, 'type' | 'viewCount' | 'publishDate'>
  short?: boolean
}> = ({ video, short }) => {
  if (video.type === std.VideoType.Live) {
    return (
      <>
        <Text>{formatNumberShort(video.viewCount!)} watching</Text>
        <LiveNow>LIVE NOW</LiveNow>
      </>
    )
  }
  return (
    <Text>
      {formatNumberShort(video.viewCount!)}
      {short ? '' : ' views'}
      {video.publishDate ? ` • ${formatDateAgo(video.publishDate!)}` : ''}
    </Text>
  )
}
