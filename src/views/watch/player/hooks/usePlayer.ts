import * as std from '@std'
import { useMemo } from 'react'

export enum PlayerState {
  Playing = 'playing',
  Paused = 'paused',
  Ended = 'ended',
}

// TODO: Better name
export type CombinedSource =
  | std.Source<std.SourceType.AudioVideo>
  | { audio: std.Source<std.SourceType.Audio>; video: std.Source<std.SourceType.Video> }

export type PlayerInstance = {
  player: std.Player

  getState: () => PlayerState
  setState: (state: PlayerState) => void
  onStateChange: (cb: (state: PlayerState) => void) => void

  getWaiting: () => boolean
  setWaiting: (waiting: boolean) => void
  onWaitingChange: (cb: (waiting: boolean) => void) => () => void

  getBufferedMS: () => number
  setBufferedMS: (bufferedMS: number) => void
  onBufferedMSChange: (cb: (bufferedMS: number) => void) => () => void

  getDurationMS: () => number
  setDurationMS: (durationMS: number) => void
  onDurationMSChange: (cb: (durationMS: number) => void) => () => void

  getCurrentTimeMS: () => number
  setCurrentTimeMS: (currentTimeMS: number) => void
  onCurrentTimeMSChange: (cb: (currentTimeMS: number) => void) => () => void

  getVolume: () => number
  setVolume: (volume: number) => void
  onVolumeChange: (cb: (volume: number) => void) => () => void

  getPlaybackRate: () => number
  setPlaybackRate: (rate: number) => void
  onPlaybackRateChange: (cb: (playbackRate: number) => void) => () => void

  getSource: () => CombinedSource | undefined
  setSource: (source: CombinedSource) => void
  onSourceChange: (cb: (source: CombinedSource) => void) => () => void

  getClosedCaptions: () => std.ClosedCaption | undefined
  setClosedCaptions: (closedCaptions: std.ClosedCaption | undefined) => void
  onClosedCaptionsChange: (cb: (closedCaptions: std.ClosedCaption | undefined) => void) => () => void
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

export const usePlayerInstance = (player: std.Player): PlayerInstance =>
  useMemo(() => {
    const { get: getState, set: setState, onChange: onStateChange } = createValueListener(PlayerState.Paused)
    const { get: getWaiting, set: setWaiting, onChange: onWaitingChange } = createValueListener(true)
    const {
      get: getBufferedMS,
      set: setBufferedMS,
      onChange: onBufferedMSChange,
    } = createValueListener<number>(0)
    const {
      get: getDurationMS,
      set: setDurationMS,
      onChange: onDurationMSChange,
    } = createValueListener<number>(0)
    const {
      get: getCurrentTimeMS,
      set: setCurrentTimeMS,
      onChange: onCurrentTimeMSChange,
    } = createValueListener(0)
    const { get: getVolume, set: setVolume, onChange: onVolumeChange } = createValueListener(1)
    const {
      get: getPlaybackRate,
      set: setPlaybackRate,
      onChange: onPlaybackRateChange,
    } = createValueListener(1)
    const {
      get: getSource,
      set: setSource,
      onChange: onSourceChange,
    } = createValueListener<CombinedSource>({
      video: player.sources.find(std.isVideoSource)!,
      audio: player.sources.find(std.isAudioSource)!,
    })
    const {
      get: getClosedCaptions,
      set: setClosedCaptions,
      onChange: onClosedCaptionsChange,
    } = createValueListener<std.ClosedCaption | undefined>(undefined)

    return {
      player,

      getState,
      setState,
      onStateChange,

      // TODO: Model separately so that we can have current time dictated by the video player
      seek: (time: number) => {},
      onSeek: (cb: (time: number) => void) => {},

      getWaiting,
      setWaiting,
      onWaitingChange,

      getBufferedMS,
      setBufferedMS,
      onBufferedMSChange,

      getDurationMS,
      setDurationMS,
      onDurationMSChange,

      getCurrentTimeMS,
      setCurrentTimeMS,
      onCurrentTimeMSChange,

      getVolume,
      setVolume,
      onVolumeChange,

      getPlaybackRate,
      setPlaybackRate,
      onPlaybackRateChange,

      getSource,
      setSource,
      onSourceChange,

      getClosedCaptions,
      setClosedCaptions,
      onClosedCaptionsChange,
    }
  }, [player])
