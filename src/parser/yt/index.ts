import { Provider } from 'parser/std'
import {
	getChannel,
	listChannelVideos,
	listChannelShelves,
	listChannelLiveVideos,
	listChannelLinks,
} from './channel'
import { listComments } from './comment'
import { getPlayer, listRecommended, getVideo, setVideoLikeStatus } from './video'
import {
	getUser,
	listHistory,
	listFollowedUsers,
	listLiveFollowedUsers,
	listFollowedUsersVideos,
	setUserFollowed,
} from './user'
import { listSearch, listSearchSuggestions } from './search'
import { endpoints } from '@/libs/extension'

const provider: Provider = Object.freeze({
	// todo: should periodically fetch and return the cached result
	listRecommended,
	listHistory,

	// todo: all of these should have a way to do pre-caching

	getPlayer,
	getVideo,
	setVideoLikeStatus,

	getUser,
	listFollowedUsers,
	listLiveFollowedUsers,
	listFollowedUsersVideos,
	setUserFollowed,

	// getPlaylist,
	// listPlaylists,

	getChannel,
	listChannelVideos,
	listChannelShelves,
	listChannelLiveVideos,
	listChannelLinks,

	listComments,

	listSearch,
	listSearchSuggestions,
})

export default provider
