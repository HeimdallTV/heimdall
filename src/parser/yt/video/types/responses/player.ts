import { BaseResponse } from '@yt/core/api'
import { Renderer } from '@yt/core/internals'
import { MicroFormat } from '../micro-format'
import { PlayerConfig } from '../player-config'
import { StreamingData } from '../streaming-data'
import { VideoDetails } from '../video-details'
import { PlayerCaptionsTracklist } from '../captions'

export type PlayerResponse = BaseResponse & {
  playabilityStatus: {
    status: 'OK'
    playableInEmbed: boolean
    /** Omitted */
    offlineability: Record<string, unknown>
    miniPlayer: Renderer<'TODO'>
    contextParams: string
  }
  /** Available formats and links to resources */
  streamingData: StreamingData
  videoDetails: VideoDetails
  microformat: MicroFormat

  /** Renderers for the items that show up at the end of the video */
  endscreen: Renderer<
    'endscreen',
    { elements: Renderer<'endscreenElement', Record<string, unknown>>; startMs: string }
  >

  videoQualityPromoSupportedRenderers: Record<string, unknown>
  captions: PlayerCaptionsTracklist
  storyboards: Renderer<'playerStoryboardSpec', { spec: string }>
  heartbeatParams: Record<string, unknown>
  playbackTracking: Record<string, unknown>
  attestation: Record<string, unknown>
  annotations: Record<string, unknown>[]
  playerConfig: PlayerConfig
}
