import type { RichSection } from '@/parser/yt/components/section'
import type { AppendContinuationItemsResponse, ContinuationItem } from '@yt/components/continuation'
import type { RichGrid } from '@yt/components/grid'
import type { RichItem } from '@yt/components/item'
import type { TabWithIdentifier } from '@yt/components/tab'
import type { Text } from '@yt/components/text'
import type { TwoColumnBrowseResults } from '@yt/components/two-column'
import type { BaseResponse, BrowseId } from '@yt/core/api'
import type { Renderer, Some } from '@yt/core/internals'
import type { Video } from '@yt/video/processors/regular'

type Item = RichItem<Video> | RichSection<Renderer<'TODO'>> | ContinuationItem

export type SubscriptionsResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<
    TabWithIdentifier<BrowseId.Subscriptions, RichGrid<Item, Renderer<'TODO'>>>
  >
  header: Renderer<'feedTabbedHeader', { title: Some<Text> }>
}

export type SubscriptionsContinuationResponse = BaseResponse & AppendContinuationItemsResponse<Item>
