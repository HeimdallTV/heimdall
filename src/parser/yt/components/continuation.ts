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
export type ContinuationItemsResponse<Action extends SubCommand> = BaseResponse &
  ({ onResponseReceivedActions: [Action] } | { onResponseReceivedEndpoints: [Action] })

export type AppendContinuationItemsAction<Item extends Renderer> = Action<
  'appendContinuationItems',
  { continuationItems: (Item | ContinuationItem)[]; targetId: string }
>
export type AppendContinuationItemsResponse<Item extends Renderer> = ContinuationItemsResponse<
  AppendContinuationItemsAction<Item>
>
export const getAppendContinuationItemsResponseItems = <Item extends Renderer, DesiredItem extends Item>(
  response: AppendContinuationItemsResponse<Item>,
  find: (item: Item | ContinuationItem) => item is DesiredItem = (item): item is DesiredItem => true,
) => {
  const commands =
    'onResponseReceivedActions' in response
      ? response.onResponseReceivedActions
      : response.onResponseReceivedEndpoints
  const command = commands.find(command => command.appendContinuationItemsAction.continuationItems.some(find))
  if (!command) {
    throw new Error('Failed to find onResponseReceivedActions/Endpoints command that satisfies the predicate')
  }
  return command.appendContinuationItemsAction.continuationItems
}

export type ReloadContinuationItemsCommand<Item extends Renderer> = Command<
  'reloadContinuationItems',
  { continuationItems: (Item | ContinuationItem)[]; targetId: string }
>
export type ReloadContinuationItemsResponse<Item extends Renderer> = ContinuationItemsResponse<
  ReloadContinuationItemsCommand<Item>
>
export const getReloadContinuationItemsResponseItems = <Item extends Renderer, DesiredItem extends Item>(
  response: ReloadContinuationItemsResponse<Item>,
  find: (item: Item | ContinuationItem) => item is DesiredItem = (item): item is DesiredItem => true,
): (DesiredItem | ContinuationItem)[] => {
  console.log('response', response)
  const commands =
    'onResponseReceivedActions' in response
      ? response.onResponseReceivedActions
      : response.onResponseReceivedEndpoints
  const command = commands.find(command =>
    command.reloadContinuationItemsCommand.continuationItems.some(find),
  )
  if (!command) {
    throw new Error('Failed to find onResponseReceivedActions/Endpoints command that satisfies the predicate')
  }
  return command.reloadContinuationItemsCommand.continuationItems as (DesiredItem | ContinuationItem)[]
}
