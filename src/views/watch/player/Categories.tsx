import { useContext } from 'react'
import { PlayerContext } from './context'
import { useDurationMS, usePlaybackRate, useSeekMS, useSegments } from './hooks/use'
import usePoll from '@/hooks/usePoll'
import { useAtomValue } from 'jotai'
import * as settings from '@/settings'

// todo: should run the logic to skip forward recursively until no more skipping occurs
// in case skipping a segment leads to being in another segment
export function Categories() {
	const player = useContext(PlayerContext)!
	const { playbackRate } = usePlaybackRate(player)
	const { durationMS } = useDurationMS(player)
	const { seekMS, setSeekMS } = useSeekMS(player)
	const { segments } = useSegments(player)
	const categoriesSettings = useAtomValue(settings.playerSegmentsCategoriesAtom)

	usePoll(() => {
		if (durationMS === 0 || !segments) return Infinity

		// figure out how long until the next segment
		const currentTimeMS = player.currentTimeMS.get()
		const nextSegment = segments.categories.find((segment) => segment.startTimeMS > currentTimeMS)
		const timeUntilNextSegment = nextSegment
			? (nextSegment.startTimeMS - currentTimeMS) / playbackRate
			: Infinity

		// figure out what segment we're currently in
		const activeSegments = segments.categories
			.filter((segment) => categoriesSettings[segment.category].enabled)
			.filter(
				(segment) =>
					segment.startTimeMS <= currentTimeMS &&
					segment.endTimeMS >= currentTimeMS &&
					(seekMS === undefined || segment.startTimeMS > seekMS || segment.endTimeMS < seekMS),
			)
		if (activeSegments.length === 0) return timeUntilNextSegment

		// skip the longest segment if it exists
		const segmentsToSkip = activeSegments.filter(
			(segment) =>
				categoriesSettings[segment.category].behavior === settings.PlayerSegmentCategoryBehavior.Skip,
		)
		if (segmentsToSkip.length) {
			const newTimeMS = Math.max(...segmentsToSkip.map((segment) => segment.endTimeMS))
			setSeekMS(newTimeMS)
			return timeUntilNextSegment - (newTimeMS - currentTimeMS) / playbackRate
		}

		// todo: notifications to skip ahead

		return timeUntilNextSegment
	}, [durationMS, seekMS, segments, playbackRate])

	return null
}
