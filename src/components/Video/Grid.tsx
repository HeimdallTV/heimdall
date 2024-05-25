import type * as std from '@std'
import { VideoCard, VideoCardSkeleton } from './Card'
import { InfiniteScrollDetector } from '../InfiniteScrollDetector'
import { forwardRef } from 'react'
import { ItemGrid, type ItemGridProps } from '../ItemGrid'

type VideoGridProps = ItemGridProps & {
  loading?: boolean
  loadingSkeletonCount?: number
  videos: (std.Video | std.Shelf)[]
  getNext?: () => void
}
export const VideoGrid: FC<VideoGridProps> = forwardRef(
  ({ loading = false, loadingSkeletonCount = 32, videos, getNext, size, ...props }, ref) => {
    return (
      <ItemGrid size={size} {...props} ref={ref}>
        {videos
          .filter((shelfOrVideo): shelfOrVideo is std.Video => 'id' in shelfOrVideo)
          .map((video) => (
            <VideoCard key={video.id} video={video} size={size} />
          ))}
        {loading && Array.from({ length: loadingSkeletonCount }).map((_, i) => <VideoCardSkeleton key={i} />)}
        <InfiniteScrollDetector onLoad={getNext} />
      </ItemGrid>
    )
  },
)
