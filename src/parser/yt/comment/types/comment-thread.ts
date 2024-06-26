import type { Renderer } from '../../core/internals'
import type { Comment } from './comment'
import type { CommentReplies } from './comment-replies'

export enum RenderingPriority {
  PinnedComment = 'RENDERING_PRIORITY_PINNED_COMMENT',
  Unknown = 'RENDERING_PRIORITY_UNKNOWN',
}

export type CommentThread = Renderer<
  'commentThread',
  {
    comment: Comment
    replies: CommentReplies
    renderingPriority: RenderingPriority
    isModeredElqComment: boolean
  }
>
