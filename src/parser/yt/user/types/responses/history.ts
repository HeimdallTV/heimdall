import { ItemSectionWithHeader, SectionList } from '@/parser/yt/components/core'
import { AppendContinuationItemsResponse, ContinuationItem } from '@yt/components/continuation'
import { TabWithIdentifier } from '@yt/components/tab'
import { TwoColumnBrowseResults } from '@yt/components/two-column'
import { BaseResponse, BrowseId } from '@yt/core/api'
import { Renderer } from '@yt/core/internals'
import { Video } from '@yt/video/processors/regular'

type Item = ItemSectionWithHeader<Video> | ContinuationItem

export type HistoryResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<TabWithIdentifier<BrowseId.History, SectionList<Item>>>
  header: Renderer<'pageHeader', { pageTitle: string; content: { TODO: true } }>
}

export type HistoryContinuationResponse = BaseResponse & AppendContinuationItemsResponse<Item>
