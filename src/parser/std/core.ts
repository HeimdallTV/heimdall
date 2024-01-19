import { Channel, Comment, Playlist, Video, Player, User, HistoryVideos } from '.'
import { GameCategory } from './category'
import { Shelf } from './shelf'

export enum LikeStatus {
  Indifferent = 'indifferent',
  Like = 'like',
  Dislike = 'dislike',
}
export const matchLikeStatus = <ReturnType extends string | number | boolean | object>(
  likeStatus: LikeStatus,
  onLike: ReturnType | (() => ReturnType),
  onIndifferent: ReturnType | (() => ReturnType),
  onDislike: ReturnType | (() => ReturnType),
) => {
  if (likeStatus === LikeStatus.Like) return typeof onLike === 'function' ? onLike() : onLike
  if (likeStatus === LikeStatus.Dislike) return typeof onDislike === 'function' ? onDislike() : onDislike
  if (likeStatus === LikeStatus.Indifferent) {
    return typeof onIndifferent === 'function' ? onIndifferent() : onIndifferent
  }
  throw new Error(`Unknown like status: ${likeStatus}`)
}
export const toggleLikeStatus = (enabledStatus: LikeStatus, currentStatus: LikeStatus) =>
  matchLikeStatus(
    enabledStatus,
    matchLikeStatus(currentStatus, LikeStatus.Indifferent, LikeStatus.Like, LikeStatus.Like),
    () => {
      throw Error('Enabled status cannot be indifferent')
    },
    matchLikeStatus(currentStatus, LikeStatus.Dislike, LikeStatus.Dislike, LikeStatus.Indifferent),
  )

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
  listRecommended?: () => AsyncGenerator<(Video | Shelf)[]>
  listHistory?: () => AsyncGenerator<HistoryVideos[]>

  getGamingCategoryById?: (id: string) => Promise<GameCategory>
  getGamingCategoryByName?: (name: string) => Promise<GameCategory>
  listGamingCategories?: () => AsyncGenerator<GameCategory[]>
  listGamingCategoryVideos?: (id: string) => AsyncGenerator<Video[]>

  getPlayer: (videoId: string) => Promise<Player>
  getVideo: (videoId: string) => Promise<Video>
  setVideoLikeStatus?: (
    videoId: string,
    currentLikeStatus: LikeStatus,
    likeStatus: LikeStatus,
  ) => Promise<void>

  getUser: (userId: string) => Promise<User>
  listFollowedUsers: () => AsyncGenerator<User[]>
  listLiveFollowedUsers?: () => AsyncGenerator<User[]>
  listFollowedUsersVideos?: () => AsyncGenerator<Video[]>
  listUserPlaylists?: (userId: string) => AsyncGenerator<Playlist[]>
  setUserFollowed: (userId: string, isFollowing: boolean) => Promise<void>

  getPlaylist?: (playlistId: string) => Promise<Playlist>
  listPlaylistVideos?: (playlistId: string) => AsyncGenerator<Video[]>

  getChannel: (channelId: string) => Promise<Channel>
  listChannelShelves?: (channelId: string) => AsyncGenerator<Shelf[]>
  listChannelRecommended?: (channelId: string) => AsyncGenerator<(Video | Shelf)[]>
  listChannelVideos: (channelId: string) => AsyncGenerator<Video[]>
  listChannelLiveVideos?: (channelId: string) => AsyncGenerator<Video[]>
  listChannelFeaturedVideo?: (channelId: string) => Promise<Video>
  listChannelPlaylists?: (channelId: string) => AsyncGenerator<Playlist[]>
  listChannelLinks?: (channelId: string) => Promise<string[]>

  /** Going to want this eventually for subscriptions view */
  // listFollowedChannels: IdIfNotSelf<ResourceType.Channel, AsyncGenerator<Channel[]>>
  // listLiveFollowedChannels?: IdIfNotSelf<ResourceType.Channel, AsyncGenerator<Channel[]>>

  listComments?: (videoId: string) => AsyncGenerator<Comment[]>
  listCommentReplies?: (commentId: string) => AsyncGenerator<Comment[]>

  /** Gets search results from the provider */
  listSearch: <Type extends ResourceType.Channel | ResourceType.Playlist | ResourceType.Video>(
    resourceType: Type[],
  ) => (query: string) => AsyncGenerator<Resource<Type>[]>
  /** Gets search suggestions from the provider. The resourceType may be respected but may also be ignored */
  listSearchSuggestions: (
    resourceType: (ResourceType.Channel | ResourceType.Playlist | ResourceType.Video)[],
  ) => (query: string) => Promise<string[]>
}
