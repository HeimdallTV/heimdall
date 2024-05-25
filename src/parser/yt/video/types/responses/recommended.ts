import type { ContinuationItem } from '@yt/components/continuation'
import type { RichGrid } from '@yt/components/grid'
import type { RichItem } from '@yt/components/item'
import type { TabWithIdentifier } from '@yt/components/tab'
import type { Text } from '@yt/components/text'
import type { TwoColumnBrowseResults } from '@yt/components/two-column'
import type { BaseResponse, BrowseId } from '@yt/core/api'
import type { Renderer, Some } from '@yt/core/internals'
import type { Video } from '@yt/video/processors/regular'

export type RecommendedResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<
    TabWithIdentifier<
      BrowseId.Recommended,
      RichGrid<RichItem<Video | Renderer<'radio'>> | ContinuationItem, Renderer<'TODO'>>
    >
  >
  header: Renderer<'feedTabbedHeader', { title: Some<Text> }>
}
