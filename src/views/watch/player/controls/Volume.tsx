import { VolumeUpRounded, VolumeDownRounded, VolumeOffRounded } from '@mui/icons-material'
import { useContext } from 'react'
import { PlayerContext } from '../context'
import { useVolume } from '../hooks/use'
import { FloatingSliderContainer, Slider } from '../components/Slider'
import { useDebounce } from 'hooks/useDebounce'
import { Button } from '../components/Button'

export const Volume: FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { volume, setVolume } = useVolume(playerInstance!)
  const Icon = volume > 0.5 ? VolumeUpRounded : volume > 0 ? VolumeDownRounded : VolumeOffRounded
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
