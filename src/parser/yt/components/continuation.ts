import { BaseResponse } from '@yt/core/api'
import { Action, Command, CommandMetadata, Endpoint, Renderer, SubCommand } from '../core/internals'

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

export type ReloadContinuationItemsCommand<Item extends Renderer> = Command<
  'reloadContinuationItems',
  { continuationItems: (Item | ContinuationItem)[]; targetId: string }
>

export type ContinuationItemsResponse<Action extends SubCommand> = BaseResponse & {
  onResponseReceivedActions: [Action]
}

export type AppendContinuationItemsResponse<Item extends Renderer> = ContinuationItemsResponse<
  AppendContinuationItemsAction<Item>
>
export const getAppendContinuationItemsResponseItems = <Item extends Renderer>(
  response: AppendContinuationItemsResponse<Item>,
) => response.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems

export type ReloadContinuationItemsResponse<Item extends Renderer> = ContinuationItemsResponse<
  ReloadContinuationItemsCommand<Item>
>
export const getReloadContinuationItemsResponseItems = <Item extends Renderer>(
  response: ReloadContinuationItemsResponse<Item>,
) => response.onResponseReceivedActions[0].reloadContinuationItemsCommand.continuationItems
