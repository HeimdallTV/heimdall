import { Provider } from 'parser/std'
import {
  getChannel,
  listChannelVideos,
  listChannelShelves,
  listChannelLiveVideos,
  listChannelLinks,
  listChannelPlaylists,
} from './channel'
import { listComments } from './comment'
import {
  getPlaylist,
  listPlaylistVideos,
  listUserPlaylists,
  createPlaylist,
  deletePlaylist,
  addPlaylistVideo,
  removePlaylistVideo,
  movePlaylistVideo,
  setPlaylistTitle,
  setPlaylistDescription,
  setPlaylistVisibility,
  savePlaylist,
  unsavePlaylist,
} from './playlist'
import { listSearch, listSearchSuggestions } from './search'
import {
  getUser,
  listHistory,
  listFollowedUsers,
  listLiveFollowedUsers,
  listFollowedUsersVideos,
  setUserFollowed,
} from './user'
import { getPlayer, listRecommended, getVideo, setVideoLikeStatus } from './video'
import {
  fetchPlaybackTracking as trackVideoView,
  fetchWatchTimeTracking as trackVideoProgress,
} from './video/api'

const provider: Provider = Object.freeze({
  // todo: should periodically fetch and return the cached result
  listRecommended,
  listHistory,

  // todo: all of these should have a way to do pre-caching

  getPlayer,
  getVideo,
  setVideoLikeStatus,
  trackVideoView,
  trackVideoProgress,

  getUser,
  listFollowedUsers,
  listLiveFollowedUsers,
  listFollowedUsersVideos,
  listUserPlaylists,
  setUserFollowed,

  getPlaylist,
  listPlaylistVideos,
  createPlaylist,
  deletePlaylist,
  addPlaylistVideo,
  removePlaylistVideo,
  movePlaylistVideo,
  setPlaylistTitle,
  setPlaylistDescription,
  setPlaylistVisibility,
  savePlaylist,
  unsavePlaylist,

  getChannel,
  listChannelVideos,
  listChannelShelves,
  listChannelLiveVideos,
  listChannelLinks,
  listChannelPlaylists,

  listComments,

  listSearch,
  listSearchSuggestions,
})

export default provider
