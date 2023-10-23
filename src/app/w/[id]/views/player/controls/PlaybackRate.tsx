import { SpeedRounded } from '@mui/icons-material'
import { useContext, useState } from 'react'
import { PlayerContext } from '../context'
import { usePlaybackRate } from '../hooks/use'
import { Button } from '../components/Button'
import { FloatingMenuContainer, Menu, MenuListItem } from '../components/Menu'
import { not } from 'rambda'

const PLAYBACK_RATES = [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25]

export const PlaybackRate: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const playerInstance = useContext(PlayerContext)
  const { playbackRate, setPlaybackRate } = usePlaybackRate(playerInstance!)

  return (
    <FloatingMenuContainer visible={visible} setVisible={setVisible}>
      <Button onClick={() => setVisible(not)}>
        <SpeedRounded />
      </Button>
      <Menu background="var(--bg-700)">
        {PLAYBACK_RATES.map(rate => (
          <MenuListItem key={rate} onClick={() => setPlaybackRate(rate)} selected={playbackRate === rate}>
            {rate}x
          </MenuListItem>
        ))}
      </Menu>
    </FloatingMenuContainer>
  )
}
