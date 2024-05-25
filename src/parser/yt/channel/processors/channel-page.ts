import * as std from '@std'
import { combineSomeText } from '@yt/components/text'
import { fetchChannelHome } from '../api'
import { isVerifiedBadge } from '@yt/components/badge'
import { fromShortHumanReadable } from '../../core/helpers'

export const processChannelPage = async (channelId: string): Promise<std.Channel> => {
  const channelResponse = await fetchChannelHome(channelId)
  const metadata = channelResponse.metadata.channelMetadataRenderer
  const header = channelResponse.header.c4TabbedHeaderRenderer

  return {
    provider: std.ProviderName.YT,
    id: channelId,
    user: {
      avatar: metadata.avatar.thumbnails,
      id: channelId,
      name: metadata.title,
      verified: std.verifiedFrom(header.badges?.some(isVerifiedBadge)),
      followed: header.subscribeButton.subscribeButtonRenderer.subscribed,
      followerCount: fromShortHumanReadable(combineSomeText(header.subscriberCountText)),
      /** TODO: Check if live by looking for live streams on their home page? */
      // isLive: res.contents.twoColumnBrowseResultsRenderer.tabs.find(isTab(ChannelTabName.Home))?.tabRenderer.content.sectionListRenderer.contents
    },
    banner: header.banner.thumbnails,
    shortDescription: header.tagline.channelTaglineRenderer.content,
    description: [{ content: metadata.description, type: std.RichTextChunkType.Text }],
  }
}
