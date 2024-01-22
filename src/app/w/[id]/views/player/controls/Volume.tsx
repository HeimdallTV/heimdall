import { useCallback, useContext } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react'

import { ControlButton } from '../components/ControlButton'
import { PlayerContext } from '../context'
import { useVolume } from '../hooks/use'
import { Slider } from '@mantine/core'
import styled from 'styled-components'
import { useHotkeys } from '@mantine/hooks'

// fixme: disappears when dragging the slider and moving off the element
const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 32px;
  overflow: hidden;
  transition: width 0.2s ease-in-out;

  &:hover {
    width: 126px;
  }
`

export const Volume: React.FC = () => {
  const player = useContext(PlayerContext)!
  const { volumeLog: volume, setVolumeLog: setVolume } = useVolume(player)
  const Icon = volume > 0.5 ? IconVolume : volume > 0 ? IconVolume2 : IconVolumeOff
  const debouncedNonZeroVolume = useDebounce(volume, 200, value => value === 0)

  // todo: Should pull the default from local storage for when debouncedNonZeroVolume === 0
  const toggleMute = useCallback(
    () => setVolume(volume === 0 ? debouncedNonZeroVolume || 1 : 0),
    [volume, debouncedNonZeroVolume],
  )
  useHotkeys([['m', toggleMute]])

  return (
    <VolumeContainer>
      <ControlButton onClick={toggleMute}>
        <Icon />
      </ControlButton>
      <Slider
        color="var(--mantine-color-text)"
        size="xs"
        thumbSize="12px"
        label={null}
        value={volume * 100}
        onChange={volume => setVolume(volume / 100)}
        style={{ minWidth: '80px' }}
        styles={{
          // min height increases the clickable area
          root: { '--slider-track-bg': 'rgba(255, 255, 255, 0.3)', minHeight: '32px' },
          trackContainer: { minHeight: '32px' },
        }}
      />
    </VolumeContainer>
  )
}
