/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useMemo } from 'react'
import { usePlaybackRate, usePlayerState, useSource, useVolume, useWaiting } from './use'
import { PlayerInstance, PlayerState } from './usePlayer'

const onInterval = (callback: () => void, intervalMS = 100) => {
  const intervalId = setInterval(callback, intervalMS)
  return () => clearInterval(intervalId)
}

export const useVideoInstance = (playerInstance: PlayerInstance) => {
  const video = useMemo(() => {
    const video = document.createElement('video')
    video.style.setProperty('aspect-ratio', '16 / 9')
    return video
  }, [playerInstance])
  const audio = useMemo(() => new Audio(), [playerInstance])

  // State
  const { state } = usePlayerState(playerInstance)
  useEffect(() => {
    if (state === PlayerState.Playing) {
      video.play().catch(err => {
        if (err.name !== 'NotAllowedError') throw err
        playerInstance.setState(PlayerState.Paused)
      })
      audio.play().catch(err => {
        if (err.name !== 'NotAllowedError') throw err
        playerInstance.setState(PlayerState.Paused)
      })
    } else if (state === PlayerState.Paused) {
      video.pause()
      audio.pause()
    } else if (state === PlayerState.Ended) {
      video.pause()
      video.currentTime = Infinity
      audio.pause()
      audio.currentTime = Infinity
    }
  }, [video, audio, state])

  // Seek
  useEffect(
    () =>
      playerInstance.onSeek(timeMS => {
        // video.pause()
        video.currentTime = timeMS / 1000
        // audio.pause()
        audio.currentTime = timeMS / 1000
      }),
    [playerInstance, audio, video],
  )

  // Playback rate
  const { playbackRate } = usePlaybackRate(playerInstance)
  useEffect(() => {
    video.playbackRate = playbackRate
    audio.playbackRate = playbackRate
  }, [video, audio, playbackRate])

  // Source
  const { source } = useSource(playerInstance)
  useEffect(() => {
    if (!source) {
      video.src = ''
      audio.src = ''
      return
    }
    const videoSource = 'video' in source ? source.video : source
    const audioSource = 'audio' in source ? source.audio : source
    video.src = videoSource.url
    audio.src = audioSource.url

    video.style.setProperty('aspect-ratio', `${videoSource.width} / ${videoSource.height}`)
  }, [video, audio, source])

  // Volume
  const { volume } = useVolume(playerInstance)
  useEffect(() => {
    video.volume = 0
    audio.volume = volume
  }, [video, audio, volume])

  // Synchronize current time and audio/video track
  useEffect(
    onInterval(() => {
      const playbackRate = playerInstance.getPlaybackRate()
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
      if (video.currentTime - currentTime > 0.01) video.playbackRate = playbackRate - synchronizationFactor
      // Video is behind
      else if (video.currentTime - currentTime < -0.01)
        video.playbackRate = playbackRate + synchronizationFactor
      // Video in sync
      else video.playbackRate = playbackRate

      // Update current time
      playerInstance.setCurrentTimeMS(currentTime * 1000)
    }),
    [playerInstance],
  )

  /// Events
  // Waiting
  const { waiting, setWaiting } = useWaiting(playerInstance)
  useEffect(
    onInterval(() => setWaiting(video.readyState < 3 || audio.readyState < 3)),
    [video, audio],
  )
  useEffect(() => {
    if (waiting) {
      video.pause()
      audio.pause()
    } else if (state === PlayerState.Playing) {
      video.play()
      audio.play()
    }
  }, [video, audio, waiting])

  // Duration
  useEffect(
    () =>
      onInterval(() => playerInstance.setDurationMS(Math.min(video.duration * 1000, audio.duration * 1000))),
    [video, audio, playerInstance],
  )

  // Buffered
  useEffect(
    onInterval(() => {
      // Get the time range closest to the current time and calculate the time between current time and end of buffer
      const bufferedRange = Array.from({ length: video.buffered.length }, (_, i) => ({
        start: video.buffered.start(i) * 1000,
        end: video.buffered.end(i) * 1000,
      })).find(
        range =>
          range.start <= playerInstance.getCurrentTimeMS() && range.end >= playerInstance.getCurrentTimeMS(),
      )
      if (!bufferedRange) {
        return playerInstance.setBufferedMS(0)
      }
      playerInstance.setBufferedMS(bufferedRange.end - playerInstance.getCurrentTimeMS())
    }),
    [video, audio, playerInstance],
  )

  /// Cleanup
  useEffect(
    () => () => {
      video.pause()
      audio.pause()
    },
    [video, audio],
  )

  return video
}
