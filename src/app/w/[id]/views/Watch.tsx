'use client'

import { pipe } from 'fp-ts/function'
import { useParams } from 'react-router'
import styled from 'styled-components'
import useSWR from 'swr'

import { useAsync } from '@/hooks/useAsync'
import { matchAsync, matchSWR } from '@libs/extension'
import { getPlayer as fetchPlayer, getVideo as fetchVideo } from '@yt/video'

import { Player } from './player/Player'
import { WatchInfo } from './WatchInfo'

const VideoContainer = styled('section')`
  height: calc(100vh - 53px);

  > iframe {
    width: 100vw;
    height: min(87vh, calc(100vw / 16 * 9));
  }

  > * + * {
    margin-top: 16px;
  }
`

const PlayerWrapper: React.FC<{ videoId: string }> = ({ videoId }) => {
  const player = pipe(
    useAsync(() => fetchPlayer(videoId)),
    matchAsync(
      player => player,
      err => console.error(err),
      () => console.log('loading'),
    ),
  )
  return <>{player && <Player player={player} />}</>
}

const Watch = ({ videoId }: { videoId: string }) => {
  const params = useParams()
  const Video = pipe(
    useSWR(videoId, fetchVideo),
    matchSWR(
      video => <WatchInfo video={video} />,
      () => 'Failed while loading video data',
      () => 'Loading...',
    ),
  )

  return (
    <VideoContainer>
      <PlayerWrapper videoId={params.id!} />
      {Video}
    </VideoContainer>
  )
}

export default Watch
