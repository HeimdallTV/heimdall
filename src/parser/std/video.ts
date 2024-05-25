import type { Image } from './components/image'
import type { User, LikeStatus, ProviderName } from '.'
import type { Playlist } from './playlist'
import type { RichText } from './components/rich-text'

export enum VideoType {
  Live = 'live',
  Static = 'static',
  Clip = 'clip',
}

export type Video = {
  provider: ProviderName

  type: VideoType
  id: string

  title: string
  shortDescription?: string
  description?: RichText
  viewCount?: number
  subscriberOnly?: boolean

  likeStatus?: LikeStatus
  likeCount?: number
  dislikeCount?: number

  author?: User

  /** The static and primary thumbnail for the video. An array of objects for various sizes */
  staticThumbnail: Image[]
  /** The animated thumbnail for the video. An array of objects for various sizes. Can be used for on-hover for example */
  animatedThumbnail?: Image[]

  /** Videos related to this video */
  related?: () => AsyncGenerator<(Video | User | Playlist)[]>

  /** Length of the video or uptime of live stream in seconds */
  length?: number
  /** Length of the video in seconds that has already been viewed */
  viewedLength?: number
  /** Date that the video was uploaded or that the live stream started */
  publishDate?: Date
}

export type HistoryVideos = { date: Date; videos: Video[] }
