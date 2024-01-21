import { IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-react'
import { useContext } from 'react'
import { PlayerContext } from '../context'
import { usePlayerState } from '../hooks/use'
import { PlayerState } from '../hooks/usePlayerInstance'
import { ControlButton } from '../components/ControlButton'

export const PlayButton: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { state, togglePlay } = usePlayerState(playerInstance!)
  const Icon = state === PlayerState.Playing ? IconPlayerPauseFilled : IconPlayerPlayFilled
  return (
    <ControlButton onClick={() => togglePlay(state)}>
      <Icon />
    </ControlButton>
  )
}
