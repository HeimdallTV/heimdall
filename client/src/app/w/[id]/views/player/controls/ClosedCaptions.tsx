import { useContext } from 'react';

import styled from 'styled-components';

import { ClosedCaptionRounded } from '@mui/icons-material';

import { Button } from '../components/Button';
import { PlayerContext } from '../context';
import { useClosedCaptions } from '../hooks/use';

const ClosedCaptionButton = styled(Button)<{ enabled: boolean }>`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: ${props => (props.enabled ? '6px' : '50%')};
    right: ${props => (props.enabled ? '6px' : '50%')};
    height: 3px;
    border-radius: 2px;
    background-color: var(--red);

    transition: left 0.2s ease, right 0.2s ease;
  }
`

export const ClosedCaption: React.FC = () => {
  const playerContext = useContext(PlayerContext)
  const { closedCaptions, allClosedCaptions, setClosedCaptions } = useClosedCaptions(playerContext!)
  // TODO Handle no captions available, probably just hide this button?
  // TODO Allow the user to select the captions rather than choosing the default/first one
  return (
    <ClosedCaptionButton
      enabled={closedCaptions !== undefined}
      onClick={() =>
        setClosedCaptions(
          closedCaptions === undefined
            ? allClosedCaptions.find(cc => cc.isDefault) ?? allClosedCaptions[0]
            : undefined,
        )
      }
    >
      <ClosedCaptionRounded />
    </ClosedCaptionButton>
  )
}
