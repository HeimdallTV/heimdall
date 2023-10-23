import { BrowseId, Endpoint, fetchYt, fetchEndpointContinuation } from '../core/api'
import { CompactContinuationResponse } from './types/responses/compact-continuation'
import { VideoResponse } from './types/responses/video'
import { PlayerResponse } from './types/responses/player'
import { RecommendedResponse } from './types/responses/recommended'
import { AppendContinuationItemsResponse, ContinuationItem } from '@yt/components/continuation'
import { RichItem } from '@yt/components/item'
import { Video } from './processors/regular'
import { Renderer } from '@yt/core/internals'
import { fetchProxy } from '@libs/extension'

export const fetchRecommended = (): Promise<RecommendedResponse> =>
  fetchYt(Endpoint.Browse, { browseId: BrowseId.Recommended })
export const fetchRecommendedContinuation = (
  continuation: string,
): Promise<AppendContinuationItemsResponse<RichItem<Video | Renderer<'radio'>> | ContinuationItem>> =>
  fetchYt(Endpoint.Browse, { continuation })

export const fetchPlayer = (videoId: string) => fetchYt<PlayerResponse>(Endpoint.Player, { videoId })
export const fetchVideo = (videoId: string) => fetchYt<VideoResponse>(Endpoint.Next, { videoId })
export const fetchCompactVideoContinuation = fetchEndpointContinuation(
  Endpoint.Next,
)<CompactContinuationResponse>

export const fetchSetVideoLike = (videoId: string) => fetchYt(Endpoint.Like, { target: { videoId } })
export const fetchSetVideoDislike = (videoId: string) => fetchYt(Endpoint.Like, { target: { videoId } })
export const fetchSetVideoIndifferent = (videoId: string) => fetchYt(Endpoint.Like, { target: { videoId } })

export const fetchVideoDislikeCount = (videoId: string) =>
  fetchProxy(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
    .then(res => res.json())
    .then(res => Number(res.dislikes))
