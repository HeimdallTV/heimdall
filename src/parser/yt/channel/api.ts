import { AppendContinuationItemsAction } from '@yt/components/continuation'
import { GridVideo } from '@yt/video/processors/grid'
import { MetadataBadge } from '../components/badge'
import { SubscribeButton } from '../components/button'
import { Text } from '../components/text'
import { Thumbnail } from '../components/thumbnail'
import { Navigation } from '../components/utility/navigation'
import { BrowseEndpoint } from '../components/utility/endpoint'
import { BaseResponse, BrowseParams, Endpoint, fetchYt, fetchEndpointContinuation } from '../core/api'
import { Renderer, Some } from '../core/internals'
import { FullChannel, ChannelTabName, ChannelTab, ChannelTabByName } from './types'
import { Tab } from '../components/tab'

// Channel
export const fetchChannelHome = (channelId: string): Promise<ChannelResponse<ChannelTabName.Home>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelHome })

export const fetchChannelVideos = (
  channelId: string,
  continuation?: string,
): Promise<ChannelResponse<ChannelTabName.Videos>> =>
  fetchYt(
    Endpoint.Browse,
    continuation ? { continuation } : { browseId: channelId, params: BrowseParams.ChannelVideos },
  )
type ChannelVideosContinuationResponse = BaseResponse & {
  onResponseReceivedActions: [AppendContinuationItemsAction<GridVideo>]
}
export const fetchChannelVideosContinuation = (
  continuationToken: string,
): Promise<ChannelVideosContinuationResponse> => fetchEndpointContinuation(Endpoint.Browse)(continuationToken)

export const fetchChannelPlaylists = (
  channelId: string,
): Promise<ChannelResponse<ChannelTabName.Playlists>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelPlaylists })

export const fetchChannelLive = (channelId: string): Promise<ChannelResponse<ChannelTabName.Live>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelLive })

export const fetchChannelChannels = (channelId: string): Promise<ChannelResponse<ChannelTabName.Channels>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelChannels })

export const fetchChannelAbout = (channelId: string): Promise<ChannelResponse<ChannelTabName.About>> =>
  fetchYt(Endpoint.Browse, { browseId: channelId, params: BrowseParams.ChannelAbout })

export const getSelectedChannelTab = <SelectedTab extends ChannelTabName>(
  channelResponse: ChannelResponse<SelectedTab>,
): ChannelTabByName<SelectedTab> =>
  channelResponse.contents.twoColumnBrowseResultsRenderer.tabs.find(
    tab => 'tabRenderer' in tab && tab.tabRenderer.selected === true,
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
    chnanelId: string

    title: string
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
