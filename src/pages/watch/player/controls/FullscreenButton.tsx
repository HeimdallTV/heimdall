import { IconMaximize, IconMinimize } from '@tabler/icons-react'
import { useState, useEffect, RefObject, useCallback } from 'react'
import { ControlButton } from '../components/ControlButton'

export const useIsFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(document.fullscreenElement !== null)
  useEffect(() => {
    const listener = () => setIsFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', listener)
    return () => document.removeEventListener('fullscreenchange', listener)
  }, [])
  return isFullscreen
}

export const FullscreenButton: React.FC<{ playerRoot: RefObject<HTMLElement> }> = ({ playerRoot }) => {
  const isFullscreen = useIsFullscreen()
  const Icon = isFullscreen ? IconMinimize : IconMaximize
  const toggleFullscreen = useCallback(
    () => (isFullscreen ? document.exitFullscreen() : playerRoot.current?.requestFullscreen()),
    [isFullscreen, playerRoot],
  )
  return (
    <ControlButton onClick={toggleFullscreen}>
      <Icon />
    </ControlButton>
  )
}
