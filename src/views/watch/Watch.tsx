import styled from 'styled-components'
import { useEffect } from 'react'

import { useAsync } from '@/hooks/useAsync'
import { getPlayer as fetchPlayer, getVideo as fetchVideo } from '@yt/video'
import { Player } from './player/Player'
import { WatchInfo } from './WatchInfo'
import { PlayerContext } from './player/context'
import { usePlayerInstance } from './player/hooks/usePlayerInstance'
import { useSearch } from 'wouter'

const WatchContainer = styled.main`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: 16px;
  }
`

const getStartTimeFromQuery = (query: URLSearchParams) => {
  if (!query.has('t')) return undefined
  const startTimeSecondsQuery = parseInt(query.get('t') ?? '')
  if (Number.isNaN(startTimeSecondsQuery)) return undefined
  return startTimeSecondsQuery * 1000
}

export default function Watch({ params: { videoId } }: { params: { videoId: string } }) {
  const query = new URLSearchParams(useSearch())
  const { data: video, error: videoError } = useAsync(() => fetchVideo(videoId), [videoId])
  const { data: player, error: playerError } = useAsync(() => fetchPlayer(videoId), [videoId])
  const playerInstance = usePlayerInstance(player, {
    startTimeMS: getStartTimeFromQuery(query),
  })
  useEffect(() => {
    if (videoError) console.error(videoError)
    if (playerError) console.error(playerError)
  }, [videoError, playerError])
  return (
    <PlayerContext.Provider value={playerInstance}>
      <WatchContainer>
        <Player />
        <WatchInfo video={video} />
      </WatchContainer>
    </PlayerContext.Provider>
  )
}
