import * as std from '@std'
import { ProviderName } from '@std'

import { combineSomeText } from '@yt/components/text'
import type { Thumbnail } from '@yt/components/thumbnail'
import type { Accessibility } from '@yt/components/utility/accessibility'
import { getBrowseNavigationId, type Navigation } from '@yt/components/utility/navigation'
import { extractNumber } from '@yt/core/helpers'
import type { Renderer } from '@yt/core/internals'
import { getVideoType } from '..'
import type { BaseVideo } from './regular'
import { getLength, getViewedLength, relativeToAbsoluteDate } from './helpers'
import { isVerifiedBadge } from '@yt/components/badge'
import type { WatchEndpoint } from '@yt/components/utility/endpoint'

export function processCompactVideo({ compactVideoRenderer: video }: CompactVideo): std.Video {
  return {
    provider: ProviderName.YT,

    type: getVideoType(video),
    id: video.videoId,

    title: combineSomeText(video.title),
    viewCount: extractNumber(combineSomeText(video.viewCountText)),

    author: {
      name: combineSomeText(video.longBylineText),
      id: getBrowseNavigationId(video.longBylineText),
      avatar: video.channelThumbnail.thumbnails,
      verified: std.verifiedFrom(video.ownerBadges?.some(isVerifiedBadge)),
    },

    staticThumbnail: video.thumbnail.thumbnails,
    animatedThumbnail: video.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails?.thumbnails,

    length: getLength(video.lengthText),
    viewedLength: getViewedLength(video.thumbnailOverlays, getLength(video.lengthText)),

    publishDate: video.publishedTimeText && relativeToAbsoluteDate(combineSomeText(video.publishedTimeText)),
  }
}

export type CompactVideo = Renderer<
  'compactVideo',
  Navigation<WatchEndpoint> &
    Accessibility & {
      /** Thumbnails for channel */
      channelThumbnail: Thumbnail
    } & Pick<
      BaseVideo,
      | 'badges'
      | 'lengthText'
      | 'longBylineText'
      | 'menu'
      | 'ownerBadges'
      | 'publishedTimeText'
      | 'richThumbnail'
      | 'shortBylineText'
      | 'shortViewCountText'
      | 'thumbnail'
      | 'thumbnailOverlays'
      | 'title'
      | 'videoId'
      | 'viewCountText'
    >
>
