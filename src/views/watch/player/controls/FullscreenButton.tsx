import { IconMaximize, IconMinimize } from '@tabler/icons-react'
import { ControlButton } from '../components/ControlButton'
import { useIsFullscreen } from '@/hooks/useIsFullscreen'

export const FullscreenButton: FC = () => {
  const { isFullscreen, toggle } = useIsFullscreen()
  const Icon = isFullscreen ? IconMinimize : IconMaximize
  return (
    <ControlButton onClick={toggle}>
      <Icon />
    </ControlButton>
  )
}
