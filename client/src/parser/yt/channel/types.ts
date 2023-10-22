import { ContinuationItem } from '@yt/components/continuation'
import { MetadataBadge } from '../components/badge'
import { SubscribeButton } from '../components/button'
import { HorizontalList, ItemSection, SectionList, Shelf } from '../components/core'
import { Grid } from '../components/grid'
import { ExpandableTab, Tab } from '../components/tab'
import { Text } from '../components/text'
import { Thumbnail } from '../components/thumbnail'
import { TwoColumnBrowseResults } from '../components/two-column'
import { Accessibility } from '../components/utility/accessibility'
import { Navigation, NavigationSome } from '../components/utility/navigation'
import { BrowseEndpoint, UrlEndpoint, WatchEndpoint } from '@yt/components/utility/endpoint'
import { CommandMetadata, Renderer, Some } from '../core/internals'
import { GridVideo } from '../video/processors/grid'

export type FullChannel<SelectedTab extends ChannelTabName> = TwoColumnBrowseResults<ChannelTab<SelectedTab>>

export enum ChannelTabName {
  Home = 'Home',
  Videos = 'Videos',
  Playlists = 'Playlists',
  Community = 'Community',
  Store = 'Store',
  Channels = 'Channels',
  About = 'About',
  Search = 'Search',
}

type IsTabName<Expected extends ChannelTabName, Received extends ChannelTabName> = Received extends Expected
  ? true
  : false

export type ChannelTab<Selected extends ChannelTabName = ChannelTabName> =
  | HomeTab<IsTabName<ChannelTabName.Home, Selected>>
  | VideosTab<IsTabName<ChannelTabName.Videos, Selected>>
  | PlaylistsTab<IsTabName<ChannelTabName.Playlists, Selected>>
  | CommunityTab<IsTabName<ChannelTabName.Community, Selected>>
  | StoreTab<IsTabName<ChannelTabName.Store, Selected>>
  | ChannelsTab<IsTabName<ChannelTabName.Channels, Selected>>
  | AboutTab<IsTabName<ChannelTabName.About, Selected>>
  | SearchExpandableTab

export type HomeTab<Selected extends boolean> = Tab<
  ChannelTabName.Home,
  SectionList<ChannelVideoPlayer | Shelf<HorizontalList<GridVideo> | HorizontalList<GridChannel>>>,
  Selected
>
export type VideosTab<Selected extends boolean> = Tab<
  ChannelTabName.Videos,
  SectionList<ItemSection<Grid<GridVideo | ContinuationItem>, undefined>>,
  Selected
>
export type PlaylistsTab<Selected extends boolean> = Tab<ChannelTabName.Playlists, Renderer<'TODO'>, Selected>
export type CommunityTab<Selected extends boolean> = Tab<ChannelTabName.Community, Renderer<'TODO'>, Selected>
export type StoreTab<Selected extends boolean> = Tab<ChannelTabName.Store, Renderer<'TODO'>, Selected>
export type ChannelsTab<Selected extends boolean> = Tab<ChannelTabName.Channels, Renderer<'TODO'>, Selected>
export type AboutTab<Selected extends boolean> = Tab<ChannelTabName.About, Renderer<'TODO'>, Selected>
export type SearchExpandableTab = ExpandableTab<ChannelTabName.Search>

type GridChannel = Renderer<
  'gridChannel',
  Navigation & {
    channelId: string
    ownerBadges: MetadataBadge[]
    subscribeButton: SubscribeButton
    subscriberCountText: Accessibility<Some<Text>>
    thumbnail: { thumbnails: Thumbnail[] }
    title: Some<Text>
    videoCountText: Some<Text>
  }
>

type ChannelVideoPlayer = Renderer<
  'channelVideoPlayer',
  {
    description: Some<NavigationSome<UrlEndpoint | WatchEndpoint, Text>>
    publishedTimeText: Some<Text>
    readMoreText: Some<NavigationSome<WatchEndpoint, Text>>
    title: Some<Accessibility<NavigationSome<WatchEndpoint, Text>>>
    videoId: string
    viewCountText: Some<Text>
  }
>

export type Channel = Renderer<
  'channel',
  {
    channelId: string
    title: Some<Text>
    thumbnail: Thumbnail
    descriptionSnippet: Some<Text>
    shortByLineText: NavigationSome<BrowseEndpoint & CommandMetadata, Text>
    videoCountText: Some<Text>
    subscriptionButton: { subscribed: boolean }
    ownerBadges?: MetadataBadge[]
    subscriberCountText: Some<Text>
    subscribeButton: SubscribeButton
    longBylineText: NavigationSome<BrowseEndpoint & CommandMetadata, Text>
  } & Navigation<BrowseEndpoint & CommandMetadata>
>
