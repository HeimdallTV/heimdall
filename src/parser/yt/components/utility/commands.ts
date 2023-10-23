import { Command, OptionalSubCommand, ServiceEndpoint, SubCommand } from '../../core/internals'

export type UpdateToggleButtonCommand = Command<'updateToggleButton', { toggled: boolean; buttonId: string }>

export type ShowLessCommand<_SubCommand extends SubCommand> = Command<'showLess', {}, _SubCommand>
export type ShowMoreCommand<_SubCommand extends SubCommand> = Command<'showMore', {}, _SubCommand>

export type ScrollToEngagementPanelCommand = Command<
  'scrollToEngagementPanel',
  {
    targetId: string // "engagement-panel-comments-section"
  }
>

export type getDownloadActionCommand = Command<'getDownloadAction', { videoId: string }>
export type OnAddCommand<SubCommand extends OptionalSubCommand = undefined> = Command<'onAdd', {}, SubCommand>

export type AddToPlaylistCommand = ServiceEndpoint<'addToPlaylist', { videoId: string }>
