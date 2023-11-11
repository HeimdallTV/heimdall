import React from 'react'

import { formatDateAgo, formatNumberShort } from '@libs/format'
import * as std from '@std'

import { Text } from '@mantine/core'
import styled from 'styled-components'

export const LiveNow = styled.span`
  color: var(--mantine-primary-color-filled);
  border: 1px solid var(--mantine-primary-color-filled);
  border-radius: 2px;
  padding: 3px 4px;

  /* FIXME: Should be unnecessary */
  align-self: flex-start;
`

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
