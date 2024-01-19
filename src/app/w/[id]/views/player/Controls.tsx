import React, { RefObject, useContext } from 'react'

import { Column, FlexProps, Row } from 'lese'
import styled from 'styled-components'

import {
  IconChevronsLeft,
  IconChevronsRight,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
} from '@tabler/icons-react'
import { PlayerContext } from './context'

import { ClosedCaption } from './controls/ClosedCaptions'
import { Duration } from './controls/Duration'
import { EndsAt } from './controls/EndsAt'
import { FullscreenButton } from './controls/FullscreenButton'
import { PlaybackRate } from './controls/PlaybackRate'
import { PlayButton } from './controls/PlayButton'
import { Quality } from './controls/Quality'
import { Volume } from './controls/Volume'
import { PlayerState } from './hooks/usePlayer'
import { SeekBar } from './controls/SeekBar'
import { useHover } from '@mantine/hooks'
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
export const Controls: React.FC<{ playerRoot: RefObject<HTMLElement>; mouseActive: boolean }> = ({
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
