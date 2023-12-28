import { ProviderName, VideoType } from '.'
import { Image } from './components/image'

export type Player = {
  provider: ProviderName

  type: VideoType
  id: string
  title: string

  sources: Source[]

  segments?: PlayerSkipSegments

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

export type PlayerSkipSegments = {
  fullVideoCategory?: PlayerSkipSegmentCategory

  skipSegments: {
    UUID: string

    startTimeMs: number
    endTimeMs: number

    category: PlayerSkipSegmentCategory

    /** if segment is locked */
    locked: number

    /** votes on segment */
    votes: number

    /** duration of video when submissions occurred */
    videoDuration: number
  }[]

  chapters: {
    UUID: string

    startTimeMs: number
    endTimeMs: number

    title: string
  }[]

  highlights: {
    UUID: string
    timestampMs: number
  }[]
}

export enum PlayerSkipSegmentCategory {
  Sponsor = 'sponsor',
  SelfPromo = 'selfpromo',
  Interaction = 'interaction',
  Intro = 'intro',
  Outro = 'outro',
  Preview = 'preview',
  MusicOfftopic = 'music_offtopic',
  Filler = 'filler',
  POI = 'poi_highlight',
  ExclusiveAccess = 'exclusive_access',
  Chapter = 'chapter',
}

export enum PlayerSkipSegmentActionType {
  Skip = 'skip',
  Mute = 'mute',
  POI = 'poi',
  Full = 'full',
  Chapter = 'chapter',
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
