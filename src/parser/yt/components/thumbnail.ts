import { type Renderer, type Some, isRenderer } from '../core/internals'
import type { Accessibility } from './utility/accessibility'
import type { Navigation } from './utility/navigation'
import { type Text, combineSomeText } from './text'
import type { Icon } from './icon'

export type ThumbnailVariant = {
  /** Absolute url */
  url: string
  width?: number
  height?: number
}

export type Thumbnail = {
  thumbnails: ThumbnailVariant[]
}

export type MovingThumbnail = Renderer<
  'movingThumbnail',
  {
    enabledHoveredLogging: boolean
    enableOverlay: boolean
    movingThumbnailDetails?: {
      thumbnails: ThumbnailVariant[]
      logAsMovingThumbnail: boolean
    }
  }
>

export type ChannelThumbnailWithLink = Renderer<
  'channelThumbnailWithLink',
  Accessibility &
    Navigation & {
      thumbnail: Thumbnail
    }
>

export type ThumbnailOverlayTimeStatus = Renderer<
  'thumbnailOverlayTimeStatus',
  {
    text: Some<Accessibility<Text>>
    style: string
  }
>
export type ThumbnailOverlayResumePlayback = Renderer<
  'thumbnailOverlayResumePlayback',
  { percentDurationWatched: number }
>
export type ThumbnailOverlayNowPlaying = Renderer<'thumbnailOverlayNowPlaying', { text: Some<Text> }>
export type ThumbnailOverlayHoverText = Renderer<
  'thumbnailOverlayHoverText',
  { text: Some<Text>; icon: Icon }
>
export type ThumbnailOverlayBottomPanel = Renderer<
  'thumbnailOverlayBottomPanel',
  { text: Some<Text>; icon: Icon }
>

export type ThumbnailOverlays =
  | ThumbnailOverlayTimeStatus
  | ThumbnailOverlayResumePlayback
  | ThumbnailOverlayNowPlaying
  | ThumbnailOverlayHoverText
  | ThumbnailOverlayBottomPanel

export const isLiveThumbnailOverlay = (overlay: ThumbnailOverlays): overlay is ThumbnailOverlayNowPlaying =>
  isRenderer('thumbnailOverlayTimeStatus')(overlay) &&
  combineSomeText(overlay.thumbnailOverlayTimeStatusRenderer.text) === 'LIVE'
