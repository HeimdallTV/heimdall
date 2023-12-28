import * as std from '@std'
import { ChannelGuideEntry } from '@yt/components/guide'
import { combineSomeText } from '@yt/components/text'

export const processChannelGuideEntry = ({ guideEntryRenderer: entry }: ChannelGuideEntry): std.User => ({
  name: combineSomeText(entry.formattedTitle),
  id: entry.navigationEndpoint.browseEndpoint.browseId,
  avatar: entry.thumbnail.thumbnails,
  followed: true,
  isLive: Boolean(entry.badges.liveBroadcasting),
})
