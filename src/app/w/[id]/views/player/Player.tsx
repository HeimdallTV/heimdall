import React, { memo, RefObject, useContext, useEffect, useRef } from 'react'

import { Column, Flex, Row } from 'lese'
import styled from 'styled-components'

import {
  IconChevronsLeft,
  IconChevronsRight,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
} from '@tabler/icons-react'
import * as std from '@std'

import { ClosedCaptions } from './ClosedCaptions'
import { PlayerContext } from './context'
import { ClosedCaption } from './controls/ClosedCaptions'
import { Duration } from './controls/Duration'
import { EndsAt } from './controls/EndsAt'
import { FullscreenButton, useIsFullscreen } from './controls/FullscreenButton'
import { PlaybackRate } from './controls/PlaybackRate'
import { PlayButton } from './controls/PlayButton'
import { Quality } from './controls/Quality'
import { Volume } from './controls/Volume'
import { usePlayerInstance } from './hooks/usePlayer'
import { useVideoInstance } from './hooks/useVideo'

// import { SeekBar } from './controls/SeekBar'

const ControlsContainer = styled(Column)`
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6) 80%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
`

const Controls: React.FC<{ playerRoot: RefObject<HTMLElement> }> = ({ playerRoot }) => {
  return (
    <ControlsContainer separation="8px">
      {/* <SeekBar /> */}
      <Row xAlign="space-between">
        <Flex separation="20px" yAlign>
          <IconPlayerSkipBack size={24} />
          <IconChevronsLeft size={24} />
          <PlayButton />
          <IconChevronsRight size={24} />
          <IconPlayerSkipForward size={24} />
          <Duration />
        </Flex>
        <Flex separation="20px" yAlign>
          <EndsAt />
          <ClosedCaption />
          <Volume />
          <PlaybackRate />
          <Quality />
          <FullscreenButton playerRoot={playerRoot} />
        </Flex>
      </Row>
    </ControlsContainer>
  )
}

const PlayerContainer = styled.div<{ isFullscreen: boolean }>`
  position: relative;

  video {
    width: 100%;
    height: 100%;
    max-height: ${({ isFullscreen }) => (isFullscreen ? '100vh' : '87vh')};
    background-color: var(--bg-200);
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

  return <div ref={videoContainerRef}></div>
})
Video.displayName = 'Video'

export const Player: React.FC<{ player: std.Player }> = ({ player }) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstance = usePlayerInstance(player)
  const isFullscreen = useIsFullscreen()

  return (
    <PlayerContext.Provider value={playerInstance}>
      <PlayerContainer ref={playerRef} isFullscreen={isFullscreen}>
        <Video />
        <Controls key="controls" playerRoot={playerRef} />
        <ClosedCaptions />
      </PlayerContainer>
    </PlayerContext.Provider>
  )
}
