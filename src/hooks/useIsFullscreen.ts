import { useEffect, useState } from 'react'

export const useIsFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(document.fullscreenElement !== null)
  useEffect(() => {
    const listener = () => setIsFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', listener)
    return () => document.removeEventListener('fullscreenchange', listener)
  }, [])
  return { isFullscreen, toggle: toggleFullscreen }
}

export const toggleFullscreen = () =>
  document.fullscreenElement === null
    ? document.documentElement.requestFullscreen()
    : document.exitFullscreen()
