import * as std from '@std'
import { ChannelGuideEntry } from '@yt/components/guide'
import { combineSomeText } from '@yt/components/text'

export const processChannelGuideEntry = (entry: ChannelGuideEntry['guideEntryRenderer']): std.User => ({
  name: combineSomeText(entry.formattedTitle),
  id: entry.navigationEndpoint.browseEndpoint.browseId,
  avatar: entry.thumbnail.thumbnails,
  verified: std.VerifiedStatus.Unknown,
  followed: true,
  isLive: Boolean(entry.badges.liveBroadcasting)
})
