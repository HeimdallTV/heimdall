import { Provider, ResourceType } from 'parser/std'
import { getChannel, listChannelVideos } from './channel'
import { getPlayer, getRecommended, getVideo, setVideoLikeStatus } from './video'
import { getUser, listFollowedUsers, listLiveFollowedUsers, setUserFollowed } from './user'
import { getSearch, getSearchSuggestions } from './search'

const provider: Provider = Object.freeze({
  getRecommended,

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

  // getComment,
  // listComments,

  getSearch,
  getSearchSuggestions,
})
export default provider
