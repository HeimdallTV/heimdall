import * as std from '@std'
import { combineSomeText } from '@yt/components/text'
import {
	fetchChannelAbout,
	fetchChannelChannels,
	fetchChannelHome,
	fetchChannelLive,
	getSelectedChannelTab,
	getTabContent,
} from '../api'
import { isVerifiedBadge } from '@yt/components/badge'
import { processVideo } from '../../video/processors/regular'
import { isRenderer } from '../../core/internals'
import { ChannelTabByName, ChannelTabName } from '../types'

export const processChannelPage = async (channelId: string): Promise<std.Channel> => {
	const [channelResponse, home, about, channels, live] = await Promise.all([
		fetchChannelHome(channelId),
		fetchChannelHome(channelId).then(getSelectedChannelTab).then(getTabContent),
		fetchChannelAbout(channelId).then(getSelectedChannelTab).then(getTabContent),
		fetchChannelChannels(channelId).then(getSelectedChannelTab).then(getTabContent),
		fetchChannelLive(channelId).then(getSelectedChannelTab).then(getTabContent),
	])
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
			followerCount: Number(combineSomeText(header.subscriberCountText)),
			/** TODO: Check if live by looking for live streams on their home page? */
			// isLive: res.contents.twoColumnBrowseResultsRenderer.tabs.find(isTab(ChannelTabName.Home))?.tabRenderer.content.sectionListRenderer.contents
		},
		banner: header.banner.thumbnails,
		description: [{ content: metadata.description, type: std.RichTextChunkType.Text }],

		featuredVideo: getFeaturedVideo(home),
		listLiveVideos: () => listLiveVideos(channelId),
		// listShelves: () => listShelves(channelId),
		// listLinks: () => listFeaturedLinks(channelId),
	}
}

const getFeaturedVideo = (
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

const listLiveVideos = async (channelId: string): Promise<std.Video[]> =>
	fetchChannelLive(channelId)
		.then(getSelectedChannelTab)
		.then(getTabContent)
		.then((live) =>
			live.richGridRenderer.contents.flatMap((grid) => grid.richItemRenderer.content).map(processVideo),
		)

// const listShelves = async (channelId: string): Promise<std.Shelf[]> =>
//   fetchChannelHome(channelId)
//     .then(getSelectedChannelTab)
//     .then(getTabContent)
//     .then(home =>
//       home.sectionListRenderer.contents
//         .filter(isRenderer('itemSection'))
//         .map(section => section.itemSectionRenderer.contents)
//         .flat()
//         .map(processShelf),
//     )
