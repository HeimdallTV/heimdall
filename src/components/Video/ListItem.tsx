import { Column, Flex, Grid } from 'lese'
import Link from 'next/link'

import * as std from '@std'

import { ChannelIconWithName, CompactChannelLink } from '../Channel/Link'
import { VideoSubLine } from './Shared'
import { VideoThumbnail } from './Thumbnail'
import { Stack, Text } from '@mantine/core'

export const VideoListItem: React.FC<{
  video: std.Video
}> = props => {
  const video = props.video
  return (
    <Link href={`/w/${video.id}`}>
      <Grid columns="calc(220px * 16 / 9) 1fr" gap="12px">
        <VideoThumbnail {...video} />

        <Stack gap="12px">
          <Text lineClamp={2}>{video.title}</Text>
          <VideoSubLine video={video} short />

          {video.author && <ChannelIconWithName size={24} channel={video.author} />}
          <Text c="dimmed">{video.shortDescription}</Text>
        </Stack>
      </Grid>
    </Link>
  )
}

export const CompactVideoListItem: React.FC<{ video: std.Video }> = ({ video }) => {
  return (
    <Grid as={Link} href={`/w/${video.id}`} columns="calc(94px * 16 / 9) 1fr" gap="8px">
      <VideoThumbnail {...video} />

      <Column separation="6px 2px ...0px" style={{ fontSize: '0.9em' }}>
        <Text size="lg" lineClamp={2}>
          {video.title}
        </Text>
        {video.author && <CompactChannelLink channel={video.author} />}
        <VideoSubLine video={video} />
      </Column>
    </Grid>
  )
}
