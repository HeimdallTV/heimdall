import { Image } from './components/image'
import { RichText } from './components/rich-text'
import { Video, Playlist, User, ProviderName } from '.'

// TODO: How to handle twitch's panel?
/**
 * Includes all necessary information to render a channel page other than the videos and playlists
 * which should be fetched separately since it contains continuation data.
 */
export type Channel = {
  provider: ProviderName
  user: User
  id: string
  banner?: Image[]
  shortDescription?: string
  description?: RichText

  viewCount?: number
  followerCount?: number

  featuredUsers?: User[]
  featuredPlaylists?: AsyncGenerator<Playlist>
  /** Ex. trailer or hosted channel */
  featuredVideo?: Video
  featuredVideos?: AsyncGenerator<Video>
  /** Ex. social media or discord server */
  featuredLinks?: AsyncGenerator<string>
}
