import { Channel } from '@yt/channel'
import { ContinuationItem, AppendContinuationItemsResponse } from '@yt/components/continuation'
import { ItemSectionWithIdentifier, SectionList, Shelf } from '@yt/components/core'
import { TwoColumnSearchResults } from '@yt/components/two-column'
import { VerticalList } from '@yt/components/vertical-list'
import { BaseResponse } from '@yt/core/api'
import { Video } from '@yt/video/processors/regular'

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
