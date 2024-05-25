import type { ItemSectionWithHeader, SectionList } from '@/parser/yt/components/core'
import type { AppendContinuationItemsResponse, ContinuationItem } from '@yt/components/continuation'
import type { TabWithIdentifier } from '@yt/components/tab'
import type { TwoColumnBrowseResults } from '@yt/components/two-column'
import type { BaseResponse, BrowseId } from '@yt/core/api'
import type { Renderer } from '@yt/core/internals'
import type { Video } from '@yt/video/processors/regular'

type Item = ItemSectionWithHeader<Video> | ContinuationItem

export type HistoryResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<TabWithIdentifier<BrowseId.History, SectionList<Item>>>
  header: Renderer<'pageHeader', { pageTitle: string; content: { TODO: true } }>
}

export type HistoryContinuationResponse = BaseResponse & AppendContinuationItemsResponse<Item>
