import { Channel } from '@yt/channel'
import {
  ContinuationItem,
  ContinuationItemResponse,
} from '@yt/components/continuation'
import { ItemSection, SectionList, Shelf } from '@yt/components/core'
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
  contents: TwoColumnSearchResults<SectionList<ItemSection<NestedSearchItem> | ContinuationItem>>
}

export type SearchResponseContinuation = ContinuationItemResponse<ItemSection<NestedSearchItem>>
