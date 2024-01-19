import React, { memo, useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Row } from 'lese'
import { Skeleton } from '@mantine/core'
import { PlayerContext } from './context'
import { ClosedCaptions } from './ClosedCaptions'
import { Controls } from './Controls'

import { useVideoInstance } from './hooks/useVideo'
import { toggleFullscreen, useIsFullscreen } from './controls/FullscreenButton'
import { useHover, useIdle } from '@mantine/hooks'
import { usePlayerState } from './hooks/use'
import useDoubleClick from '@/hooks/useDoubleClick'

export const Player: FC = () => {
  const playerInstance = useContext(PlayerContext)
  if (!playerInstance?.player) return <PlayerSkeleton />
  return <PlayerUI />
}

const PlayerSkeleton: FC = () => (
  <div style={{ aspectRatio: '16 / 9' }}>
    <Skeleton height="100%" width="100%" style={{ aspectRatio: '16 / 9', maxHeight: '87vh' }} />
  </div>
)

const PlayerContainer = styled.div<{ $isFullscreen: boolean; $hideMouse: boolean }>`
  position: relative;
  ${({ $hideMouse }) => $hideMouse && `cursor: none;`}

  video {
    width: 100%;
    height: 100%;
    max-height: ${({ $isFullscreen }) => ($isFullscreen ? '100vh' : '87vh')};
    background-color: black;
  }
`

const PlayerUI: FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { state: playerState, togglePlay } = usePlayerState(playerInstance!)
  const isFullscreen = useIsFullscreen()

  const idle = useIdle(1000, { events: ['mousemove'] })
  const { hovered, ref: playerRef } = useHover<HTMLDivElement>()

  return (
    <PlayerContainer
      ref={playerRef}
      $hideMouse={idle && hovered}
      $isFullscreen={isFullscreen}
      onClick={useDoubleClick({
        onEagerSingleClick: () => togglePlay(playerState),
        onDoubleClick: triggeredEager => {
          toggleFullscreen(playerRef.current!)
          if (triggeredEager) togglePlay(playerState)
        },
      })}
    >
      <Video />
      <Controls key="controls" mouseActive={hovered && !idle} playerRoot={playerRef} />
      <ClosedCaptions />
    </PlayerContainer>
  )
}

const Video: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoInstance = useVideoInstance(playerInstance!)

  useEffect(() => {
    const videoContainer = videoContainerRef.current
    if (!videoContainer) return
    videoContainer.appendChild(videoInstance)
    return () => {
      videoContainer.removeChild(videoInstance)
    }
  }, [videoInstance])

  return <Row style={{ height: '100%' }} ref={videoContainerRef} />
}
