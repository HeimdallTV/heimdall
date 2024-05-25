import * as std from '@std'
import { BrowseId, Endpoint, fetchYt, fetchEndpointContinuation, getContext } from '../core/api'
import type { CompactContinuationResponse } from './types/responses/compact-continuation'
import type { VideoResponse } from './types/responses/video'
import type { PlayerResponse } from './types/responses/player'
import type { RecommendedResponse } from './types/responses/recommended'
import type { AppendContinuationItemsResponse, ContinuationItem } from '@yt/components/continuation'
import type { RichItem } from '@yt/components/item'
import type { Video } from './processors/regular'
import { type Renderer, isCommand } from '@yt/core/internals'
import { fetchProxy } from '@libs/extension'
import { getSigTimestamp } from './processors/player/decoders/signature'

export const fetchRecommended = (): Promise<RecommendedResponse> => {
  console.log('fetchRecommended')
  return fetchYt(Endpoint.Browse, { browseId: BrowseId.Recommended }).then((val) => {
    console.log('fetchRecommendedResults', val)
    return val
  })
}
export const fetchRecommendedContinuation = (
  continuation: string,
): Promise<AppendContinuationItemsResponse<RichItem<Video | Renderer<'radio'>> | ContinuationItem>> =>
  fetchYt(Endpoint.Browse, { continuation })

export const fetchPlayer = async (videoId: string) =>
  fetchYt<PlayerResponse>(Endpoint.Player, {
    videoId,
    // required for signature decoding, see processors/player/decoders/signature.ts
    playbackContext: {
      contentPlaybackContext: { signatureTimestamp: await getSigTimestamp() },
    },
  })
export const fetchVideo = (videoId: string) => fetchYt<VideoResponse>(Endpoint.Next, { videoId })
export const fetchCompactVideoContinuation = fetchEndpointContinuation(
  Endpoint.Next,
)<CompactContinuationResponse>

/// Like / Dislike
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
// todo: should check the custom YT status code of the response
export const fetchSetVideoLikeStatus = (
  videoId: string,
  currentLikeStatus: std.LikeStatus,
  likeStatus: std.LikeStatus,
) =>
  getLikeButtonParams(videoId, currentLikeStatus, likeStatus)
    .then((params) => fetchYt(getLikeEndpoint(likeStatus), { target: { videoId }, params }))
    .then(() => {})

export const fetchVideoLikeCounts = (videoId: string) =>
  fetchProxy(`https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`)
    .then((res) => res.json())
    .then((res) => ({
      likes: Number(res.likes),
      dislikes: Number(res.dislikes),
    }))

/// Video playback and watch time tracking
const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
/**
 * Generates a nonce in essentially the same way as YT, although it doesn'r really matter
 * how it's generated as far as I can tell
 */
const generateNonce = () =>
  Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
    .map((val) => val & 63)
    .map((val) => dict[val])
    .join('')
const nonceDict: Record<string, string> = {}
// the nonce needs to be consistent so YT can understand the session
// but this code isnt ideal since a user leaving a re-entering a video
// should regenerate the nonce
const getNonce = (videoId: string) => {
  if (!(videoId in nonceDict)) nonceDict[videoId] = generateNonce()
  return nonceDict[videoId]
}

/** Used to mark a video as watched */
export async function fetchPlaybackTracking(videoId: string, currentTimeMS: number, durationMS: number) {
  const player = await fetchPlayer(videoId)
  const playbackURL = new URL(
    player.playbackTracking.videostatsPlaybackUrl.baseUrl.replace('s.youtube.com', 'www.youtube.com'),
  )
  // todo: should be based on each view, not on the videoId
  playbackURL.searchParams.set('cpn', getNonce(videoId))
  playbackURL.searchParams.set('euri', '') // todo: no idea what this means, but it's always empty

  // client context
  playbackURL.searchParams.set('c', getContext().client.clientName)
  playbackURL.searchParams.set('cver', getContext().client.clientVersion)
  playbackURL.searchParams.set('cplayer', getContext().client.clientPlayer)
  playbackURL.searchParams.set('cplatform', getContext().client.clientPlatform)
  playbackURL.searchParams.set('cbr', getContext().client.browserName)
  playbackURL.searchParams.set('cbrver', getContext().client.browserVersion)
  playbackURL.searchParams.set('cos', getContext().client.osName)
  playbackURL.searchParams.set('hl', getContext().client.hl) // language
  playbackURL.searchParams.set('cr', getContext().client.gl) // country code
  playbackURL.searchParams.set('cl', '621358684') // todo: some kind of client id? it was hard coded. regex: "cl: \(\d+\)\.toString\(\)"
  playbackURL.searchParams.set('ver', '2') // version of the tracking API

  // playback info
  playbackURL.searchParams.set('volume', '100')
  playbackURL.searchParams.set('muted', '0')
  playbackURL.searchParams.set('mos', '0') // muted or silenced
  playbackURL.searchParams.set('fs', '0') // fullscreen

  // video info
  playbackURL.searchParams.set('len', (durationMS / 1000).toFixed(3)) // video length
  playbackURL.searchParams.set('cmt', (currentTimeMS / 1000).toFixed(3)) // current media time
  playbackURL.searchParams.set(
    'fmt',
    String(player.streamingData.adaptiveFormats.sort((a, b) => b.bitrate - a.bitrate)[0].itag),
  )
  playbackURL.searchParams.set('lact', String(Math.random() * 100 + 50)) // time since last action (in milliseconds)
  playbackURL.searchParams.set('rt', (Math.random() + 0.1).toFixed(3)) // time secind page load (in seconds)

  await fetchProxy(playbackURL.toString(), {
    headers: { referer: `https://www.youtube.com/watch?v=${videoId}` },
  })
}
/** Reference for the query params:
 * vm: Video Metadata
 * cnp: Client Nonce
 * ei: Event Id
 * docid: Document Id
 * list: Playlist Id
 * aqi: Ad Query Id
 */

/** Used to track watch time */
export async function fetchWatchTimeTracking(
  videoId: string,
  currentTimeMS: number,
  durationMS: number,
  final = false,
) {
  const url = new URL('https://www.youtube.com/api/stats/watchtime')
  url.searchParams.set('ns', 'yt')
  url.searchParams.set('el', 'detailpage')
  url.searchParams.set('cpn', generateNonce())
  url.searchParams.set('docid', getNonce(videoId))
  url.searchParams.set('ver', '2')
  url.searchParams.set('st', (currentTimeMS / 1000).toFixed(3))
  url.searchParams.set('et', (currentTimeMS / 1000).toFixed(3))
  url.searchParams.set('len', (durationMS / 1000).toFixed(3))
  url.searchParams.set('c', getContext().client.clientName)
  url.searchParams.set('cver', getContext().client.clientVersion)
  url.searchParams.set('state', 'playing')
  url.searchParams.set('muted', '0')
  url.searchParams.set('volume', '100')
  // used by youtube when navigating off the page and sets the
  // watch time on the user's history
  if (final) url.searchParams.set('final', '1')
  await fetchProxy(url.toString())
}
