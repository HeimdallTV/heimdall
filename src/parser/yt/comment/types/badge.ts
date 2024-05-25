import type { BasicColorPaletteData } from '@yt/components/color'
import type { Icon } from '@yt/components/icon'
import type { Text } from '@yt/components/text'
import type { Accessibility } from '@yt/components/utility/accessibility'
import type { BrowseEndpoint } from '@yt/components/utility/endpoint'
import type { CommandMetadata, Renderer, Some } from '@yt/core/internals'

export type AuthorCommentBadge = Renderer<
  'authorCommentBadge',
  {
    icon: Icon
    iconTooltip: 'Verified' | string
    color: BasicColorPaletteData
    authorText: Some<Accessibility<Text>>
    authorEndpoint: BrowseEndpoint & CommandMetadata
  }
>
export const isVerifiedBadge = (badge: AuthorCommentBadge) =>
  badge.authorCommentBadgeRenderer.iconTooltip === 'Verified'

export type PinnedCommentBadge = Renderer<
  'pinnedCommentBadge',
  {
    icon: Icon
    label: Some<Text>
    color: BasicColorPaletteData
  }
>
