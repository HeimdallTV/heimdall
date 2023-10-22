import { Tab } from '@yt/components/tab'
import { Renderer } from '@yt/core/internals'
import { ChannelTab, ChannelTabName } from './types'

export const isTab =
  <Title extends string>(tabName: Title) =>
  <TabType extends Renderer>(
    tab: TabType
  ): tab is TabType extends Tab<string, infer U, infer Z> ? TabType & Tab<Title, U, Z> : never =>
    'tabRenderer' in tab && 'title' in tab.tabRenderer && tab.tabRenderer.title === tabName

export const findTab =
  <T extends ChannelTabName>(tabName: ChannelTabName) =>
  (tabs: ChannelTab[]): ChannelTab<T> | undefined =>
    tabs.find(
      (tab): tab is ChannelTab<T> => 'tabRenderer' in tab && tab.tabRenderer.title === tabName
    )
