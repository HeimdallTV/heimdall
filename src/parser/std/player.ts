import type { ProviderName, VideoType } from '.'
import type { Image } from './components/image'

export type Player = {
  provider: ProviderName
  type: VideoType
  id: string
  title: string

  sources: Source[]
  segments?: PlayerSegments
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

/// Segments
export type PlayerSegments = {
  /**
   * Used when a video showcases a product, service, or location that
   * they've receieved free or subsidized access to
   **/
  exclusiveAccess: boolean

  categories: {
    id: string
    startTimeMS: number
    endTimeMS: number
    category: PlayerSegmentCategory
    /** if segment is locked */
    locked: number
    /** votes on segment */
    votes: number
    /** duration of video when submission for this category occurred */
    videoDurationMS: number
  }[]

  chapters: {
    id: string
    title: string
    startTimeMS: number
    endTimeMS: number
  }[]

  highlights: {
    id: string
    timestampMS: number
  }[]
}

export enum PlayerSegmentCategory {
  Sponsor = 'sponsor',
  SelfPromo = 'selfpromo',
  Interaction = 'interaction',
  Intro = 'intro',
  Outro = 'outro',
  Preview = 'preview',
  MusicOfftopic = 'music_offtopic',
  Filler = 'filler',
}

export enum PlayerSegmentActionType {
  Skip = 'skip',
  Mute = 'mute',
  POI = 'poi',
  Full = 'full',
  Chapter = 'chapter',
}

/// Sources
export const SourceQualities = [
  { name: '240p', width: 426 },
  { name: '360p', width: 640 },
  { name: '480p', width: 854 },
  { name: '720p', width: 1280 },
  { name: '1080p', width: 1920 },
  { name: '1440p', width: 2560 },
  { name: '4k', width: 3840 },
  { name: '5k', width: 5120 },
  { name: '8k', width: 7680 },
]

export enum SourceType {
  Audio = 'audio',
  Video = 'video',
  AudioVideo = 'audiovideo',
}

export type Source<Type extends SourceType = SourceType> = BaseSource<Type> &
  (Type extends SourceType.Audio | SourceType.AudioVideo ? AudioSource : Record<never, never>) &
  (Type extends SourceType.Video | SourceType.AudioVideo ? VideoSource : Record<never, never>)

type BaseSource<Type extends SourceType> = {
  type: Type
  url: string
  mimetype?: string
}
type AudioSource = { audioBitrate?: number; language?: string; isDefault?: boolean }
type VideoSource = {
  width: number
  height: number
  frameRate: number
  videoBitrate?: number
}

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

/// Closed Captions
export enum ClosedCaptionType {
  /** Overlapping captions where the cues should be concatenated */
  Overlapping = 'overlapping',
  /** Non-overlapping captions where the cues should be displayed in parallel when needed */
  Default = 'default',
}
export type ClosedCaption = {
  /** Whether to use this track as the default for captions */
  isDefault: boolean
  /** The language of the closed captions in the ISO 639-1/2/3 format such as 'en' or 'fr' */
  language: string
} & (
  | {
      /** The type of closed captions */
      type: ClosedCaptionType.Default
      /** Provider specific implementation for fetching and parsing the track */
      getTrack: () => Promise<ClosedCaptionTrackCue[]>
    }
  | {
      /** The type of closed captions */
      type: ClosedCaptionType.Overlapping
      /** Provider specific implementation for fetching and parsing the track */
      getTrack: () => Promise<ClosedCaptionTrackCueLine[]>
    }
)
export type ClosedCaptionTrack = ClosedCaptionTrackCue[] | ClosedCaptionTrackCueLine[]
export type ClosedCaptionTrackCue = {
  text: string
  startTimeMS: number
  endTimeMS: number
}
export type ClosedCaptionTrackCueLine = {
  startTimeMS: number
  endTimeMS: number
  words: ClosedCaptionTrackCueWord[]
}
export type ClosedCaptionTrackCueWord = Omit<ClosedCaptionTrackCue, 'endTimeMS'>
