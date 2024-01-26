/* eslint-disable react-hooks/exhaustive-deps */
/*
 * Implementation of a player for youtube which doubles
 * as the global store for the player UI
 * todo: switch to Media Source Extensions for live streams and
 * consistency across browsers
 */

import * as std from '@std'
import { useEffect, useState } from 'react'

export enum PlayerState {
	Playing = 'playing',
	Paused = 'paused',
	Ended = 'ended',
	Error = 'error',
}

// TODO: Better name
export type CombinedSource = {
	audio: std.Source<std.SourceType.Audio | std.SourceType.AudioVideo>
	video: std.Source<std.SourceType.Video | std.SourceType.AudioVideo>
}
export type PlayerInstance = {
	video: HTMLVideoElement
	audio: HTMLAudioElement

	play: () => void
	pause: () => void
	destroy: () => void

	state: ValueListener<PlayerState>
	seekMS: ValueListener<number | undefined>
	currentScrubTimeMS: ValueListener<number | undefined>
	source: ValueListener<CombinedSource>
	sources: std.Source[]
	segments?: std.PlayerSegments
	buffering: Pick<ValueListener<boolean>, 'get' | 'onChange'>
	bufferedRangesMS: Pick<ValueListener<[number, number][]>, 'get' | 'onChange'>
	volume: ValueListener<number>
	playbackRate: ValueListener<number>
	closedCaptions: ValueListener<std.ClosedCaption | undefined>
	allClosedCaptions: std.ClosedCaption[]
	currentTimeMS: Pick<ValueListener<number>, 'get'>
	durationMS: Pick<ValueListener<number | undefined>, 'get' | 'onChange'>
}

type OnChange<T> = (cb: (value: T) => void) => () => void
type ValueListener<T> = {
	get: () => T
	set: (value: T) => void
	onChange: OnChange<T>
}

const createValueListener = <Value>(initialValue: Value) => {
	let value: Value = initialValue
	let listeners: ((value: Value) => void)[] = []
	return {
		get: (): Value => value,
		set: (newValue: Value) => {
			if (value === newValue) return
			value = newValue
			for (const listener of listeners) listener(value)
		},
		onChange: (cb: (value: Value) => void) => {
			// We wrap the CB to ensure it's unique for removal later
			const uniqueCb = (value: Value) => cb(value)
			listeners.push(uniqueCb)
			return () => {
				listeners = listeners.filter((listener) => listener !== uniqueCb)
			}
		},
	}
}

async function canPlay() {
	const audio = new Audio()
	audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
	return audio
		.play()
		.then(() => true)
		.catch(() => false)
}

// todo: should play video first and then audio after it loads
export const createPlayerInstance = (player: std.Player): PlayerInstance => {
	const video = document.createElement('video')
	const audio = new Audio()
	const isReady = () => video.readyState > 0 && audio.readyState > 0

	const state = createValueListener(PlayerState.Playing)
	const seekMS = createValueListener<number | undefined>(undefined)
	const currentScrubTimeMS = createValueListener<number | undefined>(undefined)
	const buffering = createValueListener(true)
	const bufferedRangesMS = createValueListener<[number, number][]>([])
	const volume = createValueListener(1)
	const playbackRate = createValueListener(1)
	// todo: need to consider user preference, hardware acceleration, etc.
	// todo: video can expire at which point we need to refresh
	const source = createValueListener<CombinedSource>({
		video: player.sources.filter(std.isVideoSource).find((source) => source.mimetype?.includes('vp9'))!,
		audio: player.sources.find(std.isAudioSource)!,
	})
	const closedCaptions = createValueListener<std.ClosedCaption | undefined>(undefined)
	const durationMS = createValueListener<number | undefined>(undefined)

	const play = async () => {
		if (!(await canPlay())) return state.set(PlayerState.Paused)
		return video
			.play()
			.then(() => audio.play())
			.catch(console.error)
	}
	const pause = () => {
		video.pause()
		audio.pause()
	}

	// Source
	// todo: maintain position
	// todo: handle video with seperate audio
	video.src = source.get().video.url
	audio.src = source.get().audio.url
	video.style.setProperty('aspect-ratio', `${source.get().video.width} / ${source.get().video.height}`)
	source.onChange((source) => {
		video.src = source.video.url
		audio.src = source.audio.url
		video.style.setProperty('aspect-ratio', `${source.video.width} / ${source.video.height}`)
	})
	if (state.get() === PlayerState.Playing) play()

	// State
	state.onChange((newState) => {
		if (newState === PlayerState.Playing && !buffering.get()) play()
		else if (newState === PlayerState.Paused) pause()
		else if (newState === PlayerState.Ended || newState === PlayerState.Error) {
			pause()
			video.currentTime = Infinity
			audio.currentTime = Infinity
		}
	})

	// Buffering
	// todo: buffering is true when video is ended
	const bufferingIntervalId = setInterval(
		() => buffering.set(video.readyState < 3 || audio.readyState < 3),
		10,
	)
	buffering.onChange((buffering) => {
		console.log('buffering', buffering)
		if (buffering) pause()
		else if (state.get() === PlayerState.Playing) play()
	})

	// Volume
	video.volume = 0
	audio.volume = volume.get()
	volume.onChange((volume) => {
		video.volume = 0
		audio.volume = volume
	})

	// Playback rate
	video.playbackRate = playbackRate.get()
	audio.playbackRate = playbackRate.get()
	playbackRate.onChange((playbackRate) => {
		video.playbackRate = playbackRate
		audio.playbackRate = playbackRate
	})

	// Synchronize audio and video
	const syncronizeIntervalId = setInterval(() => {
		if (!isReady()) return

		const rate = playbackRate.get()
		const currentTime = audio.currentTime

		// Synchronize
		// Too far out of sync so reconcile
		if (Math.abs(video.currentTime - currentTime) >= 0.5) {
			console.warn('video far out of sync', currentTime, video.currentTime)
			video.currentTime = currentTime
		}
		// Synchronize over 2 seconds
		const synchronizationFactor = Math.abs(video.currentTime - currentTime) / 2
		// Video is ahead
		if (video.currentTime - currentTime > 0.01) video.playbackRate = rate - synchronizationFactor
		// Video is behind
		else if (video.currentTime - currentTime < -0.01) video.playbackRate = rate + synchronizationFactor
		// Video in sync
		else video.playbackRate = rate
	}, 100)

	// Duration
	video.addEventListener('durationchange', () => {
		const audioDuration = Number.isNaN(audio.duration) ? undefined : audio.duration * 1000
		const videoDuration = Number.isNaN(video.duration) ? undefined : video.duration * 1000
		durationMS.set(audioDuration ?? videoDuration)
	})
	audio.addEventListener('durationchange', () => {
		const audioDuration = Number.isNaN(audio.duration) ? undefined : audio.duration * 1000
		const videoDuration = Number.isNaN(video.duration) ? undefined : video.duration * 1000
		durationMS.set(audioDuration ?? videoDuration)
	})

	// Buffered
	video.addEventListener('progress', () => {
		const bufferedRanges = new Array(video.buffered.length)
			.fill(0)
			.map<[number, number]>((_, i) => [video.buffered.start(i) * 1000, video.buffered.end(i) * 1000])
		if (bufferedRanges.length === 0) return
		bufferedRangesMS.set(bufferedRanges)
	})

	// Seeking
	seekMS.onChange((seekMS) => {
		if (seekMS === undefined || !isReady()) return
		video.currentTime = seekMS / 1000
		audio.currentTime = seekMS / 1000
	})

	return {
		video,
		audio,

		play: () => state.set(PlayerState.Playing),
		pause: () => state.set(PlayerState.Paused),
		destroy: () => {
			clearInterval(bufferingIntervalId)
			clearInterval(syncronizeIntervalId)
			video.pause()
			video.src = ''
			audio.pause()
			audio.src = ''
		},

		state,
		seekMS,
		currentScrubTimeMS,
		source,
		sources: player.sources,
		segments: player.segments,
		buffering: { get: buffering.get, onChange: buffering.onChange },
		bufferedRangesMS: { get: bufferedRangesMS.get, onChange: bufferedRangesMS.onChange },
		volume,
		playbackRate,
		closedCaptions,
		allClosedCaptions: player.closedCaptions,
		currentTimeMS: { get: () => video.currentTime * 1000 },
		durationMS: { get: durationMS.get, onChange: durationMS.onChange },
	}
}

export const usePlayerInstance = (player?: std.Player) => {
	const [instance, setInstance] = useState<PlayerInstance | undefined>(undefined)

	useEffect(() => {
		if (!player) return
		const instance = createPlayerInstance(player)
		setInstance(instance)
		return () => instance.destroy()
	}, [player])

	return instance
}