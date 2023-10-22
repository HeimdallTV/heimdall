import { BaseResponse } from '@yt/core/api'
import { Action, Command, CommandMetadata, Endpoint, Renderer } from '../core/internals'

export type ContinuationItem = Renderer<'continuationItem', { trigger: string } & ContinuationEndpoint>
export type ContinuationCommand = Command<
  'continuation',
  {
    /** The continuation token for use in subsequent requests */
    token: string
    /** Type of continuation request. For example CONTINUATION_REQUEST_TYPE_BROWSE for browse requests */
    request: string
  }
>
export type ContinuationEndpoint = Endpoint<'continuation', ContinuationCommand & CommandMetadata>

export type AppendContinuationItemsAction<Item extends Renderer> = Action<
  'appendContinuationItems',
  { continuationItems: (Item | ContinuationItem)[]; targetId: string }
>

export type ContinuationItemResponse<Item extends Renderer> = BaseResponse & {
  onResponseReceivedActions: [AppendContinuationItemsAction<Item>]
}
export const getContinuationItemResponseItems = <Item extends Renderer>(
  response: ContinuationItemResponse<Item>,
) => response.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems
