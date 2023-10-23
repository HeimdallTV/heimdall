import {
  Command,
  CommandMetadata,
  ExtractCommand,
  ExtractRawCommand,
  OptionalSubCommand,
  Renderer,
  Some,
  SubCommand,
} from '../core/internals'
import { Accessibility } from './utility/accessibility'
import { Text } from './text'
import { Tracking } from './utility/tracking'
import {
  LikeEndpoint,
  OfflineVideoEndpoint,
  SignalServiceEndpoint,
  SubscribeEndpoint,
} from './utility/endpoints'
import { OpenPopupAction } from './utility/actions'
import { OnAddCommand, UpdateToggleButtonCommand } from './utility/commands'
import { Icon } from './icon'

type Size = string // Never seen anything other than "SIZE_DEFAULT"

type Style = {
  styleType: StyleType
}
type StyleType = string // 'STYLE_BLUE_TEXT' | 'STYLE_TEXT' | 'STYLE_DEFAULT_ACTIVE'
type IconPosition = string // 'BUTTON_ICON_POSITION_TYPE_LEFT_OF_TEXT'

// All of these have { accessibility: { label: string } } and { accessibilityData: { accessibilityData: { label: string }}}
// which I haven't seen anywhere else
export type Button<Command extends OptionalSubCommand> = Renderer<
  'button',
  {
    text: Some<Text>
    style?: StyleType // "STYLE_BLUE_TEXT" | "STYLE_TEXT"
    size?: Size
    icon?: Icon
    iconPosition?: IconPosition
    isDisabled?: boolean
    tooltip?: string
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

export type SharePanel = Renderer<'unifiedSharePane', Tracking & { showLoadingSpinner: boolean }>

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

export type LikeToggleButton = ToggleButton<
  Command<'', {}, UpdateToggleButtonCommand | (LikeEndpoint & CommandMetadata)>,
  Command<'', {}, LikeEndpoint & CommandMetadata>
>

export type SegmentedLikeDislikeButton = Renderer<
  'segmentedLikeDislikeButton',
  { dislikeButton: LikeToggleButton; likeButton: LikeToggleButton }
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
