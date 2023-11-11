import { RichSection } from '@/parser/yt/components/section'
import { AppendContinuationItemsResponse, ContinuationItem } from '@yt/components/continuation'
import { RichGrid } from '@yt/components/grid'
import { RichItem } from '@yt/components/item'
import { TabWithIdentifier } from '@yt/components/tab'
import { Text } from '@yt/components/text'
import { TwoColumnBrowseResults } from '@yt/components/two-column'
import { BaseResponse, BrowseId } from '@yt/core/api'
import { Renderer, Some } from '@yt/core/internals'
import { Video } from '@yt/video/processors/regular'

type Item = RichItem<Video> | RichSection<Renderer<'TODO'>> | ContinuationItem

export type SubscriptionsResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<
    TabWithIdentifier<BrowseId.Subscriptions, RichGrid<Item, Renderer<'TODO'>>>
  >
  header: Renderer<'feedTabbedHeader', { title: Some<Text> }>
}

export type SubscriptionsContinuationResponse = BaseResponse & AppendContinuationItemsResponse<Item>
