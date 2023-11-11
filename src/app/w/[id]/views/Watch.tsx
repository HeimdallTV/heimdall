'use client'

import styled from 'styled-components'

import { useAsync } from '@/hooks/useAsync'
import { getPlayer as fetchPlayer, getVideo as fetchVideo } from '@yt/video'

import { Player } from './player/Player'
import { WatchInfo } from './WatchInfo'
import { useEffect } from 'react'

const VideoContainer = styled('section')`
  > iframe {
    width: 100vw;
    height: min(87vh, calc(100vw / 16 * 9));
  }

  > * + * {
    margin-top: 16px;
  }
`

const PlayerWrapper: React.FC<{ videoId: string }> = ({ videoId }) => {
  const { data: player, error } = useAsync(() => fetchPlayer(videoId), [videoId])
  useEffect(() => {
    if (error) console.error(error)
  }, [error])

  return <Player player={player} />
}

const Watch: React.FC<{ videoId: string }> = ({ videoId }) => {
  const { data: video, error } = useAsync(() => fetchVideo(videoId), [videoId])
  useEffect(() => {
    if (error) console.error(error)
  }, [error])

  return (
    <VideoContainer>
      <PlayerWrapper videoId={videoId} />
      <WatchInfo video={video} />
    </VideoContainer>
  )
}

export default Watch
