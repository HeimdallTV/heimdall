import {
  Command,
  CommandMetadata,
  OptionalSubCommand,
  ServiceEndpoint,
  SubCommand,
} from '../../core/internals'

/** Run multiple commands in serial */
export type SerialCommand<_SubCommand extends SubCommand> = Command<'serial', { commands: _SubCommand[] }>
export type InnertubeCommand<_SubCommand extends SubCommand> = Command<
  'innertube',
  CommandMetadata,
  _SubCommand
>
export type GestureCommand = Command<'gesture', { gestureType: string }>

export type UpdateToggleButtonCommand = Command<'updateToggleButton', { toggled: boolean; buttonId: string }>

export type ShowLessCommand<_SubCommand extends SubCommand> = Command<'showLess', {}, _SubCommand>
export type ShowMoreCommand<_SubCommand extends SubCommand> = Command<'showMore', {}, _SubCommand>

export type ScrollToEngagementPanelCommand = Command<
  'scrollToEngagementPanel',
  {
    targetId: string // "engagement-panel-comments-section"
  }
>

export type GetDownloadActionCommand = Command<'getDownloadAction', { videoId: string }>
export type OnAddCommand<SubCommand extends OptionalSubCommand = undefined> = Command<'onAdd', {}, SubCommand>

export type AddToPlaylistCommand = ServiceEndpoint<'addToPlaylist', { videoId: string }>
