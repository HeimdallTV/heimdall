import * as std from '@std'
import { fetchChannel, fetchChannelVideos, fetchChannelVideosContinuation } from './api'
import { isTab } from './helpers'
import { ChannelTabName } from './types'
import { unwrapRenderer } from '@yt/core/internals'
import { makeContinuationIterator } from '@yt/core/api'
import { getContinuationItemResponseItems } from '@yt/components/continuation'
import { processChannelPage } from './processors/channel-page'
export type { FullChannel, Channel } from './types'

export const getChannel = (channelId: string): Promise<std.Channel> =>
  fetchChannel(channelId).then(processChannelPage(channelId))

export async function* listChannelVideos(channelId: string): AsyncGenerator<std.Video[]> {
  return makeContinuationIterator(token => {
    if (token) {
      return fetchChannelVideosContinuation(token).then(getContinuationItemResponseItems)
    }
    return fetchChannelVideos(channelId, token).then(res => {
      const tabRenderer = unwrapRenderer(res.contents).tabs.find(isTab(ChannelTabName.Videos))
      if (!tabRenderer) throw Error('Failed to find video tab in YT response')
      const sectionListRenderer = unwrapRenderer(tabRenderer).content
      if (!sectionListRenderer) throw Error('Failed to find list of videos in the video tab in YT response')
      const itemSectionRenderer = unwrapRenderer(sectionListRenderer).contents[0]
      if (!itemSectionRenderer) throw Error('Failed to find list of videos in the video tab in YT response')
      return unwrapRenderer(itemSectionRenderer).contents.flatMap(grid => unwrapRenderer(grid).items)
    })
  })
}
