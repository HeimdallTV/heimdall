import { PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { styled } from '@linaria/react'

import { PlayerContext } from '../context'
import { useBufferedMS, useCurrentTimeMS, useDurationMS } from '../hooks/use'

const SeekBarSectionContainer = styled.div<{ widthPercent: number }>`
  position: relative;
  width: ${_ => _.widthPercent}%;
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
  <SeekBarSectionContainer widthPercent={widthPercent}>
    <SeekBarSectionPadding />
    {children}
  </SeekBarSectionContainer>
)

const SeekBarOverlay = styled.div<{ cssVar: string; color: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: calc(100% - var(--${_ => _.cssVar}-override, var(--${_ => _.cssVar})));
  background-color: ${_ => _.color};
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

const SeekBarContainer = styled.div`
  display: flex;
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
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const calculateValue = (x: number) => {
      if (!ref.current) return 0
      const { left, width } = ref.current.getBoundingClientRect()
      return ((x - left) / width) * 100
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      e.preventDefault()
      e.stopPropagation()
      ref.current.style.setProperty('--current-time-override', `${calculateValue(e.clientX)}%`)
    }

    const onMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove, true)
      if (!ref.current) return
      onUp(calculateValue(e.clientX))
      // fixme: sweet mother of god. @aaditya told me to
      setTimeout(() => ref.current!.style.removeProperty('--current-time-override'), 100)
    }

    const onMouseDown = (e: MouseEvent) => {
      if (!ref.current) return
      window.addEventListener('mousemove', onMouseMove, true)
      ref.current.addEventListener('mouseup', onMouseUp)
      ref.current.style.setProperty('--current-time-override', `${calculateValue(e.clientX)}%`)
    }
    ref.current!.addEventListener('mousedown', onMouseDown)

    return () => {
      ref.current?.removeEventListener('mouseup', onMouseUp)
      ref.current?.removeEventListener('mousedown', onMouseDown)
    }
  }, [ref.current, onUp])

  return ref
}

export const SeekBar: React.FC = () => {
  const playerContext = useContext(PlayerContext)
  const { currentTimeMS } = useCurrentTimeMS(playerContext!)
  const { durationMS } = useDurationMS(playerContext!)
  const { bufferedMS } = useBufferedMS(playerContext!)

  const onMoveCallback = useCallback(
    (percent: number) => playerContext!.seek((percent / 100) * playerContext!.getDurationMS()),
    [playerContext],
  )
  const ref = useMove(onMoveCallback)

  return (
    <SeekBarContainer
      ref={ref}
      style={{
        // @ts-expect-error fixme: can't pass css variables through here for some reason
        '--current-time': `${(currentTimeMS / durationMS) * 100}%`,
        '--buffered': `${((currentTimeMS + bufferedMS) / durationMS) * 100}%`,
      }}
    >
      <SeekBarSection widthPercent={100}>
        <SeekBarOverlay cssVar="buffered" color="rgba(255, 255, 255, 0.2)" />
        <SeekBarOverlay cssVar="current-time" color="var(--mantine-primary-color-filled)" />
      </SeekBarSection>
      <SeekBarThumb />
    </SeekBarContainer>
  )
}
