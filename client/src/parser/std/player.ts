import { ProviderName, VideoType } from '.'
import { Image } from './components/image'

export type Player = {
  provider: ProviderName

  type: VideoType
  id: string
  title: string

  sources: Source[]

  closedCaptions: ClosedCaption[]

  /** The static and primary thumbnail for the video. An array of objects for various sizes */
  staticThumbnail: Image[]
  /** The animated thumbnail for the video. An array of objects for various sizes. Can be used for on-hover for example */
  animatedThumbnail?: Image[]

  /** Length of the video or uptime of live stream in seconds */
  length?: number
  /** Length of the video in seconds that has already been viewed */
  viewedLength?: number
  /** Date that the video was published or that the live stream started */
  publishDate?: Date
}

export enum SourceType {
  Audio = 'audio',
  Video = 'video',
  AudioVideo = 'audiovideo',
}

export type Source<Type extends SourceType = SourceType> = BaseSource<Type> &
  (Type extends SourceType.Audio | SourceType.AudioVideo ? AudioSource : {}) &
  (Type extends SourceType.Video | SourceType.AudioVideo ? VideoSource : {})

type BaseSource<Type extends SourceType> = { type: Type; url: string; mimetype?: string }
type AudioSource = { audioBitrate?: number }
type VideoSource = { width: number; height: number; frameRate: number; videoBitrate?: number }

export const isAudioSource = (source: Source): source is Source<SourceType.Audio> =>
  source.type === SourceType.Audio
export const isVideoSource = (source: Source): source is Source<SourceType.Video> =>
  source.type === SourceType.Video
export const isAudioVideoSource = (source: Source): source is Source<SourceType.AudioVideo> =>
  source.type === SourceType.AudioVideo
export const isVideoAndOptionalAudioSource = (
  source: Source,
): source is Source<SourceType.Video | SourceType.AudioVideo> =>
  isVideoSource(source) || isAudioVideoSource(source)
export const isAudioAndOptionalVideoSource = (
  source: Source,
): source is Source<SourceType.Audio | SourceType.AudioVideo> =>
  isAudioSource(source) || isAudioVideoSource(source)

export type ClosedCaption = {
  /** Whether to use this track as the default for captions */
  isDefault: boolean
  /** The language of the closed captions in the ISO 639-1/2/3 format such as 'en' or 'fr' */
  language: string
  /** Provider specific implementation for fetching and parsing the track */
  getTrack: () => Promise<ClosedCaptionTrack>
}

export type ClosedCaptionTrack = ClosedCaptionTrackCue[]

export type ClosedCaptionTrackCue = {
  text: string
  startTimeMS: number
  endTimeMS: number
}
