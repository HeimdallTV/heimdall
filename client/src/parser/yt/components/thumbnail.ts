import { Renderer, Some } from '../core/internals'
import { Accessibility } from './utility/accessibility'
import { Navigation } from './utility/navigation'
import { Text } from './text'

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

export type ThumbnailOverlayNowPlaying = Renderer<
  'thumbnailOverlayNowPlaying',
  { text: Some<Text> }
>
