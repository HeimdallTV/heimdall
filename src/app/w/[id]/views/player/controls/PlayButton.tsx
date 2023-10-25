import { IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-react'
import { useContext } from 'react'
import { PlayerContext } from '../context'
import { usePlayerState } from '../hooks/use'
import { PlayerState } from '../hooks/usePlayer'
import { Button } from '../components/Button'

export const PlayButton: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { state, togglePlay } = usePlayerState(playerInstance!)
  const Icon = state === PlayerState.Playing ? IconPlayerPlayFilled : IconPlayerPauseFilled
  return (
    <Button onClick={() => togglePlay(state)}>
      <Icon />
    </Button>
  )
}
