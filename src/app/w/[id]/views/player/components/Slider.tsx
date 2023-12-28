import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import styled from 'styled-components'

function throttleAndDebounce(fn: (...args: any[]) => void, delay: number): (...args: any[]) => void {
  let lastCallTime: number | null = null
  let timeoutId: NodeJS.Timeout | null = null

  return function debouncedThrottledFn(...args: any[]): void {
    const currentTime = Date.now()

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    // Execute the function if it hasn't been called recently
    if (lastCallTime === null || currentTime - lastCallTime >= delay) {
      fn(...args)
      lastCallTime = currentTime
    } else {
      // Schedule the function call after the debounce delay
      timeoutId = setTimeout(() => {
        fn(...args)
        lastCallTime = Date.now()
        timeoutId = null
      }, delay)
    }
  }
}

type SliderProps = {
  $barColor: string
  $handleColor: string
  $orientation: 'horizontal' | 'vertical'
  $length: string
  /** Number between 0 and 1 */
  $value: number
}

const SliderTrack = styled.div<Pick<SliderProps, '$barColor' | '$orientation' | '$length'>>`
  position: relative;
  width: ${({ $orientation, $length }) => ($orientation === 'horizontal' ? $length : '4px')};
  height: ${({ $orientation, $length }) => ($orientation === 'horizontal' ? '4px' : $length)};
  background-color: ${({ $barColor }) => $barColor};
  border-radius: 2px;
`

const SliderHandle = styled.div<Pick<SliderProps, '$handleColor' | '$orientation' | '$value'>>`
  position: absolute;
  bottom: ${({ $orientation, $value }) => ($orientation === 'horizontal' ? '50%' : `${$value * 100}%`)};
  left: ${({ $orientation, $value }) => ($orientation === 'horizontal' ? `${$value * 100}%` : '50%')};
  transform: translate(-50%, 50%);

  width: 16px;
  height: 16px;
  background-color: ${({ $handleColor }) => $handleColor};
  border-radius: 50%;
`

const SliderContainer = styled.div<Pick<SliderProps, '$orientation'>>`
  position: relative;
  padding: 16px;
  cursor: pointer;
`

export const Slider: React.FC<{
  barColor: string
  handleColor: string
  orientation: 'horizontal' | 'vertical'
  length: string
  /** Number between 0 and 1 */
  value: number
  onChange: (value: number) => void
}> = ({ barColor, handleColor, orientation, length, value, onChange }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragValue, setDragValue] = useState(value)
  const throttledOnChange = useMemo(() => throttleAndDebounce(onChange, 100), [onChange])

  useEffect(() => {
    if (!isDragging) setDragValue(value)
  }, [isDragging, value])

  const calculateDragValue = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const trackElem = trackRef.current!
      const trackRect = trackElem.getBoundingClientRect()
      const value =
        orientation === 'horizontal'
          ? (e.clientX - trackRect.left) / trackRect.width
          : (trackRect.bottom - e.clientY) / trackRect.height
      return Math.max(0, Math.min(1, value))
    },
    [trackRef, orientation],
  )

  useEffect(() => {
    if (!isDragging) return
    const listener = (e: MouseEvent) => {
      e.preventDefault()
      setDragValue(calculateDragValue(e))
      throttledOnChange(calculateDragValue(e))
    }
    document.addEventListener('mousemove', listener)
    return () => document.removeEventListener('mousemove', listener)
  }, [isDragging, dragStart, calculateDragValue, throttledOnChange])

  useEffect(() => {
    if (!isDragging) return
    const listener = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(false)
      throttledOnChange(calculateDragValue(e))
    }
    document.addEventListener('mouseup', listener)
    return () => document.removeEventListener('mouseup', listener)
  }, [dragValue, isDragging, calculateDragValue, throttledOnChange])

  return (
    <SliderContainer
      className="slider"
      $orientation={orientation}
      onMouseDown={e => {
        setIsDragging(true)
        setDragStart(orientation === 'horizontal' ? e.clientX : e.clientY)
        setDragValue(calculateDragValue(e))
        throttledOnChange(calculateDragValue(e))
      }}
    >
      <SliderTrack ref={trackRef} $barColor={barColor} $orientation={orientation} $length={length}>
        <SliderHandle $handleColor={handleColor} $orientation={orientation} $value={dragValue} />
      </SliderTrack>
    </SliderContainer>
  )
}

export const FloatingSliderContainer = styled.div`
  position: relative;

  .slider {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  &:hover .slider {
    display: block;
  }
`
