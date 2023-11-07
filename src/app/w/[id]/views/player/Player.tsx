import React, { memo, RefObject, useContext, useEffect, useRef } from 'react'

import { Column, FlexProps, Row } from 'lese'
import styled from 'styled-components'

import {
  IconChevronsLeft,
  IconChevronsRight,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
} from '@tabler/icons-react'
import { Skeleton } from '@mantine/core'
import * as std from '@std'
import { PlayerContext } from './context'
import { useVideoInstance } from './hooks/useVideo'

import { ClosedCaptions } from './ClosedCaptions'
import { ClosedCaption } from './controls/ClosedCaptions'
import { Duration } from './controls/Duration'
import { EndsAt } from './controls/EndsAt'
import { FullscreenButton, useIsFullscreen } from './controls/FullscreenButton'
import { PlaybackRate } from './controls/PlaybackRate'
import { PlayButton } from './controls/PlayButton'
import { Quality } from './controls/Quality'
import { Volume } from './controls/Volume'
import { PlayerState, usePlayerInstance } from './hooks/usePlayer'
import { SeekBar } from './controls/SeekBar'
import { useHover, useIdle } from '@mantine/hooks'
import { usePlayerState } from './hooks/use'

const ControlsContainer = styled(Column)<{ show: boolean } & FlexProps>`
  background: linear-gradient(transparent 20%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.8) 100%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.8rem;
  padding-top: 1.2rem;

  transition: 0.2s opacity;
  opacity: ${({ show }) => String(Number(show))};

  > ${Row} > ${Row} > span {
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }

  > ${Row} > ${Row} > button > svg,
  > ${Row} > ${Row} > svg {
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
  }
`

// todo: use a grid?
const Controls: React.FC<{ playerRoot: RefObject<HTMLElement>; mouseActive: boolean }> = ({
  playerRoot,
  mouseActive,
}) => {
  const playerInstance = useContext(PlayerContext)
  const { state: playerState } = usePlayerState(playerInstance!)
  const { hovered, ref: controlsRef } = useHover<HTMLDivElement>()
  const show = playerState !== PlayerState.Playing || hovered || mouseActive

  return (
    <ControlsContainer ref={controlsRef} show={show} onClick={e => e.stopPropagation()} separation="8px">
      <SeekBar />
      <Row xAlign="space-between">
        <Row separation="20px" yAlign>
          <IconPlayerSkipBack size={24} />
          <IconChevronsLeft size={24} />
          <PlayButton />
          <IconChevronsRight size={24} />
          <IconPlayerSkipForward size={24} />
          <Duration />
        </Row>
        <Row separation="20px" yAlign>
          <EndsAt />
          <ClosedCaption />
          <Volume />
          <PlaybackRate />
          <Quality />
          <FullscreenButton playerRoot={playerRoot} />
        </Row>
      </Row>
    </ControlsContainer>
  )
}

const PlayerContainer = styled.div<{ isFullscreen: boolean; hideMouse: boolean }>`
  position: relative;
  ${({ hideMouse }) => hideMouse && `cursor: none;`}

  video {
    width: 100%;
    height: 100%;
    max-height: ${({ isFullscreen }) => (isFullscreen ? '100vh' : '87vh')};
    background-color: black;
  }
`

const Video: React.FC = memo(() => {
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

  return <Row ref={videoContainerRef}></Row>
})
Video.displayName = 'Video'

export const Player: React.FC<{ player?: std.Player }> = ({ player }) => {
  if (!player) return <PlayerSkeleton />
  return <PlayerUI player={player} />
}

const PlayerSkeleton: React.FC = () => (
  <div style={{ aspectRatio: '16 / 9' }}>
    <Skeleton height="100%" width="100%" style={{ aspectRatio: '16 / 9' }} />
  </div>
)

const PlayerUI: React.FC<{ player: std.Player }> = ({ player }) => {
  const playerInstance = usePlayerInstance(player)
  const { state: playerState, togglePlay } = usePlayerState(playerInstance!)
  const isFullscreen = useIsFullscreen()

  const idle = useIdle(1000, { events: ['mousemove'] })
  const { hovered, ref: playerRef } = useHover<HTMLDivElement>()

  useEffect(() => {
    if (!idle || !hovered) return
  }, [idle, hovered])

  return (
    <PlayerContext.Provider value={playerInstance}>
      <PlayerContainer
        ref={playerRef}
        hideMouse={idle && hovered}
        isFullscreen={isFullscreen}
        onClick={() => togglePlay(playerState)}
      >
        <Video />
        <Controls key="controls" mouseActive={hovered && !idle} playerRoot={playerRef} />
        <ClosedCaptions />
      </PlayerContainer>
    </PlayerContext.Provider>
  )
}
