import yt from '@yt'
import { useCallback, useEffect } from 'react'
import { usePaginated } from '@/hooks/usePaginated'
import { PlaylistGrid } from '@/components/Playlist/Grid'

export default function PlaylistsTab({ channelId }: { channelId: string }) {
  const playlists = usePaginated(useCallback(() => yt.listChannelPlaylists!(channelId), [channelId]))
  useEffect(() => {
    if (playlists.errors.length) {
      console.error(playlists.errors)
    }
  }, [playlists.errors])
  return (
    <PlaylistGrid
      loading={playlists.loading}
      playlists={playlists.data?.flat() ?? []}
      getNext={playlists.next}
    />
  )
}
