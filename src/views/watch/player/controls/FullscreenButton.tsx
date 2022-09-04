import { FullscreenRounded, FullscreenExitRounded } from '@mui/icons-material'
import { useState, useEffect, RefObject, useCallback } from 'react'
import { Button } from '../components/Button'

export const useIsFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(document.fullscreenElement !== null)
  useEffect(() => {
    const listener = () => setIsFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', listener)
    return () => document.removeEventListener('fullscreenchange', listener)
  }, [])
  return isFullscreen
}

export const FullscreenButton: FC<{ playerRoot: RefObject<HTMLElement> }> = ({ playerRoot }) => {
  const isFullscreen = useIsFullscreen()
  const Icon = isFullscreen ? FullscreenExitRounded : FullscreenRounded
  const toggleFullscreen = useCallback(
    () => (isFullscreen ? document.exitFullscreen() : playerRoot.current?.requestFullscreen()),
    [isFullscreen],
  )
  return (
    <Button onClick={toggleFullscreen}>
      <Icon />
    </Button>
  )
}
