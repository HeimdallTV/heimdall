import * as std from '@std'
import {
  fetchVideo,
  fetchRecommended,
  fetchPlayer,
  fetchCompactVideoContinuation,
  fetchSetVideoLike,
  fetchSetVideoDislike,
  fetchSetVideoIndifferent,
  fetchVideoDislikeCount,
  fetchRecommendedContinuation,
} from './api'

import { isLiveBadge, MetadataBadge } from '../components/badge'
import { findRenderer, findRendererRaw, isRenderer, Renderer } from '../core/internals'
import { processFullVideo } from './processors/full'
import { makeContinuationIterator } from '@yt/core/api'
import { RichItem } from '@yt/components/item'
import { processVideo, Video } from './processors/regular'
import { processCompactVideo } from './processors/compact'
import { processPlayer } from './processors/player'
export * from './types'

export async function* getRecommended(): AsyncGenerator<std.Video[]> {
  const recommendedVideosIterator = makeContinuationIterator(
    () =>
      fetchRecommended().then(
        response =>
          response.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer
            .contents,
      ),
    token =>
      fetchRecommendedContinuation(token).then(
        response => response.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems,
      ),
  )
  for await (const recommendedVideos of recommendedVideosIterator) {
    yield recommendedVideos
      .filter((renderer): renderer is RichItem<Video | Renderer<'radio'>> => 'richItemRenderer' in renderer)
      .map(renderer => renderer.richItemRenderer.content)
      .filter(isRenderer('video'))
      .map(processVideo)
  }
}

export async function getVideo(videoId: string): Promise<std.Video> {
  const [videoResponse, playerResponse, dislikeCount] = await Promise.all([
    fetchVideo(videoId),
    fetchPlayer(videoId),
    fetchVideoDislikeCount(videoId),
  ])

  const contents = videoResponse.contents.twoColumnWatchNextResults.results.results.contents
  const primaryInfo = findRendererRaw('videoPrimaryInfo')(contents)
  const secondaryInfo = findRendererRaw('videoSecondaryInfo')(contents)
  if (!primaryInfo || !secondaryInfo) {
    throw Error('Failed to find primary and secondary info in the YT request. Something has gone wrong!')
  }

  const video = processFullVideo(
    videoId,
    [primaryInfo, secondaryInfo],
    playerResponse.videoDetails,
    dislikeCount,
  )

  const relatedVideos = findRenderer('itemSection')(
    videoResponse.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results,
  )!.contents

  const relatedVideosIterator = makeContinuationIterator(
    async () => relatedVideos,
    token =>
      fetchCompactVideoContinuation(token).then(
        response => response.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems,
      ),
  )

  return {
    ...video,
    related: async function* (): AsyncGenerator<std.Video[]> {
      for await (const relatedVideos of relatedVideosIterator) {
        yield relatedVideos.map(processCompactVideo)
      }
    },
  }
}

export const getPlayer = (videoId: string) => fetchPlayer(videoId).then(processPlayer)

export const setVideoLikeStatus = (videoId: string) => (likeStatus: std.LikeStatus) =>
  (likeStatus === std.LikeStatus.Like
    ? fetchSetVideoLike
    : likeStatus === std.LikeStatus.Dislike
    ? fetchSetVideoDislike
    : fetchSetVideoIndifferent)(videoId).then(() => {})

export function getVideoType(video: { badges?: MetadataBadge[] }): std.VideoType {
  const isLive = video.badges?.some(isLiveBadge)
  return isLive ? std.VideoType.Live : std.VideoType.Static
}
