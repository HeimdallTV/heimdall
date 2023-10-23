import { Provider } from 'parser/std'
import { getChannel, listChannelVideos } from './channel'
import { listComments } from './comment'
import { getPlayer, getRecommended, getVideo, setVideoLikeStatus } from './video'
import { getUser, listFollowedUsers, listLiveFollowedUsers, setUserFollowed } from './user'
import { getSearch, getSearchSuggestions } from './search'

const provider: Provider = Object.freeze({
  // todo: should periodically fetch and return the cached result
  getRecommended,

  // todo: all of these should have a way to do pre-caching

  getPlayer,
  getVideo,
  setVideoLikeStatus,

  getUser,
  listFollowedUsers,
  listLiveFollowedUsers,
  setUserFollowed,

  // getPlaylist,
  // listPlaylists,

  getChannel,
  listChannelVideos,

  listComments,

  getSearch,
  getSearchSuggestions,
})

export default provider
