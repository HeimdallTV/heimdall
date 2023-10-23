import { prop } from 'ramda';

import { ProviderName } from '@/parser/std';
import * as std from '@std';
import { isVerifiedBadge } from '@yt/components/badge';
import { SubscribeButton } from '@yt/components/button';
import { parseAttributedDescription } from '@yt/components/description/parser';
import { AttributedDescription } from '@yt/components/description/types';
import {
  combineSomeText,
  Text,
} from '@yt/components/text';
import {
  UrlEndpoint,
  WatchEndpoint,
} from '@yt/components/utility/endpoint';
import {
  mapNavigation,
  NavigationSome,
} from '@yt/components/utility/navigation';
import {
  parseViewCount,
  shortHumanReadableToNumber,
} from '@yt/core/helpers';
import {
  headOfSome,
  Renderer,
  Some,
} from '@yt/core/internals';

import {
  SentimentBar,
  VideoActions,
  VideoOwner,
  VideoViewCount,
} from '../types';
import { VideoDetails } from '../types/video-details';
import { parseDate } from './helpers';

export function processFullVideo(id: string, fullVideo: FullVideo, videoDetails: VideoDetails, dislikeCount: number): std.Video {
  const [{ videoPrimaryInfoRenderer: primary }, { videoSecondaryInfoRenderer: secondary }] = fullVideo

  const { dislikeButton, likeButton } =
    primary.videoActions.menuRenderer.topLevelButtons[0].segmentedLikeDislikeButtonRenderer
  const likeCount = parseViewCount(
    headOfSome(likeButton.toggleButtonRenderer.defaultText).accessibility.accessibilityData.label,
  )

  const likeStatus = likeButton.toggleButtonRenderer.isToggled
    ? std.LikeStatus.Like
    : dislikeButton.toggleButtonRenderer.isToggled
    ? std.LikeStatus.Dislike
    : std.LikeStatus.Indifferent

  const owner = secondary.owner.videoOwnerRenderer
  const subscription = secondary.subscribeButton.subscribeButtonRenderer
  const viewCountRenderer = primary.viewCount.videoViewCountRenderer

  return {
    provider: ProviderName.YT,

    // FIXME: Get video type based on video properties
    type: std.VideoType.Static,
    id,
    author: {
      name: combineSomeText(owner.title),
      id: mapNavigation(prop('id'), owner),
      avatar: owner.thumbnail.thumbnails,
      verified: Boolean(owner.badges?.some(isVerifiedBadge))
        ? std.VerifiedStatus.Verified
        : std.VerifiedStatus.Unverified,
      followed: subscription.subscribed,
      followerCount: shortHumanReadableToNumber(combineSomeText(owner.subscriberCountText)),
    },

    title: combineSomeText(primary.title),
    shortDescription: videoDetails.shortDescription,
    description: parseAttributedDescription(secondary.attributedDescription),

    staticThumbnail: videoDetails.thumbnail.thumbnails,

    likeCount,
    dislikeCount,
    likeStatus,
    viewCount: parseViewCount(combineSomeText(viewCountRenderer.viewCount)),

    length: Number(videoDetails.lengthSeconds),
    publishDate: parseDate(combineSomeText(primary.dateText)),
  }
}

export type FullVideo = [VideoPrimaryInfo, VideoSecondaryInfo]

export type VideoPrimaryInfo = Renderer<
  'videoPrimaryInfo',
  {
    dateText: Some<Text>
    videoActions: VideoActions
    sentimentBar: SentimentBar
    title: Some<Text>
    viewCount: VideoViewCount
  }
>

export type VideoSecondaryInfo = Renderer<
  'videoSecondaryInfo',
  {
    attributedDescription: AttributedDescription
    description: Some<NavigationSome<UrlEndpoint | WatchEndpoint, Text>>
    descriptionCollapsedLines: number

    owner: VideoOwner
    showLessText: Some<Text>
    showMoreText: Some<Text>
    subscribeButton: SubscribeButton
  }
>

