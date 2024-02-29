import * as std from '@std'
import { VideoCard, VideoCardSkeleton } from './Card'
import { InfiniteScrollDetector } from '../InfiniteScrollDetector'
import { forwardRef } from 'react'
import { ItemGrid, ItemGridProps } from '../ItemGrid'

type VideoGridProps = ItemGridProps & {
  loading?: boolean
  loadingSkeletonCount?: number
  videos: (std.Video | std.Shelf)[]
  getNext?: () => void
}
export const VideoGrid: FC<VideoGridProps> = forwardRef(
  ({ loading = false, loadingSkeletonCount = 32, videos, getNext, ...props }, ref) => {
    return (
      <ItemGrid {...props} ref={ref}>
        {videos
          .filter((shelfOrVideo): shelfOrVideo is std.Video => 'id' in shelfOrVideo)
          .map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        {loading && Array.from({ length: loadingSkeletonCount }).map((_, i) => <VideoCardSkeleton key={i} />)}
        <InfiniteScrollDetector onLoad={getNext} />
      </ItemGrid>
    )
  },
)
