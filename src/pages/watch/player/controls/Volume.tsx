import { useContext } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react'

import { ControlButton } from '../components/ControlButton'
import { FloatingSliderContainer, Slider } from '../components/Slider'
import { PlayerContext } from '../context'
import { useVolume } from '../hooks/use'

// todo: replace with the slider from mantine. it doesn't support vertical
// orientation so we'll need to build it ourselves maybe. or just use the
// horizontal one and move other elements out of the way for it
// or permanently have the horizontal slider visible
export const Volume: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { volume, setVolume } = useVolume(playerInstance!)
  const Icon = volume > 0.5 ? IconVolume : volume > 0 ? IconVolume2 : IconVolumeOff
  const debouncedNonZeroVolume = useDebounce(volume, 200, value => value === 0)
  return (
    <FloatingSliderContainer>
      <ControlButton
        // TODO Should pull the default from local storage for when debouncedNonZeroVolume === 0
        onClick={() =>
          setVolume(volume === 0 ? (debouncedNonZeroVolume === 0 ? 1 : debouncedNonZeroVolume) : 0)
        }
      >
        <Icon />
      </ControlButton>
      <Slider
        orientation="vertical"
        barColor="white"
        handleColor="white"
        length="80px"
        value={volume}
        onChange={setVolume}
      />
    </FloatingSliderContainer>
  )
}
