import { SomeOptions } from '../../core/internals'

// TODO: Adopt the renderer, endpoint, command system?
// TODO: Remove this file since we don't want tracking info? Or do we?
export type Tracking = { trackingParams: string }
export type TrackingSome<T extends SomeOptions<{}, {}>> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Tracking & U, Tracking & V>
  : never

export type ClickTracking = { clickTrackingParams: string }
export type ClickTrackingSome<T extends SomeOptions<{}, {}>> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<ClickTracking & U, ClickTracking & V>
  : never
