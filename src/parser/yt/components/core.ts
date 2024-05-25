import type { Renderer, Some } from '../core/internals'
import type { Navigation } from './utility/navigation'
import type { Text } from './text'
import type { Tracking } from './utility/tracking'

// TODO: remove tracking

export type Shelf<Content extends Renderer> = Renderer<
  'shelf',
  Tracking &
    Partial<Navigation> & {
      title: Some<Text>
      subtitle?: Some<Text>
      content: Content
      // TODO: playAllButton
    }
>

export type SectionList<Content extends Renderer> = Renderer<
  'sectionList',
  Tracking & {
    contents: Content[]
    subMenu?: Record<never, never> // On Channel Videos tab
    targetId: string
  }
>

export type HorizontalList<Item extends Renderer> = Renderer<
  'horizontalList',
  Tracking & {
    items: Item[]
  }
>

export type ItemSection<Content extends Renderer> = Renderer<
  'itemSection',
  Tracking & {
    contents: Content[]
  }
>

export type ItemSectionWithIdentifier<
  Content extends Renderer,
  Identifier extends string | undefined = undefined,
> = Renderer<
  'itemSection',
  Tracking & {
    contents: Content[]
    sectionIdentifier: Identifier
  }
>

export type ItemSectionHeader = Renderer<'itemSectionHeader', Tracking & { title: Some<Text> }>
export type ItemSectionWithHeader<Content extends Renderer> = Renderer<
  'itemSection',
  Tracking & { contents: Content[]; header: ItemSectionHeader }
>
