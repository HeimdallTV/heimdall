import { RichText } from './components/rich-text'
import { User, ProviderName, LikeStatus } from '.'

/**
 * Includes all necessary information to render a channel page other than the videos and playlists
 * which should be fetched separately since it contains continuation data.
 */
export type Comment = {
  provider: ProviderName
  id: string
  author: User
  content: RichText
  likes?: number
  likeStatus?: LikeStatus
  /** Date that the comment was posted */
  publishedAt: Date
  listReplies?: () => AsyncGenerator<Comment[]>
  createReply?: (comment: string) => Promise<void>
  setLikeStatus?: (currentLikeStatus: LikeStatus, likeStatus: LikeStatus) => Promise<void>
}
