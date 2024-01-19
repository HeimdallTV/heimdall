import { PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Row } from 'lese'
import styled from 'styled-components'

import { PlayerContext } from '../context'
import { PlayerInstance } from '../hooks/usePlayer'
import { useBufferedMS, useDurationMS } from '../hooks/use'
import usePoll from '@/hooks/usePoll'

const SeekBarSectionContainer = styled.div<{ $widthPercent: number }>`
  position: relative;
  width: ${_ => _.$widthPercent}%;
  background-color: rgba(255, 255, 255, 0.2);
  height: 3px;
  border-radius: 2px;

  transition: transform 0.2s ease;
  transform: scaleY(1);
  &:hover {
    transform: scaleY(2);
  }
`

const SeekBarSectionPadding = styled.div`
  position: absolute;
  bottom: -4px;
  height: 20px;
  left: 0;
  right: 0;
`

const SeekBarSection: React.FC<PropsWithChildren<{ widthPercent: number }>> = ({
  widthPercent,
  children,
}) => (
  <SeekBarSectionContainer $widthPercent={widthPercent}>
    <SeekBarSectionPadding />
    {children}
  </SeekBarSectionContainer>
)

const SeekBarOverlay = styled.div<{ $cssVar: string; $color: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: calc(100% - var(--${_ => _.$cssVar}-override, var(--${_ => _.$cssVar})));
  background-color: ${_ => _.$color};
`

const SeekBarThumbStyled = styled.div`
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transform: translate(50%, -50%) scale(0);
  transition: transform 0.1s ease;
  background-color: var(--mantine-primary-color-filled);
  pointer-events: none;
`

const SeekBarThumb: React.FC = () => (
  <SeekBarThumbStyled style={{ right: `calc(100% - var(--current-time-override, var(--current-time)))` }} />
)

const SeekBarContainer = styled(Row)`
  position: relative;
  cursor: pointer;
  &:hover ${SeekBarThumbStyled} {
    transform: translate(50%, -50%) scale(1);
  }
  > * + * {
    margin-left: 2px;
  }
`

const useMove = (onUp: (value: number) => void) => {
  const [elem, setElem] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!elem) return

    const calculateValue = (x: number) => {
      const { left, width } = elem.getBoundingClientRect()
      return ((x - left) / width) * 100
    }

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      elem.style.setProperty('--current-time-override', `${calculateValue(e.clientX)}%`)
    }

    const onMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove, true)
      onUp(calculateValue(e.clientX))
      // fixme: sweet mother of god. @aaditya told me to
      setTimeout(() => elem!.style.removeProperty('--current-time-override'), 100)
    }

    const onMouseDown = (e: MouseEvent) => {
      window.addEventListener('mousemove', onMouseMove, true)
      elem.addEventListener('mouseup', onMouseUp)
      elem.style.setProperty('--current-time-override', `${calculateValue(e.clientX)}%`)
    }
    elem.addEventListener('mousedown', onMouseDown)

    return () => {
      elem.removeEventListener('mouseup', onMouseUp)
      elem.removeEventListener('mousedown', onMouseDown)
    }
  }, [elem, onUp])

  return (elem: HTMLDivElement) => setElem(elem)
}

/** Polls as infrequntly as possible, while still getting pixel perfect (or close to) updates */
const usePlayerTimingsMS = (playerContext: PlayerInstance, minDelay = 16) => {
  const { durationMS } = useDurationMS(playerContext)
  const [currentTimeMS, setCurrentTimeMS] = useState(playerContext.getCurrentTimeMS())
  const [bufferedMS, setBufferedMS] = useState(playerContext.getBufferedMS())

  usePoll(() => {
    setCurrentTimeMS(playerContext.getCurrentTimeMS())
    setBufferedMS(playerContext.getBufferedMS())

    // Calculate delay until the next pixel would be updated
    // assuming the video is fullscreen for simplicity
    const msPerPixel = durationMS / window.innerWidth
    return Math.max(minDelay, msPerPixel)
  }, [playerContext, minDelay, durationMS])

  return { currentTimeMS, bufferedMS, durationMS }
}

export const SeekBar: React.FC = () => {
  const playerContext = useContext(PlayerContext)
  const { currentTimeMS, durationMS, bufferedMS } = usePlayerTimingsMS(playerContext!)

  const onMoveCallback = useCallback(
    (percent: number) => playerContext!.seek((percent / 100) * playerContext!.getDurationMS()),
    [playerContext],
  )
  const ref = useMove(onMoveCallback)

  return (
    <SeekBarContainer
      ref={ref}
      style={{
        // @ts-expect-error styled-components bug
        '--current-time': `${(currentTimeMS / durationMS) * 100}%`,
        '--buffered': `${((currentTimeMS + bufferedMS) / durationMS) * 100}%`,
      }}
    >
      <SeekBarSection widthPercent={100}>
        <SeekBarOverlay $cssVar="buffered" $color="rgba(255, 255, 255, 0.2)" />
        <SeekBarOverlay $cssVar="current-time" $color="var(--mantine-primary-color-filled)" />
      </SeekBarSection>
      <SeekBarThumb />
    </SeekBarContainer>
  )
}
