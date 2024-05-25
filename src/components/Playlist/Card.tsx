import type React from 'react'
import { memo } from 'react'

import type * as std from '@std'
import yt from '@yt'

import { Card, Skeleton, Stack, Text } from '@mantine/core'
import { useDelayedEvent } from '@/hooks/useDelayed'
import Grid from '../lese/components/Grid'
import { Thumbnail, ThumbnailBadge } from '../Thumbnail'
import { Author } from '../Author'
import { LinkWithHover } from '../Link'
import { Link } from 'wouter'

const getPlaylistUrl = (playlist: std.Playlist) => `/list/${playlist.id}`

export const PlaylistCard: React.FC<{ playlist: std.Playlist }> = memo(({ playlist }) => {
  // prefecthing the player
  const getPlaylist = useDelayedEvent(() => yt.getPlaylist!(playlist.id), 400)
  return (
    <Card
      component={Link}
      href={getPlaylistUrl(playlist)}
      styles={{ root: { background: 'none', overflow: 'visible' } }}
      onMouseEnter={getPlaylist.trigger}
      onMouseLeave={getPlaylist.cancel}
    >
      <Card.Section>
        <Thumbnail staticThumbnail={playlist.thumbnail}>
          {playlist.videoCount !== undefined && <ThumbnailBadge text={`${playlist.videoCount} videos`} />}
        </Thumbnail>
      </Card.Section>
      <Stack gap="4px" style={{ overflow: 'hidden', marginTop: '0.75em' }}>
        <Text fw="bold" size="lg" lineClamp={2}>
          {playlist.title}
        </Text>
        {playlist.author && <Author author={playlist.author} />}
        <LinkWithHover href={getPlaylistUrl(playlist)} fw={500}>
          View Full Playlist
        </LinkWithHover>
      </Stack>
    </Card>
  )
})

export const PlaylistCardSkeleton: React.FC = () => (
  <Card styles={{ root: { background: 'none', overflow: 'visible' } }}>
    <Card.Section>
      <Skeleton width="100%" style={{ aspectRatio: '16 / 9' }} />
    </Card.Section>
    <Grid columns="auto 1fr" gap="1em" style={{ marginTop: '1em' }}>
      <Skeleton circle height="40px" />
      <Stack w="100%" gap="4px">
        <Skeleton width="100%" height="3em" />
        <Skeleton width="120px" height="1.5em" />
      </Stack>
    </Grid>
  </Card>
)
