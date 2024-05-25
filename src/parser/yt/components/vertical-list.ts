import type { Renderer, Some } from '@yt/core/internals'
import type { Text } from './text'

export type VerticalList<Item extends Renderer> = Renderer<
  'verticalList',
  { items: Item[]; collapsedItemCount: number; collapsedStateButtonText: Some<Text> }
>
