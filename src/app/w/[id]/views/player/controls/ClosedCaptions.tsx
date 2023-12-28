import { useContext } from 'react'

import styled from 'styled-components'

import { IconBadgeCc } from '@tabler/icons-react'

import { PlayerContext } from '../context'
import { useClosedCaptions } from '../hooks/use'
import { ControlButton } from '../components/ControlButton'

const ClosedCaptionButton = styled(ControlButton)<{ $enabled: boolean }>`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: ${props => (props.$enabled ? '6px' : '50%')};
    right: ${props => (props.$enabled ? '6px' : '50%')};
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
  // todo: Handle no captions available, probably just hide this button?
  // todo: Allow the user to select the captions rather than choosing the default/first one
  // probably just a popup when hovering?
  return (
    <ClosedCaptionButton
      // @ts-expect-error styled-components bug
      $enabled={closedCaptions !== undefined}
      onClick={() =>
        setClosedCaptions(
          closedCaptions === undefined
            ? allClosedCaptions.find(cc => cc.isDefault) ?? allClosedCaptions[0]
            : undefined,
        )
      }
    >
      <IconBadgeCc />
    </ClosedCaptionButton>
  )
}
