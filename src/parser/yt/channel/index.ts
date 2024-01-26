import * as std from '@std'
import { getContinuationResponseItems } from '@yt/components/continuation'
import { fetchEndpointContinuation, makeContinuationIterator } from '@yt/core/api'
import { isRenderer, unwrapRenderer } from '@yt/core/internals'

import {
	fetchChannelAbout,
	fetchChannelHome,
	fetchChannelLive,
	fetchChannelVideos,
	fetchChannelVideosContinuation,
	getSelectedChannelTab,
	getTabContent,
} from './api'
import { isTab } from './helpers'
import { processChannelPage } from './processors/channel-page'
import { ChannelTabByName, ChannelTabName } from './types'
import { processVideo } from '../video/processors/regular'
import { processShelf } from './processors/shelf'
import { getEndpointUrl } from '../components/utility/endpoint'

export const getChannel = (channelId: string): Promise<std.Channel> => processChannelPage(channelId)

export async function* listChannelVideos(channelId: string): AsyncGenerator<std.Video[]> {
	const channelVideosIterator = makeContinuationIterator(
		() =>
			// todo: move to separate parser
			fetchChannelVideos(channelId).then((res) => {
				const tabRenderer = unwrapRenderer(res.contents).tabs.find(isTab(ChannelTabName.Videos))
				if (!tabRenderer) throw Error('Failed to find video tab in YT response')
				const richGridRenderer = unwrapRenderer(tabRenderer).content
				if (!richGridRenderer) throw Error('Failed to find list of videos in the video tab in YT response')
				const richItems = richGridRenderer.richGridRenderer.contents
				if (!richItems || richItems.length === 0)
					throw Error('Failed to find list of videos in the video tab in YT response')
				return richItems
			}),
		(token) => fetchChannelVideosContinuation(token).then(getContinuationResponseItems),
	)

	for await (const channelVideos of channelVideosIterator) {
		console.log('channelVideos', channelVideos)
		yield channelVideos.map((_) => _.richItemRenderer.content).map(processVideo)
	}
}

export const getChannelFeaturedVideo = (
	home: ChannelTabByName<ChannelTabName.Home>['tabRenderer']['content'],
): std.Video | undefined => {
	// biome-ignore lint/complexity/useFlatMap: Typing issue means we have to do it this way
	const featuredVideo = home.sectionListRenderer.contents
		.filter(isRenderer('itemSection'))
		.map((section) => section.itemSectionRenderer.contents)
		.flat()
		.find(isRenderer('channelFeaturedContent'))
		?.channelFeaturedContentRenderer.items.find(isRenderer('video'))
	if (!featuredVideo) return
	return processVideo(featuredVideo)
}

export const listChannelLiveVideos = async (channelId: string): Promise<std.Video[]> =>
	fetchChannelLive(channelId)
		.then(getSelectedChannelTab)
		.then(getTabContent)
		.then((live) =>
			live.richGridRenderer.contents.flatMap((grid) => grid.richItemRenderer.content).map(processVideo),
		)

export const listChannelShelves = async (channelId: string): Promise<std.Shelf[]> =>
	fetchChannelHome(channelId)
		.then(getSelectedChannelTab)
		.then(getTabContent)
		.then((home) =>
			// biome-ignore lint/complexity/useFlatMap: Typing issue means we have to do it this way
			home.sectionListRenderer.contents
				.filter(isRenderer('itemSection'))
				.map((section) => section.itemSectionRenderer.contents)
				.flat()
				.filter(isRenderer('shelf'))
				.map(processShelf),
		)

export const listChannelLinks = async (channelId: string): Promise<string[]> =>
	fetchChannelAbout(channelId).then(({ aboutChannelRenderer: about }) =>
		about.metadata.aboutChannelViewModel.links
			.map((link) => link.channelExternalLinkViewModel.link.commandRuns[0].onTap.innertubeCommand)
			.map(getEndpointUrl)
			.filter((link): link is string => Boolean(link)),
	)
