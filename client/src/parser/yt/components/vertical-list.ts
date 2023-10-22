import { Renderer, Some } from '@yt/core/internals'
import { Text } from './text'

export type VerticalList<Item extends Renderer> = Renderer<
  'verticalList',
  { items: Item[]; collapsedItemCount: number; collapsedStateButtonText: Some<Text> }
>
