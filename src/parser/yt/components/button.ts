import {
  Command,
  CommandMetadata,
  ExtractCommand,
  ExtractRawCommand,
  OptionalSubCommand,
  Renderer,
  Some,
  SubCommand,
  ViewModel,
} from '../core/internals'
import { Text } from './text'
import { Tracking } from './utility/tracking'
import {
  LikeEndpoint,
  OfflineVideoEndpoint,
  SignalServiceEndpoint,
  SubscribeEndpoint,
} from './utility/endpoints'
import { OpenPopupAction } from './utility/actions'
import {
  GestureCommand,
  InnertubeCommand,
  OnAddCommand,
  SerialCommand,
  UpdateToggleButtonCommand,
} from './utility/commands'
import { Icon } from './icon'
import { LikeStatus } from './like-status'
import { Accessibility } from './utility/accessibility'
import { Thumbnail } from './thumbnail'

type Size = string // Never seen anything other than "SIZE_DEFAULT" and "BUTTON_VIEW_MODEL_SIZE_DEFAULT"

type Style = {
  styleType: StyleType
}
type StyleType = string // 'STYLE_BLUE_TEXT' | 'STYLE_TEXT' | 'STYLE_DEFAULT_ACTIVE' | 'BUTTON_VIEW_MODEL_STYLE_MONO'
type IconPosition = string // 'BUTTON_ICON_POSITION_TYPE_LEFT_OF_TEXT'

export type Button<Command extends OptionalSubCommand = undefined> = Renderer<
  'button',
  {
    text: Some<Text>
    style?: StyleType
    size?: Size
    icon?: Icon
    iconPosition?: IconPosition
    isDisabled?: boolean
    tooltip?: string
    /** Defined on the "# replies" button when the creator of a video has replied to a comment */
    thumbnail?: Thumbnail
  } & ExtractCommand<Command>
>

export type SubscribeButton = Renderer<
  'subscribeButton',
  {
    buttonText: Some<Text>
    channelId: string
    subscribed: boolean
    enabled: boolean

    onSubscribeEndpoints: (SubscribeEndpoint & CommandMetadata)[]
    onUnsubscribeEndpoints: (SignalServiceEndpoint<'CLIENT_SIGNAL', OpenPopupAction<Renderer<'TODO'>>> &
      CommandMetadata)[]

    type: string // 'FREE'
    targetId: string // 'watch-subscribe'
    /** Omitted for now */
    notificationPreferenceButton: {}
    /** No idea what this is */
    showPreferences: boolean

    /** No idea what this is */
    subscribedEntityKey: string
    subscribedButtonText: Some<Text>

    unsubscribeButtonText: Some<Text>
    unsubscribedButtonText: Some<Text>
  }
>

export type ToggleButton<
  DefaultServiceEndpoint extends SubCommand,
  ToggledServiceEndpoint extends SubCommand,
> = Renderer<
  'toggleButton',
  {
    style: Style
    isToggled: boolean
    isDisabled?: boolean
    targetId: string

    defaultIcon?: Icon
    defaultServiceEndpoint: ExtractRawCommand<DefaultServiceEndpoint>
    /** Text that shows up on the button. Ex. like count or "Share" */
    defaultText: Some<Accessibility<Text>>
    defaultTooltip: string

    toggledIcon?: Icon
    toggledServiceEndpoint: ExtractRawCommand<ToggledServiceEndpoint>
    toggledText: Some<Accessibility<Text>>
    toggledTooltip: string
    toggledStyle?: Style
  }
>

export type SharePanel = Renderer<'unifiedSharePane', Tracking & { showLoadingSpinner: boolean }>

// View Model version of buttons
export type ButtonVM<OnTap extends Command> = ViewModel<
  'button',
  {
    type: string // 'BUTTON_VIEW_MODEL_TYPE_TONAL'
    style: StyleType
    buttonSize: Size
    title: string
    tooltip: string
    iconName?: string
    isFullWidth?: boolean
    onTap: OnTap
  }
>

export type ToggleButtonVM<OnDefaultTapped extends Command, OnToggledTapped extends Command> = ViewModel<
  'toggleButton',
  {
    isTogglingDisabled: boolean
    defaultButtonViewModel: ButtonVM<OnDefaultTapped>
    toggledButtonViewModel: ButtonVM<OnToggledTapped>
  }
>

export type LikeToggleButtonVM = ToggleButtonVM<
  SerialCommand<GestureCommand | InnertubeCommand<LikeEndpoint>>,
  SerialCommand<GestureCommand | InnertubeCommand<LikeEndpoint>>
>
export type LikeButtonVM = ViewModel<
  'likeButton',
  {
    likeEntityKey: string
    likeStatusEntity: { key: string; likeStatus: LikeStatus }
    toggleButtonViewModel: LikeToggleButtonVM
  }
>
export type DislikeButtonVM = ViewModel<
  'dislikeButton',
  {
    dislikeEntityKey: string
    toggleButtonViewModel: LikeToggleButtonVM
  }
>

export type SegmentedLikeDislikeButtonVM = ViewModel<
  'segmentedLikeDislikeButton',
  {
    dislikeButtonViewModel: DislikeButtonVM
    likeButtonViewModel: LikeButtonVM
    likeCountEntity: { TODO: true }
  }
>

export type DownloadButton = Renderer<
  'download',
  {
    style: StyleType
    size?: Size
    targetId: string
    command: OfflineVideoEndpoint<OnAddCommand>
  }
>

export type ThumbnailOverlayToggleButton<
  ToggledServiceEndpoint extends SubCommand,
  UntoggledServiceEndpoint extends SubCommand,
> = Renderer<
  'thumbnailOverlayToggleButton',
  {
    isToggled: boolean

    toggledIcon?: Icon
    toggledTooltip: string
    toggledServiceEndpoint: ExtractRawCommand<ToggledServiceEndpoint>

    untoggledIcon?: Icon
    untoggledTooltip: string
    untoggledServiceEndpoint: ExtractRawCommand<UntoggledServiceEndpoint>
  }
>
