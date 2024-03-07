import * as std from '@std'

import { findRenderer, Renderer } from '@yt/core/internals'
import { BaseVideo } from './regular'
import { combineSomeText } from '@yt/components/text'
import { extractNumber } from '@yt/core/helpers'
import { ProviderName } from '@std'
import { getLength, getViewedLength, relativeToAbsoluteDate } from './helpers'
import { getVideoType } from '..'
import { isMembersOnlyBadge } from '../../components/badge'

/**
 * Currently cannot parse/doesn't handle live streams and upcoming events
 * todo: unused
 */
export function processGridVideo({ gridVideoRenderer: video }: GridVideo): std.Video {
  const lengthText = findRenderer('thumbnailOverlayTimeStatus')(video.thumbnailOverlays)?.text
  if (!lengthText) throw Error('Grid video did not contain thumbnail overlay time status') // TODO: Why is this here

  console.log(video)

  return {
    provider: ProviderName.YT,

    type: getVideoType(video),
    id: video.videoId,

    title: combineSomeText(video.title),
    viewCount: video.viewCountText && extractNumber(combineSomeText(video.viewCountText)),
    subscriberOnly: video.badges?.some(isMembersOnlyBadge),

    staticThumbnail: video.thumbnail.thumbnails,
    animatedThumbnail: video.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails?.thumbnails,

    length: getLength(lengthText),
    viewedLength: getViewedLength(video.thumbnailOverlays, getLength(lengthText)),

    publishDate: video.publishedTimeText && relativeToAbsoluteDate(combineSomeText(video.publishedTimeText)),
  }
}

export type GridVideo = Renderer<
  'gridVideo',
  Pick<
    BaseVideo,
    | 'badges'
    | 'menu'
    | 'navigationEndpoint'
    | 'ownerBadges'
    | 'publishedTimeText'
    | 'richThumbnail'
    | 'shortBylineText'
    | 'shortViewCountText'
    | 'thumbnail'
    | 'thumbnailOverlays'
    | 'title'
    | 'trackingParams'
    | 'videoId'
    | 'viewCountText'
  >
>
