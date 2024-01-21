/* eslint-disable react-hooks/exhaustive-deps */

import * as std from '@std'
import { useEffect, useMemo, useState } from 'react'

export enum PlayerState {
  Playing = 'playing',
  Paused = 'paused',
  Ended = 'ended',
  Error = 'error',
}

// TODO: Better name
export type CombinedSource =
  | std.Source<std.SourceType.AudioVideo>
  | { audio: std.Source<std.SourceType.Audio>; video: std.Source<std.SourceType.Video> }
export type PlayerInstance = {
  video: HTMLVideoElement
  audio: HTMLAudioElement

  play: () => void
  pause: () => void
  destroy: () => void

  state: ValueListener<PlayerState>
  seekMS: ValueListener<number | undefined>
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
  durationMS: Pick<ValueListener<number>, 'get' | 'onChange'>
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
      listeners.forEach(listener => listener(value))
    },
    onChange: (cb: (value: Value) => void) => {
      // We wrap the CB to ensure it's unique for removal later
      const uniqueCb = (value: Value) => cb(value)
      listeners.push(uniqueCb)
      return () => {
        listeners = listeners.filter(listener => listener !== uniqueCb)
      }
    },
  }
}

// todo: should play video first and then audio after it loads
export const createPlayerInstance = (player: std.Player): PlayerInstance => {
  const video = document.createElement('video')
  const audio = new Audio()

  const state = createValueListener(PlayerState.Playing)
  const seekMS = createValueListener<number | undefined>(undefined)
  const buffering = createValueListener(true)
  const bufferedRangesMS = createValueListener<[number, number][]>([])
  const volume = createValueListener(1)
  const playbackRate = createValueListener(1)
  // todo: need to consider user preference, hardware acceleration, etc.
  const source = createValueListener<CombinedSource>({
    video: player.sources.filter(std.isVideoSource).find(source => source.mimetype?.includes('vp9'))!,
    audio: player.sources.find(std.isAudioSource)!,
  })
  const closedCaptions = createValueListener<std.ClosedCaption | undefined>(undefined)
  const durationMS = createValueListener(0)

  // State
  state.onChange(newState => {
    if (newState === PlayerState.Playing && !buffering.get()) {
      video.play().catch(err => {
        console.error(err)
        // state.set(PlayerState.Error)
      })
      audio.play().catch(err => {
        console.error(err)
        // state.set(PlayerState.Error)
      })
    } else if (newState === PlayerState.Paused) {
      video.pause()
      audio.pause()
    } else if (newState === PlayerState.Ended || newState === PlayerState.Error) {
      video.pause()
      video.currentTime = Infinity
      audio.pause()
      audio.currentTime = Infinity
    }
  })

  // Buffering
  let videoBuffering = true
  let audioBuffering = true
  video.addEventListener('waiting', () => {
    videoBuffering = true
    buffering.set(true)
  })
  video.addEventListener('canplaythrough', () => {
    console.log('video canplay')
    videoBuffering = false
    buffering.set(videoBuffering || audioBuffering)
  })
  audio.addEventListener('waiting', () => {
    audioBuffering = true
    buffering.set(true)
  })
  audio.addEventListener('canplaythrough', () => {
    console.log('audio canplay')
    audioBuffering = false
    buffering.set(videoBuffering || audioBuffering)
  })
  buffering.onChange(buffering => {
    console.log('buffering', buffering)
    if (buffering) {
      video.pause()
      audio.pause()
    } else if (state.get() === PlayerState.Playing) {
      video.play().catch(() => state.set(PlayerState.Error))
      audio.play().catch(() => state.set(PlayerState.Error))
    }
  })

  // Volume
  video.volume = 0
  audio.volume = volume.get()
  volume.onChange(volume => {
    video.volume = 0
    audio.volume = volume
  })

  // Playback rate
  video.playbackRate = playbackRate.get()
  audio.playbackRate = playbackRate.get()
  playbackRate.onChange(playbackRate => {
    video.playbackRate = playbackRate
    audio.playbackRate = playbackRate
  })

  // Synchronize audio and video
  setInterval(() => {
    if (!video.currentTime || !audio.currentTime) return

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
  }, 50)

  video.addEventListener('durationchange', () =>
    durationMS.set(Math.min(video.duration * 1000, audio.duration * 1000)),
  )
  audio.addEventListener('durationchange', () =>
    durationMS.set(Math.min(video.duration * 1000, audio.duration * 1000)),
  )
  setInterval(() => {
    const bufferedRanges = new Array(video.buffered.length)
      .fill(0)
      .map<[number, number]>((_, i) => [video.buffered.start(i) * 1000, video.buffered.end(i) * 1000])
    if (bufferedRanges.length === 0) return
    bufferedRangesMS.set(bufferedRanges)
  }, 500)

  // Source
  // todo: maintain position
  // todo: handle video with seperate audio
  // @ts-ignore
  video.src = source.get().video.url
  // @ts-ignore
  audio.src = source.get().audio.url
  // @ts-ignore
  video.style.setProperty('aspect-ratio', `${source.get().video.width} / ${source.get().video.height}`)
  source.onChange(source => {
    // @ts-ignore
    video.src = source.video.url
    // @ts-ignore
    audio.src = source.audio.url
    // @ts-ignore
    video.style.setProperty('aspect-ratio', `${source.video.width} / ${source.video.height}`)
  })

  // Seeking
  seekMS.onChange(seekMS => {
    if (seekMS === undefined) return
    video.currentTime = seekMS / 1000
    audio.currentTime = seekMS / 1000
  })

  return {
    video,
    audio,

    play: () => state.set(PlayerState.Playing),
    pause: () => state.set(PlayerState.Paused),
    destroy: () => {
      video.pause()
      video.src = ''
      audio.pause()
      audio.src = ''
    },

    state,
    seekMS,
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