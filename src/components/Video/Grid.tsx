import * as std from '@std'
import styled from 'styled-components'
import { VideoCard, VideoCardSkeleton } from './Card'
import { Text } from '@mantine/core'
import { InfiniteScrollDetector } from '../InfiniteScrollDetector'
import { useResizeObserver } from '@mantine/hooks'
import { forwardRef } from 'react'

type VideoGridProps = {
	ref?: React.Ref<HTMLElement>
	as?: React.ElementType
	header?: React.ReactElement | string
	size?: 'sm' | 'md'
	collapsed?: boolean

	loading?: boolean
	loadingSkeletonCount?: number
	videos: (std.Video | std.Shelf)[]
	getNext?: () => void
}
export const VideoGrid: FC<VideoGridProps> = forwardRef(
	(
		{
			as,
			header,
			size = 'md',
			collapsed = false,
			loading = false,
			loadingSkeletonCount = 32,
			videos,
			getNext,
		},
		ref,
	) => {
		return (
			<VideoGridContainer as={as} $hasHeader={Boolean(header)}>
				{header && <VideoGridHeader header={header} />}
				<Grid $collapsed={collapsed} $size={size} ref={ref}>
					{videos
						.filter((shelfOrVideo): shelfOrVideo is std.Video => 'id' in shelfOrVideo)
						.map((video) => (
							<VideoCard key={video.id} video={video} />
						))}
					{loading &&
						Array.from({ length: loadingSkeletonCount }).map((_, i) => <VideoCardSkeleton key={i} />)}
					<InfiniteScrollDetector onLoad={getNext} />
				</Grid>
			</VideoGridContainer>
		)
	},
)

const VideoGridContainer = styled.div<{ $hasHeader?: boolean }>`
  display: grid;
  grid-template-rows: ${(_) => (_.$hasHeader ? '48px 1fr' : '1fr')};
  grid-gap: 8px;
  align-items: start;
  container-type: inline-size;
  transform: translateZ(0);
`

const VideoGridHeader: FC<{ header: React.ReactElement | string }> = ({ header }) =>
	typeof header === 'string' ? (
		<Text size="xl" fw={700} style={{ alignSelf: 'center' }}>
			{header}
		</Text>
	) : (
		header
	)

const sizing =
	(small: number, medium: number) =>
	({ $size }: { $size: 'sm' | 'md' }) =>
		$size === 'sm' ? small : medium
const Grid = styled.section<{ $collapsed: boolean; $size: 'sm' | 'md' }>`
  display: grid;
  gap: ${(_) => (_.$size === 'sm' ? '16px 8px' : '32px 16px')};
  justify-content: stretch;
  position: relative;

  ${({ $collapsed, $size }) =>
		$collapsed &&
		`
    overflow: hidden;
    gap: 0px ${$size === 'sm' ? '8px' : '16px'};
    grid-auto-rows: 0px;
    grid-template-rows: auto;
  `}

  /*
  * minmax fails when the number of elements is less than the max number of columns
  * So we do the only sensible thing... repeat the query for every 320px
  * up to the point where I have questions about why you're using a 64:9
  * monitor at full width for a video client
  */
  @container (max-width: ${sizing(2880, 3840)}px) {
    grid-template-columns: repeat(10, 1fr);
  }
  @container (max-width: ${sizing(2560, 3520)}px) {
    grid-template-columns: repeat(9, 1fr);
  }
  @container (max-width: ${sizing(2240, 3200)}px) {
    grid-template-columns: repeat(8, 1fr);
  }
  @container (max-width: ${sizing(1920, 2880)}px) {
    grid-template-columns: repeat(7, 1fr);
  }
  @container (max-width: ${sizing(1600, 2560)}px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @container (max-width: ${sizing(1280, 1920)}px) {
    grid-template-columns: repeat(5, 1fr);
  }
  @container (max-width: ${sizing(960, 1600)}px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @container (max-width: ${sizing(800, 1280)}px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @container (max-width: ${sizing(640, 940)}px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @container (max-width: ${sizing(500, 640)}px) {
    grid-template-columns: 1fr;
  }
`
