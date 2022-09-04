import styled from '@emotion/styled'
import { FC, RefObject, memo, useContext, useEffect, useRef } from 'react'
import * as std from '@std'
import { PlayerInstance, usePlayerInstance } from './hooks/usePlayer'
import { PlayerContext } from './context'
import {
  ClosedCaptionRounded,
  SkipNextRounded,
  SkipPreviousRounded,
  KeyboardDoubleArrowRightRounded,
  KeyboardDoubleArrowLeftRounded,
} from '@mui/icons-material'
import { Column, Flex, Row } from 'lese'
import { PlayButton } from './controls/PlayButton'
import { useVideoInstance } from './hooks/useVideo'
import { Duration } from './controls/Duration'
import { EndsAt } from './controls/EndsAt'
import { FullscreenButton, useIsFullscreen } from './controls/FullscreenButton'
import { Volume } from './controls/Volume'
import { PlaybackRate } from './controls/PlaybackRate'
import { Quality } from './controls/Quality'
import { ClosedCaption } from './controls/ClosedCaptions'
import { ClosedCaptions } from './ClosedCaptions'
// import { SeekBar } from './controls/SeekBar'

const ControlsContainer = styled(Column)`
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6) 80%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
`

const Controls: FC<{ playerRoot: RefObject<HTMLElement> }> = ({ playerRoot }) => {
  return (
    <ControlsContainer separation="8px">
      {/* <SeekBar /> */}
      <Row xAlign="space-between">
        <Flex separation="20px" yAlign>
          <SkipPreviousRounded sx={{ fontSize: 24 }} />
          <KeyboardDoubleArrowLeftRounded sx={{ fontSize: 24 }} />
          <PlayButton />
          <KeyboardDoubleArrowRightRounded sx={{ fontSize: 24 }} />
          <SkipNextRounded sx={{ fontSize: 24 }} />
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

const Video: FC = memo(() => {
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
  }, [videoContainerRef.current, videoInstance])

  return <div ref={videoContainerRef}></div>
})

export const Player: FC<{ player: std.Player }> = ({ player }) => {
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
