import { useContext } from 'react'

import { useDebounce } from '@/hooks/useDebounce'
import { IconVolume, IconVolume2, IconVolumeOff } from '@tabler/icons-react'

import { Button } from '../components/Button'
import { FloatingSliderContainer, Slider } from '../components/Slider'
import { PlayerContext } from '../context'
import { useVolume } from '../hooks/use'

export const Volume: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { volume, setVolume } = useVolume(playerInstance!)
  const Icon = volume > 0.5 ? IconVolume : volume > 0 ? IconVolume2 : IconVolumeOff
  const debouncedNonZeroVolume = useDebounce(volume, 200, value => value === 0)
  return (
    <FloatingSliderContainer>
      <Button
        // TODO Should pull the default from local storage for when debouncedNonZeroVolume === 0
        onClick={() =>
          setVolume(volume === 0 ? (debouncedNonZeroVolume === 0 ? 1 : debouncedNonZeroVolume) : 0)
        }
      >
        <Icon />
      </Button>
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
