import * as std from '@std'
import {
  fetchVideo,
  fetchRecommended,
  fetchPlayer,
  fetchCompactVideoContinuation,
  fetchSetVideoLikeStatus,
  fetchVideoLikeCounts,
  fetchRecommendedContinuation,
} from './api'
import { fetchSponsorBlock } from './sponsorblock'

import { isLiveBadge, type MetadataBadge } from '../components/badge'
import { findRenderer, findRendererRaw, isRenderer, type Renderer } from '../core/internals'
import { processFullVideo } from './processors/full'
import { makeContinuationIterator } from '@yt/core/api'
import type { RichItem } from '@yt/components/item'
import { processVideo, type Video } from './processors/regular'
import { processCompactVideo } from './processors/compact'
import { processPlayer } from './processors/player'
import { getContinuationResponseItems } from '../components/continuation'
import { isLiveThumbnailOverlay, type ThumbnailOverlays } from '../components/thumbnail'
export * from './types'

export async function* listRecommended(): AsyncGenerator<std.Video[]> {
  const recommendedVideosIterator = makeContinuationIterator(
    () =>
      fetchRecommended().then(
        (response) =>
          response.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer
            .contents,
      ),
    (token) => fetchRecommendedContinuation(token).then(getContinuationResponseItems),
  )
  for await (const recommendedVideos of recommendedVideosIterator) {
    yield recommendedVideos
      .filter((renderer): renderer is RichItem<Video | Renderer<'radio'>> => 'richItemRenderer' in renderer)
      .map((renderer) => renderer.richItemRenderer.content)
      .filter(isRenderer('video'))
      .map(processVideo)
  }
}

export async function getVideo(videoId: string): Promise<std.Video> {
  console.log('getVideo', videoId)
  const [videoResponse, playerResponse, likeCounts] = await Promise.all([
    fetchVideo(videoId),
    fetchPlayer(videoId),
    fetchVideoLikeCounts(videoId),
  ])

  const contents = videoResponse.contents.twoColumnWatchNextResults.results.results.contents
  const primaryInfo = findRendererRaw('videoPrimaryInfo')(contents)
  const secondaryInfo = findRendererRaw('videoSecondaryInfo')(contents)
  if (!primaryInfo || !secondaryInfo) {
    throw Error('Failed to find primary and secondary info in the YT request')
  }

  const video = processFullVideo(
    videoId,
    [primaryInfo, secondaryInfo],
    playerResponse.videoDetails,
    likeCounts.likes,
    likeCounts.dislikes,
  )

  const relatedVideos = findRenderer('itemSection')(
    videoResponse.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results,
  )!.contents

  const relatedVideosIterator = makeContinuationIterator(
    async () => relatedVideos,
    (token) => fetchCompactVideoContinuation(token).then(getContinuationResponseItems),
  )

  console.log(video)

  return {
    ...video,
    related: async function* (): AsyncGenerator<std.Video[]> {
      for await (const relatedVideos of relatedVideosIterator) {
        // todo: handle compactPlaylistRenderer
        yield relatedVideos.filter(isRenderer('compactVideo')).map(processCompactVideo)
      }
    },
  }
}

export async function getPlayer(videoId: string) {
  const [player, segments] = await Promise.all([
    fetchPlayer(videoId).then(processPlayer),
    fetchSponsorBlock(videoId),
  ])
  return { ...player, segments }
}

export const setVideoLikeStatus = async (
  videoId: string,
  currentLikeStatus: std.LikeStatus,
  likeStatus: std.LikeStatus,
) => fetchSetVideoLikeStatus(videoId, currentLikeStatus, likeStatus)

export function getVideoType(video: {
  badges?: MetadataBadge[]
  thumbnailOverlays?: ThumbnailOverlays[]
}): std.VideoType {
  const isLive = video.badges?.some(isLiveBadge) || video.thumbnailOverlays?.some(isLiveThumbnailOverlay)
  return isLive ? std.VideoType.Live : std.VideoType.Static
}
