import { ContinuationItem } from '@yt/components/continuation'
import { RichGrid } from '@yt/components/grid'
import { RichItem } from '@yt/components/item'
import { TabWithIdentifier } from '@yt/components/tab'
import { Text } from '@yt/components/text'
import { TwoColumnBrowseResults } from '@yt/components/two-column'
import { BaseResponse, BrowseId } from '@yt/core/api'
import { Renderer, Some } from '@yt/core/internals'
import { Video } from '@yt/video/processors/regular'

export type RecommendedResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<
    TabWithIdentifier<
      BrowseId.Recommended,
      RichGrid<RichItem<Video | Renderer<'radio'>> | ContinuationItem, Renderer<'TODO'>>
    >
  >
  header: Renderer<'feedTabbedHeader', { title: Some<Text> }>
}
