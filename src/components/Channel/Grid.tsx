import type * as std from '@std'
import { ChannelCard, ChannelCardSkeleton } from './Card'
import { InfiniteScrollDetector } from '../InfiniteScrollDetector'
import { forwardRef } from 'react'
import { ItemGrid, type ItemGridProps } from '../ItemGrid'

type ChannelGridProps = ItemGridProps & {
  loading?: boolean
  loadingSkeletonCount?: number
  channels: (std.Channel | std.Shelf)[]
  getNext?: () => void
}
export const ChannelGrid: FC<ChannelGridProps> = forwardRef(
  ({ loading = false, loadingSkeletonCount = 32, channels, getNext, ...props }, ref) => {
    return (
      <ItemGrid {...props} ref={ref}>
        {channels
          .filter((shelfOrVideo): shelfOrVideo is std.Channel => 'id' in shelfOrVideo)
          .map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        {loading &&
          Array.from({ length: loadingSkeletonCount }).map((_, i) => <ChannelCardSkeleton key={i} />)}
        <InfiniteScrollDetector onLoad={getNext} />
      </ItemGrid>
    )
  },
)
