import { Button } from '@yt/components/button'
import { ContinuationItem } from '@yt/components/continuation'
import { ItemSection } from '@yt/components/core'
import { Text } from '@yt/components/text'
import { Thumbnail } from '@yt/components/thumbnail'
import { TwoColumnWatchNext } from '@yt/components/two-column'
import { BrowseEndpoint, UrlEndpoint, WatchEndpoint } from '@yt/components/utility/endpoint'
import { CurrentVideoEndpoint } from '@yt/components/utility/endpoints'
import { Navigation, NavigationSome } from '@yt/components/utility/navigation'
import { BaseResponse } from '@yt/core/api'
import { Command, Renderer, Some } from '@yt/core/internals'
import { CompactVideo } from '@yt/video/processors/compact'
import { VideoPrimaryInfo, VideoSecondaryInfo } from '@yt/video/processors/full'
import { BaseVideo } from '@yt/video/processors/regular'

export type VideoResponse = BaseResponse & {
  contents: TwoColumnWatchNext<
    [
      VideoPrimaryInfo,
      VideoSecondaryInfo,
      ItemSection<Renderer<'commentsEntryPointHeader', { TODO: true }>, 'comments-entry-point'>,
      ItemSection<ContinuationItem, 'comment-item-section'>,
    ],
    [ItemSection<CompactVideo | ContinuationItem>, Renderer<'relatedChipCloud'>]
  >
  currentVideoEndpoint: CurrentVideoEndpoint
  playerOverlays: Renderer<
    'playerOverlay',
    {
      endScreen: WatchNextEndScreen<EndScreenVideo | EndScreenPlaylist>
      autoplay: PlayerOverlayAutoplay
      shareButton: Button<Command<'TODO'>>
      addToMenu: Button<Command<'TODO'>>
      videoDetails: Renderer<'TODO'>
    }
  >

  overlay: Renderer<'tooltip', { TODO: true }>
  engagementPanels: Renderer<'engagementPanelSectionList', { TODO: true }>
}

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
