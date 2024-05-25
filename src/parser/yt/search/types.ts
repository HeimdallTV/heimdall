import type { Channel } from '@yt/channel'
import type { ContinuationItem, AppendContinuationItemsResponse } from '@yt/components/continuation'
import type { ItemSectionWithIdentifier, SectionList, Shelf } from '@yt/components/core'
import type { TwoColumnSearchResults } from '@yt/components/two-column'
import type { VerticalList } from '@yt/components/vertical-list'
import type { BaseResponse } from '@yt/core/api'
import type { Video } from '@yt/video/processors/regular'

export type SearchSuggestion = [string, number, number[]]
export type SearchSuggestions = [string, SearchSuggestion[], { e: string; k: number; q: string }]

export type SearchItem = Channel | Video
type NestedSearchItem = SearchItem | Shelf<VerticalList<SearchItem>>

export type SearchResponse = BaseResponse & {
  /** TODO: Search filtering can be found in sub menu of section list. Need to type it */
  contents: TwoColumnSearchResults<
    SectionList<ItemSectionWithIdentifier<NestedSearchItem> | ContinuationItem>
  >
}

export type SearchResponseContinuation = AppendContinuationItemsResponse<
  ItemSectionWithIdentifier<NestedSearchItem>
>
