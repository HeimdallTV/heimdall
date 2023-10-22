import { Endpoint, Renderer } from "@yt/core/internals"

/** Used for links to reels */
export type ReelWatchEndpoint = Endpoint<
  'reelWatch',
  {
    params?: string
    playerParams?: string
    overlay: Renderer<'reelPlayerOverlay', { TODO: 'TODO' }>
    /** Only seen "REEL_WATCH_SEQUENCE_PROVIDER_RPC" */
    sequenceProvider?: string
    /** Only seen "REEL_WATCH_INPUT_TYPE_SEEDLESS" */
    inputType?: boolean
  }
>
