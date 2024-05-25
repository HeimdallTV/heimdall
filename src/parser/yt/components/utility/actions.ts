import type { Action, Renderer } from '../../core/internals'

export type OpenPopupAction<Popup extends Renderer> = Action<
  'openPopup',
  {
    popup: Popup
    popupType: string // 'DIALOG' | 'TOAST'
    beReused?: boolean
  }
>

export type ChangeEngagementPanelVisibilityAction<TargetId extends string> = Action<
  'changeEngagementPanelVisibility',
  {
    targetId: TargetId // "engagement-panel-comments-section"
    visibility: 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN' | 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED'
  }
>
