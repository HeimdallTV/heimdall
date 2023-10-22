import {
  BrowseGuideEntry,
  ButtonGuideEntry,
  ChannelGuideEntry,
  CollapsibleGuideEntry,
  CollapsibleGuideSectionEntry,
  GuideSection,
  SubscriptionsGuideSection,
  ReelGuideEntry,
} from '@yt/components/guide'
import { BaseResponse } from '@yt/core/api'

export type GuideResponse = BaseResponse & {
  items: (
    | SubscriptionsGuideSection<ChannelGuideEntry>
    | GuideSection<
        | BrowseGuideEntry
        | ReelGuideEntry
        | CollapsibleGuideSectionEntry<
            BrowseGuideEntry,
            BrowseGuideEntry | CollapsibleGuideEntry<ButtonGuideEntry, ButtonGuideEntry, BrowseGuideEntry>
          >
      >
  )[]
}
