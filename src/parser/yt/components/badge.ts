import { Renderer } from '../core/internals'
import { Accessibility } from './utility/accessibility'
import { Tracking } from './utility/tracking'
import { Icon } from './icon'

export type MetadataBadge = Renderer<
  'metadataBadge',
  {
    /** For example { iconType: "CHECK_CIRCLE_THICK" } */
    icon: Icon
    /** For example "BADGE_STYLE_TYPE_VERIFIED" */
    style: string
    /** For example "VERIFIED" */
    tooltip: string
    /** For example "LIVE" */
    label?: string
  } & Accessibility &
    Tracking
>

export const isVerifiedBadge = (badge: MetadataBadge) => badge.metadataBadgeRenderer.style === 'BADGE_STYLE_TYPE_VERIFIED'
export const isLiveBadge = (badge: MetadataBadge) => badge.metadataBadgeRenderer.label === 'LIVE'
