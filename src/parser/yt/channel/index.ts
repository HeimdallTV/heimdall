import * as std from '@std'
import { getAppendContinuationItemsResponseItems } from '@yt/components/continuation'
import { makeContinuationIterator } from '@yt/core/api'
import { unwrapRenderer } from '@yt/core/internals'

import { fetchChannelHome, fetchChannelVideos, fetchChannelVideosContinuation } from './api'
import { isTab } from './helpers'
import { processChannelPage } from './processors/channel-page'
import { ChannelTabName } from './types'

export type { Channel, FullChannel } from './types'

export const getChannel = (channelId: string): Promise<std.Channel> =>
  fetchChannelHome(channelId).then(processChannelPage(channelId))

export async function* listChannelVideos(channelId: string): AsyncGenerator<std.Video[]> {
  return makeContinuationIterator(
    () =>
      // todo: move to separate parser
      fetchChannelVideos(channelId).then(res => {
        const tabRenderer = unwrapRenderer(res.contents).tabs.find(isTab(ChannelTabName.Videos))
        if (!tabRenderer) throw Error('Failed to find video tab in YT response')
        const sectionListRenderer = unwrapRenderer(tabRenderer).content
        if (!sectionListRenderer) throw Error('Failed to find list of videos in the video tab in YT response')
        const itemSectionRenderer = unwrapRenderer(sectionListRenderer).contents[0]
        if (!itemSectionRenderer) throw Error('Failed to find list of videos in the video tab in YT response')
        return unwrapRenderer(itemSectionRenderer).contents.flatMap(grid => unwrapRenderer(grid).items)
      }),
    token => fetchChannelVideosContinuation(token).then(getAppendContinuationItemsResponseItems),
  )
}
