import type { BaseResponse } from '@yt/core/api'
import type { Renderer } from '@yt/core/internals'
import type { MicroFormat } from '../micro-format'
import type { PlayerConfig } from '../player-config'
import type { StreamingData } from '../streaming-data'
import type { VideoDetails } from '../video-details'
import type { PlayerCaptionsTracklist } from '../captions'

export type PlayerResponse = BaseResponse & {
  playabilityStatus: {
    status: 'OK'
    playableInEmbed: boolean
    /** Omitted */
    offlineability: Record<string, unknown>
    miniPlayer: Renderer<'TODO'>
    contextParams: string
  }
  /** Endpoints for tracking playback */
  playbackTracking: PlaybackTracking
  /** Available formats and links to resources */
  streamingData: StreamingData
  videoDetails: VideoDetails
  microformat: MicroFormat

  /** Renderers for the items that show up at the end of the video */
  endscreen: Renderer<
    'endscreen',
    {
      elements: Renderer<'endscreenElement', Record<string, unknown>>
      startMs: string
    }
  >

  videoQualityPromoSupportedRenderers: Record<string, unknown>
  captions?: PlayerCaptionsTracklist
  storyboards: Renderer<'playerStoryboardSpec', { spec: string }>
  heartbeatParams: Record<string, unknown>
  attestation: Record<string, unknown>
  annotations: Record<string, unknown>[]
  playerConfig: PlayerConfig
}

type BaseUrl = { baseUrl: string }
type PlaybackTracking = {
  atrUrl: BaseUrl
  googleRemarkerUrl: BaseUrl
  ptrackingUrl: BaseUrl
  qoeUrl: BaseUrl

  videostatsDefaultFlushIntervalSeconds: number
  videostatsDelayplayUrl: BaseUrl
  videostatsPlaybackUrl: BaseUrl
  videostatsScheduledFlushIntervalSeconds: number[]
  videostatsWatchtimeUrl: BaseUrl
  youtubeRemarketingUrl: BaseUrl
}
