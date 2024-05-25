import type { Button } from '@yt/components/button'
import type { ContinuationItem } from '@yt/components/continuation'
import type { ItemSectionWithIdentifier } from '@yt/components/core'
import type { Text } from '@yt/components/text'
import type { Thumbnail } from '@yt/components/thumbnail'
import type { TwoColumnWatchNext } from '@yt/components/two-column'
import type { BrowseEndpoint, UrlEndpoint, WatchEndpoint } from '@yt/components/utility/endpoint'
import type { CurrentVideoEndpoint } from '@yt/components/utility/endpoints'
import type { Navigation, NavigationSome } from '@yt/components/utility/navigation'
import type { BaseResponse } from '@yt/core/api'
import type { Command, Renderer, Some } from '@yt/core/internals'
import type { CompactVideo } from '@yt/video/processors/compact'
import type { VideoPrimaryInfo, VideoSecondaryInfo } from '@yt/video/processors/full'
import type { BaseVideo } from '@yt/video/processors/regular'

export type VideoResponse = BaseResponse & {
  contents: TwoColumnWatchNext<
    [
      VideoPrimaryInfo,
      VideoSecondaryInfo,
      ItemSectionWithIdentifier<Renderer<'commentsEntryPointHeader', { TODO: true }>, 'comments-entry-point'>,
      ItemSectionWithIdentifier<ContinuationItem, 'comment-item-section'>,
    ],
    [ItemSectionWithIdentifier<CompactVideo | ContinuationItem>, Renderer<'relatedChipCloud'>]
  >
  currentVideoEndpoint: CurrentVideoEndpoint
  playerOverlays: Renderer<
    'playerOverlay',
    {
      endScreen: WatchNextEndScreen<EndScreenVideo | EndScreenPlaylist>
      autoplay: PlayerOverlayAutoplay
      decoratedPlayerBarRenderer?: DecoratedPlayerBar
      shareButton: Button<Command<'TODO'>>
      addToMenu: Button<Command<'TODO'>>
      videoDetails: Renderer<'TODO'>
    }
  >
  overlay: Renderer<'tooltip', { TODO: true }>
  engagementPanels: Renderer<'engagementPanelSectionList', { TODO: true }>
}

type DecoratedPlayerBar = Renderer<'decoratedPlayerBar', { playerBar: MultiMarkersPlayerBar }>
type MultiMarkersPlayerBar = Renderer<
  'multiMarkersPlayerBar',
  { markersMap: MarkerMap[]; visibleOnLoad: { key: 'DESCRIPTION_CHAPTERS' } }
>
type MarkerMap = {
  key: 'DESCRIPTION_CHAPTERS'
  value: { chapters: Chapter[]; onChapterRepeat: unknown }
}
type Chapter = Renderer<
  'chapter',
  {
    title: Some<Text>
    timeRangeStartMillis: number
    thumbnail: Thumbnail
    onActiveCommand: Command<'TODO'>
  }
>

type WatchNextEndScreen<Item extends Renderer> = Renderer<'watchNextEndScreen', { results: Item[] }>

type EndScreenVideo = Renderer<
  'endScreenVideo',
  Pick<
    BaseVideo,
    | 'videoId'
    | 'thumbnail'
    | 'title'
    | 'shortBylineText'
    | 'lengthText'
    | 'shortViewCountText'
    | 'publishedTimeText'
    | 'thumbnailOverlays'
  > &
    Navigation<WatchEndpoint> & { lengthInSeconds: number }
>

type EndScreenPlaylist = Renderer<
  'endScreenPlaylist',
  Navigation<WatchEndpoint> & {
    playlistId: string
    title: Some<Text>
    thumbnail: Thumbnail
    longBylineText: Some<Text>
    videoCountText: Some<Text>
    lengthInSeconds: number
  }
>

type PlayerOverlayAutoplay = Renderer<
  'playerOverlayAutoplay',
  {
    byline: Some<NavigationSome<WatchEndpoint | BrowseEndpoint | UrlEndpoint, Text>>
    pauseText: Some<Text>
    background: Thumbnail
    countDownSecs: number
    countDownSecsForFullscreen: number

    cancelButton: Button<Command<'TODO'>>
    nextButton: Button<Command<'TODO'>>
    closeButton: Button<Command<'TODO'>>
    preferImmediateRedirect: boolean
    webShowNewAutonavCountdown?: boolean
    webShowBigThumbnailEndscreen?: boolean
  } & Pick<BaseVideo, 'title' | 'videoId' | 'publishedTimeText' | 'shortViewCountText' | 'thumbnailOverlays'>
>
