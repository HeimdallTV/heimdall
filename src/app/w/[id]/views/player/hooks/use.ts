import { useEffect, useState } from 'react'
import { PlayerInstance, PlayerState } from './usePlayer'

export const usePlayerState = (player: PlayerInstance) => {
  const [state, setState] = useState(player.getState)
  useEffect(() => player.onStateChange(setState), [player])
  useEffect(() => {
    setState(player.getState)
  }, [player])
  return {
    state,
    togglePlay: (state: PlayerState) =>
      player.setState(state === PlayerState.Playing ? PlayerState.Paused : PlayerState.Playing),
    play: () => player.setState(PlayerState.Playing),
    pause: () => player.setState(PlayerState.Paused),
  }
}

export const useDurationMS = (player: PlayerInstance) => {
  const [durationMS, setDurationMS] = useState(player.getDurationMS)
  useEffect(() => player.onDurationMSChange(setDurationMS), [player])
  useEffect(() => {
    setDurationMS(player.getDurationMS)
  }, [player])
  return {
    durationMS,
    setDurationMS: player.setDurationMS,
  }
}

export const useBufferedMS = (player: PlayerInstance) => {
  const [bufferedMS, setBufferedMS] = useState(player.getBufferedMS)
  useEffect(() => player.onBufferedMSChange(setBufferedMS), [player])
  useEffect(() => {
    setBufferedMS(player.getBufferedMS)
  }, [player])
  return {
    bufferedMS,
    setBufferedMS: player.setBufferedMS,
  }
}

export const useVolume = (player: PlayerInstance) => {
  const [volume, setVolume] = useState(player.getVolume)
  useEffect(() => player.onVolumeChange(setVolume), [player])
  useEffect(() => {
    setVolume(player.getVolume)
  }, [player])
  return {
    volume,
    volumeLog: Math.log10(volume),
    setVolume: player.setVolume,
    setVolumeLog: (volume: number) => player.setVolume(Math.log10(volume)),
  }
}

export const usePlaybackRate = (player: PlayerInstance) => {
  const [playbackRate, setPlaybackRate] = useState(player.getPlaybackRate)
  useEffect(() => player.onPlaybackRateChange(setPlaybackRate), [player])
  useEffect(() => {
    setPlaybackRate(player.getPlaybackRate)
  }, [player])
  return {
    playbackRate,
    setPlaybackRate: player.setPlaybackRate,
  }
}

export const useSource = (player: PlayerInstance) => {
  const [source, setSource] = useState(player.getSource)
  useEffect(() => player.onSourceChange(setSource), [player])
  useEffect(() => {
    setSource(player.getSource)
  }, [player])
  return {
    source,
    sources: player.player!.sources,
    setSource: player.setSource,
  }
}

export const useWaiting = (player: PlayerInstance) => {
  const [waiting, setWaiting] = useState(player.getWaiting)
  useEffect(() => player.onWaitingChange(setWaiting), [player])
  useEffect(() => {
    setWaiting(player.getWaiting)
  }, [player])
  return {
    waiting,
    setWaiting: player.setWaiting,
  }
}

export const useClosedCaptions = (player: PlayerInstance) => {
  const [closedCaptions, setClosedCaptions] = useState(player.getClosedCaptions)
  useEffect(() => player.onClosedCaptionsChange(setClosedCaptions), [player])
  useEffect(() => {
    setClosedCaptions(player.getClosedCaptions)
  }, [player])
  return {
    closedCaptions,
    allClosedCaptions: player.player!.closedCaptions,
    setClosedCaptions: player.setClosedCaptions,
  }
}
