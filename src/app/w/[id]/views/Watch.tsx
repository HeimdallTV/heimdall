'use client'

import styled from 'styled-components'
import { useEffect } from 'react'

import { useAsync } from '@/hooks/useAsync'
import { getPlayer as fetchPlayer, getVideo as fetchVideo } from '@yt/video'
import { Player } from './player/Player'
import { WatchInfo } from './WatchInfo'
import { PlayerContext } from './player/context'
import { usePlayerInstance } from './player/hooks/usePlayer'

const VideoContainer = styled('section')`
  > * + * {
    margin-top: 16px;
  }
`

const Watch: React.FC<{ videoId: string }> = ({ videoId }) => {
  const { data: video, error: videoError } = useAsync(() => fetchVideo(videoId), [videoId])
  const { data: player, error: playerError } = useAsync(() => fetchPlayer(videoId), [videoId])
  const playerInstance = usePlayerInstance(player)
  useEffect(() => {
    if (videoError) console.error(videoError)
    if (playerError) console.error(playerError)
  }, [videoError, playerError])
  return (
    <PlayerContext.Provider value={playerInstance}>
      <VideoContainer>
        <Player player={player} />
        <WatchInfo video={video} />
      </VideoContainer>
    </PlayerContext.Provider>
  )
}

export default Watch
