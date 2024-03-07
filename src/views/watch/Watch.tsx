import styled from 'styled-components'
import { useEffect, useMemo } from 'react'

import { useAsync } from '@/hooks/useAsync'
import { getPlayer as fetchPlayer, getVideo as fetchVideo } from '@yt/video'
import { Player } from './player/Player'
import { WatchInfo } from './WatchInfo'
import { PlayerContext } from './player/context'
import { PlayerInstanceOptions, usePlayerInstance } from './player/hooks/usePlayerInstance'
import { useSearch } from 'wouter'
import { useAtom } from 'jotai'
import { playerAtom } from '@/settings'

const WatchContainer = styled.main`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: 16px;
  }
`

const getStartTimeFromQuery = (query: URLSearchParams) => {
  if (!query.has('t')) return undefined
  const startTimeSecondsQuery = parseInt(query.get('t') ?? '')
  if (Number.isNaN(startTimeSecondsQuery)) return undefined
  return startTimeSecondsQuery * 1000
}

export default function Watch({ params: { videoId } }: { params: { videoId: string } }) {
  // Video and player data
  const { data: video, error: videoError } = useAsync(() => fetchVideo(videoId), [videoId])
  const { data: player, error: playerError } = useAsync(() => fetchPlayer(videoId), [videoId])
  useEffect(() => {
    if (videoError) console.error(videoError)
    if (playerError) console.error(playerError)
  }, [videoError, playerError])

  // Player init
  const query = useSearch()
  const [playerSettings] = useAtom(playerAtom)
  // Using the playerSettings as a dependency would resule
  // in re-rendering when the default quality changes
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const playerOptions = useMemo<PlayerInstanceOptions>(
    () => ({
      startTimeMS: getStartTimeFromQuery(new URLSearchParams(query)),
      defaultVideoWidth: playerSettings.defaultQuality,
    }),
    [query],
  )
  const playerInstance = usePlayerInstance(player, playerOptions)

  return (
    <PlayerContext.Provider value={playerInstance}>
      <WatchContainer>
        <Player />
        <WatchInfo video={video} />
      </WatchContainer>
    </PlayerContext.Provider>
  )
}
