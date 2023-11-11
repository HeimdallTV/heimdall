import { Channel, Comment, Playlist, Video, Player, User, HistoryVideos } from '.'
import { GameCategory } from './category'
import { Shelf } from './shelf'

export enum LikeStatus {
  Indifferent = 'indifferent',
  Like = 'like',
  Dislike = 'dislike',
}

export enum ProviderName {
  YT = 'yt',
  Twitch = 'twitch',
  Nebula = 'nebula',
  Curiosity = 'curiosity',
  Floatplane = 'floatplane',
}

export enum ResourceType {
  Category = 'category',
  Channel = 'channel',
  Comment = 'comment',
  Playlist = 'playlist',
  Self = 'self',
  User = 'user',
  Video = 'video',
}

export type Resource<Type extends ResourceType> = Type extends ResourceType.Category
  ? GameCategory
  : Type extends ResourceType.Channel
  ? Channel
  : Type extends ResourceType.Comment
  ? Comment
  : Type extends ResourceType.Playlist
  ? Playlist
  : Type extends ResourceType.Self
  ? never
  : Type extends ResourceType.User
  ? User
  : Type extends ResourceType.Video
  ? Video
  : never

type IdIfNotSelf<ResourceTypes extends ResourceType, ReturnType> = <
  ResourceType extends ResourceType.Self | ResourceTypes,
>(
  resourceType: ResourceType,
) => ResourceType extends ResourceType.Self ? () => ReturnType : (id: string) => ReturnType

export type Provider = {
  getRecommended?: () => AsyncGenerator<(Video | Shelf)[]>
  getHistory?: () => AsyncGenerator<HistoryVideos[]>
  // What about getting new videos from followed channels? /subscribed on YT

  getGamingCategoryById?: (id: string) => Promise<GameCategory>
  getGamingCategoryByName?: (name: string) => Promise<GameCategory>
  listGamingCategories?: () => AsyncGenerator<GameCategory[]>
  listGamingCategoryVideos?: (id: string) => AsyncGenerator<Video[]>

  // TODO:
  getPlayer: (videoId: string) => Promise<Player>
  getVideo: (videoId: string) => Promise<Video>
  setVideoLikeStatus?: (videoId: string) => (likeStatus: LikeStatus) => Promise<void>

  getUser: (userId: string) => Promise<User>
  listFollowedUsers: () => AsyncGenerator<User[]>
  listLiveFollowedUsers?: () => AsyncGenerator<User[]>
  listFollowedUsersVideos?: () => AsyncGenerator<Video[]>
  listUserPlaylists?: (userId: string) => AsyncGenerator<Playlist[]>
  setUserFollowed: (id: string) => (isFollowing: boolean) => Promise<void>

  getPlaylist?: (playListId: string) => Promise<Playlist>
  listPlaylistVideos?: (playListId: string) => AsyncGenerator<Video[]>

  getChannel: (channelId: string) => Promise<Channel>
  listChannelRecommended?: (channelId: string) => AsyncGenerator<(Video | Shelf)[]>
  listChannelVideos: (channelId: string) => AsyncGenerator<Video[]>
  listChannelPlaylists?: (userId: string) => AsyncGenerator<Playlist[]>

  /** Going to want this eventually for subscriptions view */
  // listFollowedChannels: IdIfNotSelf<ResourceType.Channel, AsyncGenerator<Channel[]>>
  // listLiveFollowedChannels?: IdIfNotSelf<ResourceType.Channel, AsyncGenerator<Channel[]>>

  listComments?: (videoId: string) => AsyncGenerator<Comment[]>
  listCommentReplies?: (commentId: string) => AsyncGenerator<Comment[]>

  /** Gets search results from the provider */
  getSearch: <Type extends ResourceType.Channel | ResourceType.Playlist | ResourceType.Video>(
    resourceType: Type[],
  ) => (query: string) => AsyncGenerator<Resource<Type>[]>
  /** Gets search suggestions from the provider. The resourceType may be respected but may also be ignored */
  getSearchSuggestions: (
    resourceType: (ResourceType.Channel | ResourceType.Playlist | ResourceType.Video)[],
  ) => (query: string) => Promise<string[]>
}
