import { useEffect, useState } from 'react'

export type MoveCallbackMetadata = { elem: HTMLElement }

export const useMove = (
  onMove: (value: number, metadata: MoveCallbackMetadata) => void,
  onUp: (value: number, metadata: MoveCallbackMetadata) => void,
) => {
  const [elem, setElem] = useState<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!elem) return

    const calculatePercent = (x: number) => {
      const { left, width } = elem.getBoundingClientRect()
      return Math.min(100, Math.max(0, ((x - left) / width) * 100))
    }

    // Event handlers
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      onMove(calculatePercent(e.clientX), { elem })
    }

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
      onUp(calculatePercent(e.clientX), { elem })
    }

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      onMove(calculatePercent(e.clientX), { elem })
    }

    // Event listeners
    elem.addEventListener('mousedown', onMouseDown)
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove, true)
      window.addEventListener('mouseup', onMouseUp, true)
      document.documentElement.addEventListener('mouseleave', onMouseUp)
    }

    return () => {
      elem.removeEventListener('mousedown', onMouseDown)
      if (isDragging) {
        window.removeEventListener('mousemove', onMouseMove, true)
        window.removeEventListener('mouseup', onMouseUp, true)
        document.documentElement.removeEventListener('mouseleave', onMouseUp)
      }
    }
  }, [elem, onMove, onUp, isDragging])

  return (elem: HTMLDivElement) => setElem(elem)
}
