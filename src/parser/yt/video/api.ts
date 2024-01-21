import * as std from '@std'
import { BrowseId, Endpoint, fetchYt, fetchEndpointContinuation } from '../core/api'
import { CompactContinuationResponse } from './types/responses/compact-continuation'
import { VideoResponse } from './types/responses/video'
import { PlayerResponse } from './types/responses/player'
import { RecommendedResponse } from './types/responses/recommended'
import { AppendContinuationItemsResponse, ContinuationItem } from '@yt/components/continuation'
import { RichItem } from '@yt/components/item'
import { Video } from './processors/regular'
import { Renderer, isCommand } from '@yt/core/internals'
import { fetchProxy } from '@libs/extension'
import { getSigTimestamp } from './processors/player/decoders/signature'

export const fetchRecommended = (): Promise<RecommendedResponse> => {
  console.log('fetchRecommended')
  return fetchYt(Endpoint.Browse, { browseId: BrowseId.Recommended })
}
export const fetchRecommendedContinuation = (
  continuation: string,
): Promise<AppendContinuationItemsResponse<RichItem<Video | Renderer<'radio'>> | ContinuationItem>> =>
  fetchYt(Endpoint.Browse, { continuation })

export const fetchPlayer = async (videoId: string) =>
  fetchYt<PlayerResponse>(Endpoint.Player, {
    videoId,
    // required for signature decoding, see processors/player/decoders/signature.ts
    playbackContext: { contentPlaybackContext: { signatureTimestamp: await getSigTimestamp() } },
  })
export const fetchVideo = (videoId: string) => fetchYt<VideoResponse>(Endpoint.Next, { videoId })
export const fetchCompactVideoContinuation = fetchEndpointContinuation(
  Endpoint.Next,
)<CompactContinuationResponse>

const getLikeButtonParams = async (
  videoId: string,
  currentLikeStatus: std.LikeStatus,
  likeStatus: std.LikeStatus,
) => {
  const useLike =
    (currentLikeStatus === std.LikeStatus.Like && likeStatus === std.LikeStatus.Indifferent) ||
    currentLikeStatus === std.LikeStatus.Like
  const subButtonViewModel =
    likeStatus === std.LikeStatus.Indifferent ? 'toggledButtonViewModel' : 'defaultButtonViewModel'
  const paramName = std.matchLikeStatus(likeStatus, 'likeParams', 'removeLikeParams', 'dislikeParams')

  const video = await fetchVideo(videoId)
  const { likeButtonViewModel: likeButton, dislikeButtonViewModel: dislikeButton } =
    video.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.videoActions
      .menuRenderer.topLevelButtons[0].segmentedLikeDislikeButtonViewModel
  const button = useLike ? likeButton.likeButtonViewModel : dislikeButton.dislikeButtonViewModel
  const commands =
    button.toggleButtonViewModel.toggleButtonViewModel[subButtonViewModel].buttonViewModel.onTap.serialCommand
      .commands
  const command = commands.find(isCommand('innertube'))
  return command?.innertubeCommand.likeEndpoint[paramName]
}
const getLikeEndpoint = (likeStatus: std.LikeStatus) =>
  likeStatus === std.LikeStatus.Like
    ? Endpoint.Like
    : likeStatus === std.LikeStatus.Indifferent
      ? Endpoint.RemoveLike
      : Endpoint.Dislike
// todo: support return youtube dislike
export const fetchSetVideoLikeStatus = (
  videoId: string,
  currentLikeStatus: std.LikeStatus,
  likeStatus: std.LikeStatus,
) =>
  getLikeButtonParams(videoId, currentLikeStatus, likeStatus).then(params =>
    fetchYt(getLikeEndpoint(likeStatus), { target: { videoId }, params }),
  )

export const fetchVideoLikeCounts = (videoId: string) =>
  fetchProxy(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
    .then(res => res.json())
    .then(res => ({ likes: Number(res.likes), dislikes: Number(res.dislikes) }))
