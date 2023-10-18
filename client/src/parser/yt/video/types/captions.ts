import { Text } from '@yt/components/text'
import { Renderer, Some } from '@yt/core/internals'

export type CaptionTrack = {
  /** URL to the caption track */
  baseUrl: string
  /** Name of the close captions in the UI */
  name: Some<Text>
  /**
   * An identifier for the type of close captions.
   * For example, .en means manually created closed captions while a.en means automatically generated
   */
  vssId: string
  /** Language code in the ISO 639-1/2/3 format such as 'en' or 'fr' */
  languageCode: string
  /** Whether YouTube will attempt to translate the captions for other languages */
  isTranslatable: boolean
}

export type TranslationLanguage = {
  /** The language code in the ISO 639-1/2/3 format such as 'en' or 'fr' */
  languageCode: string
  /** The name of the language in the UI */
  languageName: Some<Text>
}

export type AudioTrack = {
  /** Which indices of the caption tracks that apply to this audio track */
  captionTrackIndices: number[]
  /** The index of the default caption track to use */
  defaultCaptionTrackIndex: number
  /** TODO Not sure what this means or what values it could have */
  visibility: 'UNKNOWN'
  hasDefaultTrack: boolean
  /**
   * A hint regarding whether captions should be enabled.
   * TODO Not sure what other values it can have.
   */
  captionsInitialState: 'CAPTIONS_INITIAL_STATE_OFF_RECOMMENDED'
}

export type PlayerCaptionsTracklist = Renderer<
  'playerCaptionsTracklist',
  {
    captionTracks: CaptionTrack[]
    translationLanguages: TranslationLanguage[]

    audioTracks: AudioTrack[]
    defaultAudioTrackIndex: number
  }
>
