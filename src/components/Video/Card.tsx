import React from 'react'

import * as std from '@std'

import { ChannelIcon } from '../Channel/Link'
import { VideoSubLine } from './Shared'
import { VideoThumbnail } from './Thumbnail'

import { Card, Group, Stack, Text } from '@mantine/core'
import Link from 'next/link'

export const VideoCard: React.FC<{ video: std.Video }> = ({ video }) => (
  <Card
    component={Link}
    href={`/w/${video.id}`}
    styles={{ root: { background: 'none', overflow: 'visible' } }}
  >
    <Card.Section>
      <VideoThumbnail {...video} />
    </Card.Section>

    <Group align="flex-start" wrap="nowrap" mt="sm">
      <ChannelIcon channel={video.author!} />
      <Stack gap="4px" style={{ overflow: 'hidden' }}>
        <Text fw="bold" size="lg" lineClamp={2}>
          {video.title}
        </Text>
        {/*<Link href={`/c/${video.author?.id}`}>{video.author?.name}</Link>*/}
        <Text size="sm" c="dimmed" truncate="end">
          {video.author?.name}
        </Text>

        <VideoSubLine video={video} />
      </Stack>
    </Group>
  </Card>
)
