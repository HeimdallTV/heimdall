import { useHotkeys } from '@mantine/hooks'
import { usePlayerState } from './use'
import { PlayerContext } from '../context'
import { useContext } from 'react'

// todo: doesnt include the volume shortcut because that uses local logic
// todo: closed captions
export const usePlayerHotkeys = (ref: React.RefObject<HTMLElement>) => {
  const player = useContext(PlayerContext)!
  const { state, togglePlay } = usePlayerState(player)

  useHotkeys([
    ['space', () => togglePlay(state)],
    ['k', () => togglePlay(state)],
    ['j', () => player.seekMS.set(player.currentTimeMS.get() - 10_000)],
    ['l', () => player.seekMS.set(player.currentTimeMS.get() + 10_000)],
    [
      'f',
      () =>
        document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(),
    ],
    ['ArrowLeft', () => player.seekMS.set(player.currentTimeMS.get() - 5_000)],
    ['ArrowRight', () => player.seekMS.set(player.currentTimeMS.get() + 5_000)],
    ['ArrowDown', () => player.volume.set(player.volume.get() - 0.1)],
    ['ArrowUp', () => player.volume.set(player.volume.get() + 0.1)],
    ['0', () => player.seekMS.set(0)],
    ['1', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.1)],
    ['2', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.2)],
    ['3', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.3)],
    ['4', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.4)],
    ['5', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.5)],
    ['6', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.6)],
    ['7', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.7)],
    ['8', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.8)],
    ['9', () => player.seekMS.set((player.durationMS.get() ?? 0) * 0.9)],
  ])
}
