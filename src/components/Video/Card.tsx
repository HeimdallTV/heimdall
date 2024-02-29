import React, { memo } from 'react'

import * as std from '@std'
import yt from '@yt'

import { ChannelIcon } from '../Channel/Link'
import { VideoSubLine, getVideoUrl } from './Shared'
import { VideoThumbnail } from './Thumbnail'
import { Author } from '../Author'

import { Card, Skeleton, Stack, Text } from '@mantine/core'
import { Link } from 'wouter'
import { useDelayedEvent } from '@/hooks/useDelayed'
import Grid from '../lese/components/Grid'

export const VideoCard: React.FC<{ video: std.Video }> = memo(({ video }) => {
  // prefecthing the player
  const getPlayer = useDelayedEvent(
    () =>
      yt.getPlayer(video.id).then((player) => {
        const videoSource = player.sources
          .filter(std.isVideoSource)
          .find((source) => source.mimetype?.includes('vp9'))!
        const audioSource = player.sources
          .filter(std.isAudioSource)!
          .find((source) => source.mimetype?.includes('opus'))!

        const videoPreconnect = document.createElement('link')
        videoPreconnect.rel = 'preload'
        videoPreconnect.as = 'video'
        videoPreconnect.href = videoSource.url
        document.head.appendChild(videoPreconnect)

        const audioPreconnect = document.createElement('link')
        audioPreconnect.rel = 'preload'
        audioPreconnect.as = 'audio'
        audioPreconnect.href = audioSource.url
        document.head.appendChild(audioPreconnect)
      }),
    400,
  )
  return (
    <Card
      component={Link}
      href={getVideoUrl(video)}
      styles={{ root: { background: 'none', overflow: 'visible' } }}
      onMouseEnter={getPlayer.trigger}
      onMouseLeave={getPlayer.cancel}
    >
      <Card.Section>
        <VideoThumbnail {...video} />
      </Card.Section>
      <Grid columns="auto 1fr" gap="1em" style={{ marginTop: '0.75em' }}>
        {video.author?.avatar && <ChannelIcon channel={video.author} />}
        <Stack gap="4px" style={{ overflow: 'hidden' }}>
          <Text fw="bold" size="lg" lineClamp={2}>
            {video.title}
          </Text>
          {video.author && <Author author={video.author!} />}
          <VideoSubLine video={video} />
        </Stack>
      </Grid>
    </Card>
  )
})

export const VideoCardSkeleton: React.FC = () => (
  <Card styles={{ root: { background: 'none', overflow: 'visible' } }}>
    <Card.Section>
      <Skeleton width="100%" style={{ aspectRatio: '16 / 9' }} />
    </Card.Section>
    <Grid columns="auto 1fr" gap="1em" style={{ marginTop: '1em' }}>
      <Skeleton circle height="40px" />
      <Stack w="100%" gap="4px">
        <Skeleton width="100%" height="3em" />
        <Skeleton width="120px" height="1.5em" />
        <Skeleton width="180px" height="1.5em" />
      </Stack>
    </Grid>
  </Card>
)
