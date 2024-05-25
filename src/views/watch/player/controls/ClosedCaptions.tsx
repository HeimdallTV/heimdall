import { useContext } from 'react'

import styled from 'styled-components'

import { IconBadgeCc, IconBadgeCcFilled } from '@tabler/icons-react'

import { PlayerContext } from '../context'
import { useClosedCaptions } from '../hooks/use'
import { ControlButton } from '../components/ControlButton'

const ClosedCaptionButton = styled(ControlButton)<{ $enabled: boolean }>`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: ${(props) => (props.$enabled ? '6px' : '50%')};
    right: ${(props) => (props.$enabled ? '6px' : '50%')};
    height: 3px;
    border-radius: 2px;
    background-color: var(--mantine-primary-color-filled);

    transition:
      left 0.2s ease,
      right 0.2s ease;
  }
`

export const ClosedCaption: React.FC = () => {
  const playerContext = useContext(PlayerContext)
  const { closedCaptions, allClosedCaptions, setClosedCaptions } = useClosedCaptions(playerContext!)
  const enabled = closedCaptions !== undefined
  // todo: Handle no captions available, probably just hide this button?
  // todo: Allow the user to select the captions rather than choosing the default/first one
  // probably just a popup when hovering?
  return (
    <ClosedCaptionButton
      $enabled={enabled}
      onClick={() =>
        setClosedCaptions(
          enabled ? undefined : allClosedCaptions.find((cc) => cc.isDefault) ?? allClosedCaptions[0],
        )
      }
    >
      <IconBadgeCc
        style={{
          opacity: Number(!enabled),
          transition: '0.2s ease',
        }}
      />
      <IconBadgeCcFilled
        style={{
          opacity: Number(enabled),
          transition: '0.2s ease',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </ClosedCaptionButton>
  )
}
