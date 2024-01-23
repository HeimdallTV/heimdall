import { useEffect, useState } from 'react'
import { PlayerInstance, PlayerState } from './usePlayerInstance'

export const usePlayerState = (player: PlayerInstance) => {
	const [state, setState] = useState(player.state.get)
	useEffect(() => player.state.onChange(setState), [player])
	useEffect(() => {
		setState(player.state.get)
	}, [player])
	return {
		state,
		togglePlay: (state: PlayerState) =>
			player.state.set(state === PlayerState.Playing ? PlayerState.Paused : PlayerState.Playing),
		play: () => player.state.set(PlayerState.Playing),
		pause: () => player.state.set(PlayerState.Paused),
	}
}

export const useSeekMS = (player: PlayerInstance) => {
	const [seekMS, setSeekMS] = useState(player.seekMS.get)
	useEffect(() => player.seekMS.onChange(setSeekMS), [player])
	useEffect(() => {
		setSeekMS(player.seekMS.get)
	}, [player])
	return { seekMS, setSeekMS: player.seekMS.set }
}

export const useCurrentScrubTimeMS = (player: PlayerInstance) => {
	const [currentScrubTimeMS, setCurrentScrubTimeMS] = useState(player.currentScrubTimeMS.get)
	useEffect(() => player.currentScrubTimeMS.onChange(setCurrentScrubTimeMS), [player])
	useEffect(() => {
		setCurrentScrubTimeMS(player.currentScrubTimeMS.get)
	}, [player])
	return { currentScrubTimeMS }
}

export const useSource = (player: PlayerInstance) => {
	const [source, setSource] = useState(player.source.get)
	useEffect(() => player.source.onChange(setSource), [player])
	useEffect(() => setSource(player.source.get), [player])
	return {
		source,
		sources: player.sources,
		setSource: player.source.set,
	}
}

export const useSegments = (player: PlayerInstance) => {
	const [segments, setSegments] = useState(player.segments)
	useEffect(() => setSegments(player.segments), [player])
	return { segments }
}

export const useBuffering = (player: PlayerInstance) => {
	const [buffering, setBuffering] = useState(player.buffering.get)
	useEffect(() => player.buffering.onChange(setBuffering), [player])
	useEffect(() => setBuffering(player.buffering.get), [player])
	return { buffering }
}

export const useBufferedRangesMS = (player: PlayerInstance) => {
	const [bufferedRangesMS, setBufferedRangesMS] = useState(player.bufferedRangesMS.get)
	useEffect(() => player.bufferedRangesMS.onChange(setBufferedRangesMS), [player])
	useEffect(() => setBufferedRangesMS(player.bufferedRangesMS.get), [player])
	return { bufferedRangesMS }
}

export const useVolume = (player: PlayerInstance) => {
	const [volume, setVolume] = useState(player.volume.get)
	useEffect(() => player.volume.onChange(setVolume), [player])
	useEffect(() => setVolume(player.volume.get), [player])
	return {
		volume,
		volumeLog: Math.sqrt(volume),
		setVolume: player.volume.set,
		setVolumeLog: (volume: number) => player.volume.set(volume ** 2),
	}
}

export const usePlaybackRate = (player: PlayerInstance) => {
	const [playbackRate, setPlaybackRate] = useState(player.playbackRate.get)
	useEffect(() => player.playbackRate.onChange(setPlaybackRate), [player])
	useEffect(() => setPlaybackRate(player.playbackRate.get), [player])
	return {
		playbackRate,
		setPlaybackRate: player.playbackRate.set,
	}
}

export const useClosedCaptions = (player: PlayerInstance) => {
	const [closedCaptions, setClosedCaptions] = useState(player.closedCaptions.get)
	useEffect(() => player.closedCaptions.onChange(setClosedCaptions), [player])
	useEffect(() => {
		setClosedCaptions(player.closedCaptions.get)
	}, [player])
	return {
		closedCaptions,
		allClosedCaptions: player.allClosedCaptions,
		setClosedCaptions: player.closedCaptions.set,
	}
}

export const useDurationMS = (player: PlayerInstance) => {
	const [durationMS, setDurationMS] = useState(player.durationMS.get)
	useEffect(() => player.durationMS.onChange(setDurationMS), [player])
	useEffect(() => {
		setDurationMS(player.durationMS.get)
	}, [player])
	return { durationMS }
}
