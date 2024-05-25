import type { Channel, Comment, Playlist, Video, Player, User, HistoryVideos } from '.'
import type { GameCategory } from './category'
import type { Shelf } from './shelf'

export enum Visibility {
  Public = 'public',
  Private = 'private',
  Unlisted = 'unlisted',
}

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
): ReturnType => {
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

// prettier-ignore
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
  trackVideoView?: (videoId: string) => Promise<void>
  trackVideoProgress?: (
    videoId: string,
    currentTimeMS: number,
    durationMS: number,
    final?: boolean,
  ) => Promise<void>

  getUser: (userId: string) => Promise<User>
  listFollowedUsers: () => AsyncGenerator<User[]>
  listLiveFollowedUsers?: () => AsyncGenerator<User[]>
  listFollowedUsersVideos?: () => AsyncGenerator<Video[]>
  listUserPlaylists?: (userId: string) => AsyncGenerator<Playlist[]>
  setUserFollowed: (userId: string, isFollowing: boolean) => Promise<void>

  getPlaylist?: (playlistId: string) => Promise<Playlist>
  listPlaylistVideos?: (playlistId: string) => AsyncGenerator<Video[]>
  addPlaylistVideo?: (playlistId: string, videoId: string) => Promise<void>
  removePlaylistVideo?: (playlistId: string, videoId: string) => Promise<void>
  movePlaylistVideo?: (playlistId: string, currentPosition: number, newPosition: number) => Promise<void>
  createPlaylist?: (title: string, description: string, visibility: Visibility) => Promise<Playlist>
  deletePlaylist?: (playlistId: string) => Promise<void>
  setPlaylistTitle?: (playlistId: string, title: string) => Promise<void>
  setPlaylistDescription?: (playlistId: string, description: string) => Promise<void>
  setPlaylistVisibility?: (playlistId: string, visibility: Visibility) => Promise<void>
  setPlaylistThumbnail?: (playlistId: string, thumbnail: string) => Promise<void>
  savePlaylist?: (playlistId: string) => Promise<void>
  unsavePlaylist?: (playlistId: string) => Promise<void>

  getChannel: (channelId: string) => Promise<Channel>
  /** Ex. Playlists, For You and so on */
  listChannelShelves?: (channelId: string) => Promise<Shelf[]>
  /** Videos recommended for the user */
  listChannelRecommended?: (channelId: string) => AsyncGenerator<(Video | Shelf)[]>
  /** Videos uploaded by the channel */
  listChannelVideos: (channelId: string) => AsyncGenerator<Video[]>
  /** Currently active live streams if applicable */
  listChannelLiveVideos?: (channelId: string) => Promise<Video[]>
  /** Trailers on Youtube */
  listChannelFeaturedVideo?: (channelId: string) => Promise<Video>
  /** Playlists created by the channel */
  listChannelPlaylists?: (channelId: string) => AsyncGenerator<Playlist[]>
  /** Ex. social media or discord server */
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
