import type { Renderer } from '../core/internals'

export type TwoColumnSearchResults<Item extends Renderer> = Renderer<
  'twoColumnSearchResults',
  { primaryContents: Item }
>

export type TwoColumnBrowseResults<Tabs extends Renderer> = Renderer<
  'twoColumnBrowseResults',
  { tabs: Tabs[] }
>

export type TwoColumnWatchNext<Items extends Renderer[], SecondaryItems extends Renderer[]> = {
  twoColumnWatchNextResults: {
    results: {
      results: {
        contents: Items
      }
    }
    secondaryResults: {
      secondaryResults: {
        results: SecondaryItems
      }
    }
    autoplay: {
      autoplay: {
        sets: Record<string, unknown>[] // TODO:
        countDownSecs: number
      }
    }
  }
}
