import React from 'react'

import * as std from '@std'
import yt from '@yt'

import { ChannelIcon } from '../Channel/Link'
import { VideoAuthor, VideoSubLine } from './Shared'
import { VideoThumbnail } from './Thumbnail'

import { Card, Skeleton, Stack, Text } from '@mantine/core'
import { Link } from 'wouter'
import { useDelayedEvent } from '@/hooks/useDelayed'
import Grid from '../lese/components/Grid'

export const VideoCard: React.FC<{ video: std.Video }> = ({ video }) => {
	// prefecthing the player
	const getPlayer = useDelayedEvent(() => yt.getPlayer(video.id), 400)
	return (
		<Card
			component={Link}
			href={`/w/${video.id}`}
			styles={{ root: { background: 'none', overflow: 'visible' } }}
			onMouseEnter={getPlayer.trigger}
			onMouseLeave={getPlayer.cancel}
		>
			<Card.Section>
				<VideoThumbnail {...video} />
			</Card.Section>
			<Grid columns="auto 1fr" gap="1em" style={{ marginTop: '0.75em' }}>
				{video.author && <ChannelIcon channel={video.author} />}
				<Stack gap="4px" style={{ overflow: 'hidden' }}>
					<Text fw="bold" size="lg" lineClamp={2}>
						{video.title}
					</Text>
					{video.author && <VideoAuthor author={video.author!} />}
					<VideoSubLine size="sm" video={video} />
				</Stack>
			</Grid>
		</Card>
	)
}

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
