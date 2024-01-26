import { Column, Grid } from 'lese'
import { Link } from 'wouter'

import * as std from '@std'

import { VideoAuthor, VideoSubLine } from './Shared'
import { VideoThumbnail } from './Thumbnail'
import { Skeleton, Text } from '@mantine/core'

export const VideoListItem: React.FC<{
	video: std.Video
}> = (props) => {
	const video = props.video
	return (
		<Link href={`/w/${video.id}`}>
			<Grid columns="calc(220px * 16 / 9) 1fr" gap="12px">
				<VideoThumbnail {...video} />

				<Column separation="12px">
					<Text lineClamp={2}>{video.title}</Text>
					<VideoSubLine video={video} short />

					{video.author && <VideoAuthor author={video.author} />}
					<Text c="dimmed">{video.shortDescription}</Text>
				</Column>
			</Grid>
		</Link>
	)
}

export const CompactVideoListItem: React.FC<{ video: std.Video }> = ({ video }) => (
	<Grid as={Link} href={`/w/${video.id}`} columns="calc(94px * 16 / 9) 1fr" gap="8px">
		<VideoThumbnail
			type={video.type}
			length={video.length}
			staticThumbnail={video.staticThumbnail}
			animatedThumbnail={video.animatedThumbnail}
		/>

		<Column separation="4px 2px ...0px" style={{ fontSize: '0.9em' }}>
			<Text fw={600} lineClamp={2}>
				{video.title}
			</Text>
			{video.author && <VideoAuthor author={video.author} size="sm" />}
			<VideoSubLine video={video} />
		</Column>
	</Grid>
)

export const CompactVideoListItemSkeleton: React.FC = () => (
	<Grid columns="calc(94px * 16 / 9) 1fr" gap="8px">
		<Skeleton width="100%" style={{ aspectRatio: '16 / 9' }} />
		<Column separation="4px 2px ...0px" style={{ fontSize: '0.9em' }}>
			<Skeleton width="100%" height="1em" />
			<Skeleton width="100%" height="1em" />
			<Skeleton width="100%" height="1em" />
		</Column>
	</Grid>
)
