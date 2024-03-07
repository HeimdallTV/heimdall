import React from 'react'
import { formatDateAgo, formatNumberShort } from '@libs/format'
import * as std from '@std'
import { Text } from '@mantine/core'
import { Row } from 'lese'

export const getVideoUrl = (video: std.Video) =>
  `/w/${video.id}${
    video.viewedLength && (!video.length || video.viewedLength / video.length < 0.95)
      ? `?t=${video.viewedLength}`
      : ''
  }`

// todo: better name
// todo: is size used?
export const VideoSubLine: React.FC<{
  video: Pick<std.Video, 'type' | 'viewCount' | 'publishDate' | 'subscriberOnly'>
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

  const viewCount = video.viewCount && formatNumberShort(video.viewCount!) + (short ? '' : ' views')
  const publishDate = video.publishDate && formatDateAgo(video.publishDate!)
  const text = [viewCount, publishDate].filter(Boolean).join(' • ')

  return (
    <Text component="span" c="dimmed" size={size}>
      {video.subscriberOnly && (
        <Text component="span" c="blue" fw={600} size={size} style={{ marginRight: '.5em' }}>
          Subs only
        </Text>
      )}
      {text}
    </Text>
  )
}
