import * as std from '@std'
import { combineSomeText } from '@yt/components/text'
import { Channel } from '../types'
import { isVerifiedBadge } from '@yt/components/badge'

export const processChannel = (channelRenderer: Channel): std.Channel => {
  const channel = channelRenderer.channelRenderer
  return {
    provider: std.ProviderName.YT,
    id: channel.channelId,
    user: {
      avatar: channel.thumbnail.thumbnails,
      id: channel.channelId,
      name: combineSomeText(channel.title),
      verified: std.verifiedFrom(channel.ownerBadges?.some(isVerifiedBadge)),
      followed: channel.subscribeButton.subscribeButtonRenderer.subscribed,
      followerCount: Number(combineSomeText(channel.subscriberCountText)),
      /** TODO: Check if live somehow? */
      // isLive:
    },
    description: [{ content: combineSomeText(channel.descriptionSnippet), type: std.RichTextChunkType.Text }],
  }
}
