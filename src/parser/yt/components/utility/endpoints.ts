import type {
  ServiceEndpoint,
  Endpoint,
  Renderer,
  OptionalSubCommand,
  Action,
  CommandMetadata,
} from '../../core/internals'
import type { LikeStatus } from '../like-status'
import type { OpenPopupAction } from './actions'
import type { WatchEndpoint } from './endpoint'

export type SubscribeEndpoint = Endpoint<'subscribe', { channelIds: string[]; params: string }>

export type LikeEndpoint = Endpoint<
  'like',
  {
    /** The current like status */
    status: LikeStatus

    /** The video to be liked or disliked */
    target: { videoId: string }

    /** One of likeParams, dislikeParams, removeLikeParams will be defined depending on the Like Status */
    likeParams?: string
    /** One of likeParams, dislikeParams, removeLikeParams will be defined depending on the Like Status */
    dislikeParams?: string
    /** One of likeParams, dislikeParams, removeLikeParams will be defined depending on the Like Status */
    removeLikeParams?: string
  }
>

export type ShareEntityServiceEndpoint<PopupAction extends OpenPopupAction<Renderer>> = ServiceEndpoint<
  'shareEntity',
  { serializedShareEntity: string },
  PopupAction
>

export type OfflineVideoEndpoint<SubCommand extends OptionalSubCommand = undefined> = Endpoint<
  'offlineVideo',
  { videoId: string },
  SubCommand
>

export type SignalServiceEndpoint<Signal extends string, Actions extends Action> = ServiceEndpoint<
  'signal',
  { signal: Signal },
  Actions
>

export type CurrentVideoEndpoint = Endpoint<'currentVideo', CommandMetadata & WatchEndpoint>
