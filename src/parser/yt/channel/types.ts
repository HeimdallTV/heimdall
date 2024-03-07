import { ContinuationItem } from '@yt/components/continuation'
import { MetadataBadge } from '../components/badge'
import { SubscribeButton } from '../components/button'
import {
  HorizontalList,
  ItemSection,
  ItemSectionWithIdentifier,
  SectionList,
  Shelf,
} from '../components/core'
import { Grid, RichGrid } from '../components/grid'
import { ExpandableTab, Tab } from '../components/tab'
import { Text } from '../components/text'
import { Thumbnail } from '../components/thumbnail'
import { TwoColumnBrowseResults } from '../components/two-column'
import { Accessibility } from '../components/utility/accessibility'
import { Navigation, NavigationSome } from '../components/utility/navigation'
import { BrowseEndpoint, UrlEndpoint, WatchEndpoint } from '@yt/components/utility/endpoint'
import { CommandMetadata, Renderer, Some } from '../core/internals'
import { GridVideo } from '../video/processors/grid'
import { RichItem } from '../components/item'
import { Video } from '../video/processors/regular'
import { Icon } from '../components/icon'
import { ShowEngagementPanelEndpoint } from '../components/engagement-panel'
import { GridPlaylist } from '../playlist/processors/grid'

export type FullChannel<SelectedTab extends ChannelTabName> = TwoColumnBrowseResults<ChannelTab<SelectedTab>>

export enum ChannelTabName {
  Home = 'Home',
  Videos = 'Videos',
  Shorts = 'Shorts',
  Live = 'Live',
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
  | ShortsTab<IsTabName<ChannelTabName.Shorts, Selected>>
  | LiveTab<IsTabName<ChannelTabName.Live, Selected>>
  | PlaylistsTab<IsTabName<ChannelTabName.Playlists, Selected>>
  | CommunityTab<IsTabName<ChannelTabName.Community, Selected>>
  | StoreTab<IsTabName<ChannelTabName.Store, Selected>>
  | ChannelsTab<IsTabName<ChannelTabName.Channels, Selected>>
  | AboutTab<IsTabName<ChannelTabName.About, Selected>>
  | SearchExpandableTab

// prettier-ignore
export type ChannelTabByName<Name extends ChannelTabName> = IsTabName<
	ChannelTabName.Home,
	Name
> extends true
	? HomeTab<true>
	: IsTabName<ChannelTabName.Videos, Name> extends true
	  ? VideosTab<true>
	  : IsTabName<ChannelTabName.Shorts, Name> extends true
		  ? ShortsTab<true>
		  : IsTabName<ChannelTabName.Live, Name> extends true
			  ? LiveTab<true>
			  : IsTabName<ChannelTabName.Playlists, Name> extends true
				  ? PlaylistsTab<true>
				  : IsTabName<ChannelTabName.Community, Name> extends true
					  ? CommunityTab<true>
					  : IsTabName<ChannelTabName.Store, Name> extends true
						  ? StoreTab<true>
						  : IsTabName<ChannelTabName.Channels, Name> extends true
							  ? ChannelsTab<true>
							  : IsTabName<ChannelTabName.About, Name> extends true
								  ? AboutTab<true>
								  : never;

export type HomeTab<Selected extends boolean> = Tab<
  ChannelTabName.Home,
  SectionList<
    | ItemSection<ChannelFeaturedContent<Video>>
    | ItemSection<ChannelVideoPlayer>
    | ItemSection<Shelf<HorizontalList<GridVideo> | HorizontalList<GridChannel>>>
  >,
  Selected
>
export type VideosTab<Selected extends boolean> = Tab<
  ChannelTabName.Videos,
  RichGrid<RichItem<Video> | ContinuationItem> & Renderer<'sectionList', Record<never, never>>,
  Selected
>
export type ShortsTab<Selected extends boolean> = Tab<ChannelTabName.Videos, Renderer<'TODO'>, Selected>
export type LiveTab<Selected extends boolean> = Tab<ChannelTabName.Live, RichGrid<RichItem<Video>>, Selected>
export type PlaylistsTab<Selected extends boolean> = Tab<
  ChannelTabName.Playlists,
  SectionList<ItemSection<Grid<GridPlaylist | ContinuationItem>>>,
  Selected
>
export type CommunityTab<Selected extends boolean> = Tab<ChannelTabName.Community, Renderer<'TODO'>, Selected>
export type StoreTab<Selected extends boolean> = Tab<ChannelTabName.Store, Renderer<'TODO'>, Selected>
export type ChannelsTab<Selected extends boolean> = Tab<ChannelTabName.Channels, Renderer<'TODO'>, Selected>
export type AboutTab<Selected extends boolean> = Tab<ChannelTabName.About, Renderer<'TODO'>, Selected>
export type SearchExpandableTab = ExpandableTab<ChannelTabName.Search>

export type GridChannel = Renderer<
  'gridChannel',
  Navigation & {
    channelId: string
    ownerBadges: MetadataBadge[]
    subscribeButton: SubscribeButton
    subscriberCountText: Accessibility<Some<Text>>
    thumbnail: Thumbnail
    title: Some<Text>
    videoCountText: Some<Text>
  }
>

// todo: does this still exist?
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

type ChannelFeaturedContent<Item extends Renderer> = Renderer<
  'channelFeaturedContent',
  { title: Record<never, never>; items: Item[] }
>

export type ChannelTagline = Renderer<
  'channelTagline',
  {
    content: string
    maxLines: number
    moreEndpoint: ShowEngagementPanelEndpoint
    moreIcon: Icon
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
