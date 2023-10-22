import { PlayArrowRounded, PauseRounded } from '@mui/icons-material'
import { useContext } from 'react'
import { PlayerContext } from '../context'
import { usePlayerState } from '../hooks/use'
import { PlayerState } from '../hooks/usePlayer'
import { Button } from '../components/Button'

export const PlayButton: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { state, togglePlay } = usePlayerState(playerInstance!)
  const Icon = state === PlayerState.Playing ? PauseRounded : PlayArrowRounded
  return (
    <Button onClick={() => togglePlay(state)}>
      <Icon />
    </Button>
  )
}
