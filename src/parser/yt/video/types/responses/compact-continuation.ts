import type { ContinuationItem } from '@yt/components/continuation'
import type { BaseResponse } from '@yt/core/api'
import type { Action } from '@yt/core/internals'
import type { CompactVideo } from '@yt/video/processors/compact'

export type CompactContinuationResponse = BaseResponse & {
  onResponseReceivedEndpoints: [
    Action<
      'appendContinuationItems',
      {
        continuationItems: (CompactVideo | ContinuationItem)[]
        targetId: string
      }
    >,
  ]
}
