import { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'
import * as std from '@std'

import { Row } from 'lese'
import styled from 'styled-components'

import { PlayerContext } from '../context'
import { PlayerInstance, PlayerState } from '../hooks/usePlayerInstance'
import { useBufferedRangesMS, useDurationMS, usePlayerState, useSeekMS, useSegments } from '../hooks/use'
import usePoll from '@/hooks/usePoll'

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
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: ${(_) => _.$color};
`

const SeekBarOverlayVar = styled(SeekBarOverlay)<{ $cssVar: string; $color: string }>`
  background-color: ${(_) => _.$color};
  left: var(--${(_) => _.$cssVar}-start-override, var(--${(_) => _.$cssVar}-start));
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
  background-color: var(--mantine-primary-color-5);
  pointer-events: none;
`

const SeekBarThumb: React.FC = () => (
	<SeekBarThumbStyled
		style={{ right: 'calc(100% - var(--current-time-end-override, var(--current-time-end)))' }}
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

// todo: should be baked into the player so it updates the time on the other controls (ends at, current time)
const useMove = (player: PlayerInstance, onUp: (value: number) => void) => {
	const [elem, setElem] = useState<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!elem) return

		const calculatePercent = (x: number) => {
			const { left, width } = elem.getBoundingClientRect()
			return ((x - left) / width) * 100
		}

		const onMouseMove = (e: MouseEvent) => {
			e.preventDefault()
			const percent = calculatePercent(e.clientX)
			elem.style.setProperty('--current-time-end-override', `${percent}%`)
			player.currentScrubTimeMS.set((percent / 100) * (player.durationMS.get() ?? 0))
		}

		const onMouseUp = (e: MouseEvent) => {
			window.removeEventListener('mousemove', onMouseMove, true)
			onUp(calculatePercent(e.clientX))
			// fixme: sweet mother of god. @aaditya told me to
			setTimeout(() => elem!.style.removeProperty('--current-time-end-override'), 100)
			player.currentScrubTimeMS.set(undefined)
		}

		const onMouseDown = (e: MouseEvent) => {
			e.preventDefault()
			window.addEventListener('mousemove', onMouseMove, true)
			elem.addEventListener('mouseup', onMouseUp)
			elem.style.setProperty('--current-time-end-override', `${calculatePercent(e.clientX)}%`)
		}
		elem.addEventListener('mousedown', onMouseDown)

		return () => {
			elem.removeEventListener('mouseup', onMouseUp)
			elem.removeEventListener('mousedown', onMouseDown)
		}
	}, [player, elem, onUp])

	return (elem: HTMLDivElement) => setElem(elem)
}

/** Polls as infrequntly as possible, while still getting pixel perfect (or close to) updates */
const usePlayerTimingsMS = (playerContext: PlayerInstance, minDelay = 16) => {
	const { seekMS } = useSeekMS(playerContext)
	const { durationMS } = useDurationMS(playerContext)
	const [currentTimeMS, setCurrentTimeMS] = useState(playerContext.currentTimeMS.get())
	const { state } = usePlayerState(playerContext)

	usePoll(() => {
		setCurrentTimeMS(playerContext.currentTimeMS.get())
		if (state !== PlayerState.Playing) return Infinity

		// Calculate delay until the next pixel would be updated
		// assuming the video is fullscreen for simplicity
		const msPerPixel = (durationMS ?? 0) / window.innerWidth
		return Math.max(minDelay, msPerPixel)
	}, [playerContext, minDelay, durationMS, seekMS, state])

	return {
		currentTimeMS,
		durationMS: durationMS ?? 1,
	}
}

export const SeekBar: React.FC = () => {
	const player = useContext(PlayerContext)!
	const { currentTimeMS, durationMS } = usePlayerTimingsMS(player)

	const onMoveCallback = useCallback(
		(percent: number) => player!.seekMS.set((percent / 100) * (player.durationMS.get() ?? 1)),
		[player],
	)
	const ref = useMove(player, onMoveCallback)

	const { bufferedRangesMS } = useBufferedRangesMS(player)
	const bufferedRangeCSSVars = bufferedRangesMS.reduce(
		(curr, range, i) => ({
			...curr,
			[`--buffered-${i}-start`]: `${(range[0] / durationMS) * 100}%`,
			[`--buffered-${i}-end`]: `${(range[1] / durationMS) * 100}%`,
		}),
		{},
	)

	// todo: better way to handle duration = 0
	return (
		<SeekBarContainer
			ref={ref}
			style={{
				// @ts-expect-error
				'--current-time-start': '0',
				'--current-time-end': `${(currentTimeMS / durationMS) * 100}%`,
				...bufferedRangeCSSVars,
			}}
		>
			<SeekBarSection widthPercent={100}>
				<SegmentOverlays />
				{bufferedRangesMS.map((_, i) => (
					<SeekBarOverlayVar key={i} $cssVar={`buffered-${i}`} $color="rgba(255, 255, 255, 0.2)" />
				))}
				<SeekBarOverlayVar $cssVar="current-time" $color="var(--mantine-primary-color-5)" />
			</SeekBarSection>
			<SeekBarThumb />
		</SeekBarContainer>
	)
}

const segmentCategoryColor = {
	[std.PlayerSegmentCategory.Sponsor]: 'var(--mantine-color-green-5)',
	[std.PlayerSegmentCategory.SelfPromo]: 'var(--mantine-color-yellow-5)',
	[std.PlayerSegmentCategory.Interaction]: 'var(--mantine-color-pink-5)',
	[std.PlayerSegmentCategory.Highlight]: 'var(--mantine-color-grape-5)',
	[std.PlayerSegmentCategory.Intro]: 'var(--mantine-color-teal-5)',
	[std.PlayerSegmentCategory.Outro]: 'var(--mantine-color-indigo-5)',
	[std.PlayerSegmentCategory.Preview]: 'var(--mantine-color-cyan-5)',
	[std.PlayerSegmentCategory.Filler]: 'var(--mantine-color-violet-5)',
	[std.PlayerSegmentCategory.MusicOfftopic]: 'var(--mantine-color-orange-5)',
	[std.PlayerSegmentCategory.Chapter]: 'never',
	[std.PlayerSegmentCategory.ExclusiveAccess]: 'never',
}
const SegmentOverlays: FC = () => {
	const player = useContext(PlayerContext)!
	const { segments } = useSegments(player)
	const { durationMS } = useDurationMS(player)
	return segments?.categories.map((segment) => (
		<SeekBarOverlay
			key={segment.id}
			$color={segmentCategoryColor[segment.category]}
			style={{
				left: `${(segment.startTimeMS / (durationMS ?? 1)) * 100}%`,
				right: `calc(100% - ${(segment.endTimeMS / (durationMS ?? 1)) * 100}%)`,
			}}
		/>
	))
}