import type * as std from '@std'
import { PlaylistCard, PlaylistCardSkeleton } from './Card'
import { InfiniteScrollDetector } from '../InfiniteScrollDetector'
import { forwardRef } from 'react'
import { ItemGrid, type ItemGridProps } from '../ItemGrid'

type PlaylistGridProps = ItemGridProps & {
  loading?: boolean
  loadingSkeletonCount?: number
  playlists: (std.Playlist | std.Shelf)[]
  getNext?: () => void
}
export const PlaylistGrid: FC<PlaylistGridProps> = forwardRef(
  ({ loading = false, loadingSkeletonCount = 32, playlists, getNext, ...props }, ref) => {
    return (
      <ItemGrid {...props} ref={ref}>
        {playlists
          .filter((shelfOrVideo): shelfOrVideo is std.Playlist => 'id' in shelfOrVideo)
          .map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        {loading &&
          Array.from({ length: loadingSkeletonCount }).map((_, i) => <PlaylistCardSkeleton key={i} />)}
        <InfiniteScrollDetector onLoad={getNext} />
      </ItemGrid>
    )
  },
)
