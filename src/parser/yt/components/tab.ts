import type { CommandMetadata, Renderer } from '../core/internals'
import type { Navigation } from './utility/navigation'
import type { BrowseEndpoint } from '@yt/components/utility/endpoint'

// FIXME: Only checked to cover tab found on channels
export type Tab<Title extends string, Content extends Renderer, Selected extends boolean> = Renderer<
  'tab',
  {
    content: Selected extends true ? Content : undefined
    selected: Selected
    title: Title
    endpoint: CommandMetadata & BrowseEndpoint
  }
>

export type TabWithIdentifier<Identifier extends string, Content extends Renderer> = Renderer<
  'tab',
  {
    selected: boolean
    content: Content
    tabIdentifier: Identifier
  }
>

// FIXME: Only checked to cover expandable tab found on channels
export type ExpandableTab<Title extends string> = Renderer<
  'expandableTab',
  Navigation & {
    expandedText: ''
    selected: boolean
    title: Title
  }
>
