import React from 'react'
import { formatDateAgo, formatNumberShort } from '@libs/format'
import * as std from '@std'
import { MantineSize, Text } from '@mantine/core'
import { Row } from 'lese'
import Link from 'next/link'
import styled from 'styled-components'
import { VerifiedBadge } from '../Badges'

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

const VideoAuthorLink = styled(Link)<{ size?: MantineSize }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--mantine-color-dimmed);
  font-size: var(--mantine-font-size-${({ size }) => size ?? 'md'});
  &:hover {
    color: var(--mantine-color-text);
  }
`

export const VideoAuthor: React.FC<{
  author: Pick<std.User, 'name' | 'verified' | 'id'>
  size?: MantineSize
}> = ({ author, size }) => (
  <VideoAuthorLink href={`/c/${author.id}`} size={size}>
    {author.name}
    <VerifiedBadge size={size} />
  </VideoAuthorLink>
)
