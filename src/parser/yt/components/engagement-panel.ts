import type { Endpoint, Renderer } from '../core/internals'
import type { ContinuationItem } from './continuation'
import type { ItemSectionWithIdentifier, SectionList } from './core'

type Identifier = {
  surface: string
  tag: string
}

export type ShowEngagementPanelEndpoint = Endpoint<
  'showEngagementPanel',
  {
    // todo: is this recurring?
    identifier: Identifier
    // todo: is this recurring?
    engagementPanelPresentationConfigs: { engagementPanelPopupPresentationConfig: { popupType: string } }
    engagementPanel: EngagementPanelSectionList<ItemSectionWithIdentifier<ContinuationItem>>
  }
>

export type EngagementPanelSectionList<Item extends Renderer> = Renderer<
  'engagementPanelSectionList',
  {
    content: SectionList<Item>
    /** Contains the title and information about the close button */
    header: Renderer<'engagementPanelTitleHeader', Record<never, never>>
  }
>
