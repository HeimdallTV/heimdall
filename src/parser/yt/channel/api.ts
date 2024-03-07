import {
  AppendContinuationItemsAction,
  AppendContinuationItemsResponse,
  getContinuationResponseItems,
} from '@yt/components/continuation'
import { MetadataBadge } from '../components/badge'
import { Button, SubscribeButton } from '../components/button'
import { Text } from '../components/text'
import { Thumbnail } from '../components/thumbnail'
import { Navigation } from '../components/utility/navigation'
import { BrowseEndpoint, UrlEndpoint } from '../components/utility/endpoint'
import {
  BaseResponse,
  BrowseParams,
  Endpoint,
  fetchYt,
  fetchEndpointContinuation,
  fetchBrowseContinuation,
} from '../core/api'
import { Renderer, Some, ViewModel, isRenderer } from '../core/internals'
import { FullChannel, ChannelTabName, ChannelTabByName, ChannelTagline } from './types'
import { Tab } from '../components/tab'
import { Video } from '../video/processors/regular'
import { RichItem } from '../components/item'
import { InnertubeCommand } from '../components/utility/commands'
import { ItemSection, SectionList } from '../components/core'
import { Grid } from '../components/grid'
import { GridPlaylist } from '../playlist/processors/grid'

// Channel
export const fetchChannelHome = (channelId: string): Promise<ChannelResponse<ChannelTabName.Home>> =>
  fetchYt(Endpoint.Browse, {
    browseId: channelId,
    params: btoa(BrowseParams.ChannelHome),
  })

export const fetchChannelVideos = (
  channelId: string,
  continuation?: string,
): Promise<ChannelResponse<ChannelTabName.Videos>> =>
  fetchYt(
    Endpoint.Browse,
    continuation ? { continuation } : { browseId: channelId, params: btoa(BrowseParams.ChannelVideos) },
  )
type ChannelVideosContinuationResponse = AppendContinuationItemsResponse<RichItem<Video>>
export const fetchChannelVideosContinuation = fetchBrowseContinuation<ChannelVideosContinuationResponse>

export const fetchChannelPlaylists = (
  channelId: string,
): Promise<ChannelResponse<ChannelTabName.Playlists>> =>
  fetchYt(Endpoint.Browse, {
    browseId: channelId,
    params: btoa(BrowseParams.ChannelPlaylists),
  })
type ChannelPlaylistsContinuationResponse = AppendContinuationItemsResponse<GridPlaylist>
export const fetchChannelPlaylistsContinuation = fetchBrowseContinuation<ChannelPlaylistsContinuationResponse>

export const fetchChannelLive = (channelId: string): Promise<ChannelResponse<ChannelTabName.Live>> =>
  fetchYt(Endpoint.Browse, {
    browseId: channelId,
    params: btoa(BrowseParams.ChannelLive),
  })

export const fetchChannelChannels = (channelId: string): Promise<ChannelResponse<ChannelTabName.Channels>> =>
  fetchYt(Endpoint.Browse, {
    browseId: channelId,
    params: btoa(BrowseParams.ChannelChannels),
  })

export const getSelectedChannelTab = <SelectedTab extends ChannelTabName>(
  channelResponse: ChannelResponse<SelectedTab>,
): ChannelTabByName<SelectedTab> =>
  channelResponse.contents.twoColumnBrowseResultsRenderer.tabs.find(
    (tab) => 'tabRenderer' in tab && tab.tabRenderer.selected === true,
  )! as unknown as ChannelTabByName<SelectedTab>

export const getTabContent = <Content extends Renderer>(tab: Tab<string, Content, true>): Content =>
  tab.tabRenderer.content

export type ChannelResponse<SelectedTab extends ChannelTabName> = BaseResponse & {
  contents: FullChannel<SelectedTab>
  metadata: ChannelMetadata
  microformat: ChannelMicroFormat
  header: ChannelHeader
}

type ChannelHeader = Renderer<
  'c4TabbedHeader',
  {
    channelId: string

    title: string
    tagline: ChannelTagline
    avatar: Thumbnail
    banner: Thumbnail
    tvBanner: Thumbnail
    mobileBanner: Thumbnail
    badges?: MetadataBadge[]

    subscribeButton: SubscribeButton
    subscriberCountText: Some<Text>
  } & Navigation<BrowseEndpoint>
>

type ChannelMetadata = Renderer<
  'channelMetadata',
  {
    channelUrl: string
    vanityChannelUrl: string
    ownerUrls: string[]
    externalId: string

    avatar: Thumbnail
    title: string
    description: string
    keywords: string

    isFamilySafe: boolean
    availableCountryCodes: string[]
    androidDeepLink: string
    androidAppindexingLink: string
    iosAppindexingLink: string
    rssUrl: string
  }
>

type ChannelMicroFormat = Renderer<
  'microformatData',
  {
    urlCanonical: string
    title: string
    description: string
    thumbnail: Thumbnail
    noindex: boolean
    unlisted: boolean
    familySafe: boolean

    availableCountries: string[]
    siteName: 'YouTube'
    appName: 'YouTube'
    androidPackage: string
    iosAppStoreId: string
    iosAppArguments: string
    ogType: string
    urlApplinksWeb: string
    urlApplinksIos: string
    urlApplinksAndroid: string
    urlTwitterIos: string
    urlTwitterAndroid: string
    twitterCardType: string
    twitterSiteHandle: string
    schemaDotOrgType: string
    linkAlternatives: { hrefUrl: string }[]
  }
>

/// About
export const fetchChannelAbout = (channelId: string) =>
  fetchChannelHome(channelId)
    .then(
      (res) =>
        res.header.c4TabbedHeaderRenderer.tagline.channelTaglineRenderer.moreEndpoint
          .showEngagementPanelEndpoint.engagementPanel.engagementPanelSectionListRenderer.content
          .sectionListRenderer.contents[0].itemSectionRenderer.contents[0].continuationItemRenderer
          .continuationEndpoint.continuationCommand.token,
    )
    .then(fetchEndpointContinuation(Endpoint.Browse)<AboutChannelResponse>)
    .then(getContinuationResponseItems)
    .then((res) => res.filter(isRenderer('aboutChannel'))[0])

type AboutChannelResponse = AppendContinuationItemsResponse<AboutChannel>

type AboutChannel = Renderer<
  'aboutChannel',
  {
    metadata: AboutChannelVM
    /** Action ommitted since we do not use it */
    flaggingButton: Button
    /** Action ommitted since we do not use it */
    shareChannel: Button
  }
>

type AboutChannelVM = ViewModel<
  'aboutChannel',
  {
    channelId: string
    canonicalChannelUrl: string
    description: string
    subscriberCountText: string
    viewCountText: string
    joinedDateText: { content: string }
    videoCountText: string
    links: ChannelExternalLink[]

    customUrlOnTap: { TODO: true }
    // The following describe the text and how to style the headers
    additionalInfoLabel: { TODO: true }
    customLinksLabel: { TODO: true }
    descriptionLabel: { TODO: true }
  }
>

type ChannelExternalLink = ViewModel<
  'channelExternalLink',
  {
    title: { content: string }
    // todo: commandRuns is shared with the video description on watch pages
    link: {
      content: string
      commandRuns: {
        startIndex: number
        length: number
        onTap: InnertubeCommand<BrowseEndpoint | UrlEndpoint>
      }[]
    }
  }
>
