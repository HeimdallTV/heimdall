import { LikeStatus } from '../../components/like-status'
import { ManyText, SingleText, Text } from '../../components/text'
import { Thumbnail } from '../../components/thumbnail'
import { Accessibility } from '../../components/utility/accessibility'
import { BrowseEndpoint } from '../../components/utility/endpoint'
import { AllNavigation } from '../../components/utility/navigation'
import { CommandMetadata, Renderer, Some, SomeOptions } from '../../core/internals'
import { AuthorCommentBadge, PinnedCommentBadge } from './badge'

export type Comment = Renderer<
  'comment',
  {
    actionMenu: any // todo:
    actionButtons: any // todo:
    authorCommentBadge: AuthorCommentBadge
    /** Name of the author */
    authorText: Some<Text>
    authorThumbnail: Thumbnail & Accessibility
    authorEndpoint: BrowseEndpoint & CommandMetadata
    authorIsChannelOwner: boolean
    /** Comment message */
    // fixme: not correct because the navigation is optional
    contentText: CommentContent
    /** Unique identifier for the comment */
    commentId: string
    /** Thumbnail for the logged in user */
    currentUserReplyThumbnail: Thumbnail
    /** Only defined when the comment is pinned */
    pinnedCommentBadge?: PinnedCommentBadge
    /** Relative time like "15 hours ago" but can include "(edited)" at the end */
    publishedTimeText: Some<Text>
    replyCount: number
    isLiked: boolean
    /** Text like "366" indicating the number of likes */
    voteCount: Some<Accessibility<Text>>
    /** Whether the user has liked, disliked or done neither */
    voteStatus: LikeStatus
  }
>

export type CommentContent = Some<
  SomeOptions<Partial<AllNavigation> & SingleText, Partial<AllNavigation> & ManyText>
>
