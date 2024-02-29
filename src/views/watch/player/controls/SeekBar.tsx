import { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'
import * as std from '@std'

import { Row } from 'lese'
import styled from 'styled-components'

import { PlayerContext } from '../context'
import { PlayerInstance, PlayerState } from '../hooks/usePlayerInstance'
import { useBufferedRangesMS, useDurationMS, usePlayerState, useSeekMS, useSegments } from '../hooks/use'
import usePoll from '@/hooks/usePoll'
import * as settings from '@/settings'
import { useAtom } from 'jotai'
import { MoveCallbackMetadata, useMove } from '@/hooks/useMove'

const SeekBarSectionContainer = styled.div<{ $widthPercent: number }>`
  position: relative;
  width: ${(_) => _.$widthPercent}%;
  background-color: rgba(255, 255, 255, 0.2);
  height: 3px;
  border-radius: 2px;

  transition: transform 0.2s ease;
  transform: scaleY(1);
  &:hover {
    transform: scaleY(3);
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

const SeekBarOverlay = styled.div<{ $color: string }>`
  background-color: ${(_) => _.$color};
  position: absolute;
  top: 0;
  bottom: 0;
`

const SeekBarOverlayVar = styled.div<{ $cssVar: string; $color: string }>`
  background-color: ${(_) => _.$color};
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--${(_) => _.$cssVar}-start-override, var(--${(_) => _.$cssVar}-start, 0));
  right: calc(100% - var(--${(_) => _.$cssVar}-end-override, var(--${(_) => _.$cssVar}-end)));
`

const SeekBarThumbStyled = styled.div`
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transform: translate(50%, -50%) scale(0);
  transition: transform 0.1s ease;
  background-color: var(--mantine-primary-color-7);
  pointer-events: none;
`

const SeekBarThumb: React.FC = () => (
  <SeekBarThumbStyled
    style={{
      right: 'calc(100% - var(--current-time-end-override, var(--current-time-end)))',
    }}
  />
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

/** Polls as infrequntly as possible, while still getting pixel perfect (or close to) updates */
const usePlayerTimingsMS = (player: PlayerInstance, minDelay = 16) => {
  const { seekMS } = useSeekMS(player)
  const { durationMS } = useDurationMS(player)
  const [currentTimeMS, setCurrentTimeMS] = useState(player.currentTimeMS.get())
  const { state } = usePlayerState(player)

  usePoll(() => {
    setCurrentTimeMS(player.currentTimeMS.get())
    if (state !== PlayerState.Playing) return Infinity

    // Calculate delay until the next pixel would be updated
    // assuming the video is fullscreen for simplicity
    const msPerPixel = (durationMS ?? 0) / window.innerWidth
    return Math.min(Math.max(minDelay, msPerPixel), 1000)
  }, [player, minDelay, durationMS, seekMS, state])

  return {
    currentTimeMS,
    durationMS: durationMS ?? Infinity,
  }
}

export const SeekBar: React.FC = () => {
  const player = useContext(PlayerContext)!
  const { currentTimeMS, durationMS } = usePlayerTimingsMS(player)
  const { segments } = useSegments(player)

  const onMove = useCallback(
    (percent: number, { elem, isDragging, isHovering }: MoveCallbackMetadata) => {
      if (isDragging) {
        elem.style.setProperty('--current-time-end-override', `${percent}%`)
        player.currentScrubTimeMS.set((percent / 100) * (player.durationMS.get() ?? 0))
      }
      if (isHovering) elem.style.setProperty('--current-hover-time-end', `${percent}%`)
    },
    [player],
  )
  const onBlur = useCallback((_: unknown, { elem }: MoveCallbackMetadata) => {
    elem.style.removeProperty('--current-hover-time-end')
  }, [])
  const onUp = useCallback(
    (percent: number, { elem }: MoveCallbackMetadata) => {
      player!.seekMS.set((percent / 100) * (player.durationMS.get() ?? 1))
      elem.style.removeProperty('--current-time-end-override')
      elem.style.removeProperty('--current-hover-time-end')
    },
    [player],
  )
  const ref = useMove(onMove, onUp, onBlur)

  const { bufferedRangesMS } = useBufferedRangesMS(player)
  const bufferedRangeCSSVars = bufferedRangesMS.reduce(
    (curr, range, i) => ({
      ...curr,
      [`--buffered-${i}-start`]: `${(range[0] / durationMS) * 100}%`,
      [`--buffered-${i}-end`]: `${(range[1] / durationMS) * 100}%`,
    }),
    {},
  )

  const inOverlay = segments?.categories.some(
    (segment) => segment.startTimeMS < currentTimeMS && segment.endTimeMS > currentTimeMS,
  )
  // todo: better way to handle duration = 0
  // todo: dont show the overlay for the segments unless in a segment
  return (
    <SeekBarContainer
      ref={ref}
      style={{
        // @ts-expect-error
        '--current-time-end': `${(currentTimeMS / durationMS) * 100}%`,
        ...bufferedRangeCSSVars,
      }}
    >
      <SeekBarSection widthPercent={100}>
        {bufferedRangesMS.map((_, i) => (
          <SeekBarOverlayVar key={i} $cssVar={`buffered-${i}`} $color="rgba(255, 255, 255, 0.2)" />
        ))}
        <SeekBarOverlayVar $cssVar="current-hover-time" $color="rgba(255, 255, 255, 0.2)" />
        <SeekBarOverlayVar $cssVar="current-time" $color="var(--mantine-primary-color-7)" />
        <SegmentOverlays />
        {inOverlay && (
          <SeekBarOverlay
            $color="var(--mantine-primary-color-7)"
            style={{
              left: 'max(0px, calc(var(--current-time-end-override, var(--current-time-end)) - 6px))',
              right: 'calc(100% - var(--current-time-end-override, var(--current-time-end)))',
            }}
          />
        )}
      </SeekBarSection>
      <SeekBarThumb />
    </SeekBarContainer>
  )
}

const getMantineColorVar = (color: string, shade: number) => `var(--mantine-color-${color}-${shade})`
const SegmentOverlays: FC = () => {
  const [categories] = useAtom(settings.playerSegmentsCategoriesAtom)

  const player = useContext(PlayerContext)!
  const { segments } = useSegments(player)
  const { durationMS } = useDurationMS(player)

  return segments?.categories
    .filter((segment) => categories[segment.category].enabled)
    .map((segment) => (
      <SeekBarOverlay
        key={segment.id}
        $color={getMantineColorVar(categories[segment.category].color, categories[segment.category].shade)}
        style={{
          left: `${(segment.startTimeMS / (durationMS ?? 1)) * 100}%`,
          right: `calc(100% - ${(segment.endTimeMS / (durationMS ?? 1)) * 100}%)`,
        }}
      />
    ))
}
