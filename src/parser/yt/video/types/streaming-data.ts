import type { AudioQuality, Quality, QualityLabel } from '.'

export type StreamingData = {
  /** Time until the links no longer work and must be refreshed. ~6 hours as far as I've seen */
  expiresInSeconds: string
  /** Formats that include both audio and video. Limited to 720p 30fps */
  formats: PlayerFormat[]
  /** Formats that include one of audio or video */
  adaptiveFormats: PlayerAdaptiveFormat[]
}

type FormatBase = {
  itag: number
  /** URL to the source. Either this or signatureCipher will be defined */
  url?: string
  /** URL and signature for the source. Either this or url will be defined. In the format s=signature&url=url */
  signatureCipher?: string
  mimeType: string
  bitrate: number
  /** Number formatted as string. Nanoseconds since Unix Epoch. Ex. "1662194668530827" */
  lastModified: string
  /** TODO: What are the alternatives? Maybe for VR? */
  projectionType: 'RECTANGULAR'
  /** Number formatted as string Ex. "1261307" */
  approxDurationMs: string
}

export type PlayerVideoFormat = {
  width: number
  height: number
  fps: number
  quality: Quality
  qualityLabel: QualityLabel
}

export type PlayerAudioFormat = {
  quality: Quality
  audioQuality: AudioQuality
  /** Number formatted as string Ex. "44100" */
  audioSampleRate: '44100'
  audioChannels: number
  audioTrack: {
    audioIsDefault: false
    displayName: string
    /** Language formatted like es-ES.3 */
    id: string
  }
  loudnessDb: number
}

export type PlayerFormat = FormatBase & PlayerVideoFormat & Omit<PlayerAudioFormat, 'loudnessDb'>

export type PlayerAdaptiveFormat = FormatBase & {
  initRange: {
    /** Number formatted as string Ex. "0" */
    start: string
    /** Number formatted as string Ex. "740" */
    end: string
  }
  indexRange: {
    /** Number formatted as string Ex. "0" */
    start: string
    /** Number formatted as string Ex. "740" */
    end: string
  }
  averageBitrate: number
  /** Number formatted as string. Bytes of content Ex. "465721258" */
  contentLength: string
} & (PlayerAudioFormat | PlayerVideoFormat)
