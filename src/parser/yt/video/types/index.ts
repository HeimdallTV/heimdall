import { SegmentedLikeDislikeButton } from '../../components/button'
import { Text } from '../../components/text'
import { Thumbnail } from '../../components/thumbnail'
import { Renderer, Some } from '../../core/internals'
import { Accessibility } from '../../components/utility/accessibility'
import { Navigation, NavigationSome } from '../../components/utility/navigation'
import { BrowseEndpoint } from '@yt/components/utility/endpoint'
import { Tracking } from '../../components/utility/tracking'
import { MetadataBadge } from '@yt/components/badge'

export type VideoViewCount = Renderer<
  'videoViewCount',
  {
    viewCount: Some<Text>
    shortViewCount: Some<Text>
  }
>

export type SentimentBar = Renderer<
  'sentimentBar',
  {
    likeStatus: 'INDIFFERENT'
    percentIfDisliked: number
    percentIfIndifferent: number
    percentIfLiked: number
    /** likes / dislikes Ex. 2,129 / 30. TODO: Check if this changed since dislikes disabled */
    tooltip: string
  }
>

type Menu<FlexibleItems, Items, TopLevelButtons> = Renderer<
  'menu',
  Accessibility &
    Tracking & {
      flexibleItems: FlexibleItems
      items: Items
      topLevelButtons: TopLevelButtons
    }
>

export type VideoActions = Menu<
  // MenuFlexibleItem,
  unknown,
  // MenuServiceItem[],
  unknown,
  [SegmentedLikeDislikeButton /* ShareButtonRenderer, AddToPlaylistRenderer */]
>

export type VideoOwner = Renderer<
  'videoOwner',
  Navigation & {
    badges?: MetadataBadge[]
    subscriberCountText: Some<Text>
    subscriptionButton: {
      type: 'FREE'
    }
    thumbnail: Thumbnail
    title: Some<NavigationSome<BrowseEndpoint, Text>>
  }
>

export type Quality =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'hd720'
  | 'hd1080'
  | 'hd1440'
  | 'hd2160'
  | 'highres'

export type QualityLabel =
  | '144p'
  | '240p'
  | '360p'
  | '480p'
  | '720p'
  | '720p60'
  | '1080p'
  | '1080p60'
  | '1440p'
  | '1440p60'
  | '2160p'
  | '2160p60'
  | '4320p'
  | '4320p60'

/** TODO: Can it be 'AUDIO_QUALITY_HIGH' */
export type AudioQuality = 'AUDIO_QUALITY_LOW' | 'AUDIO_QUALITY_MEDIUM'
