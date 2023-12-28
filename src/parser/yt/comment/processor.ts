import * as std from '@std'
import { Comment, CommentContent, CommentReplies, isVerifiedBadge } from './types'
import { combineSomeText } from '../components/text'
import { someToArray } from '../core/internals'
import { getNavigationUrl } from '../components/utility/navigation'
import { relativeToAbsoluteDate } from '../video/processors/helpers'
import { Endpoint, fetchYt } from '../core/api'
import { listCommentReplies } from '.'

export function processComment({ commentRenderer: comment }: Comment, replies?: CommentReplies): std.Comment {
  const repliesContinuation =
    replies?.commentRepliesRenderer.contents[0].continuationItemRenderer.continuationEndpoint
      .continuationCommand.token
  return {
    provider: std.ProviderName.YT,
    id: comment.commentId,
    author: {
      id: combineSomeText(comment.authorText),
      name: combineSomeText(comment.authorText),
      avatar: comment.authorThumbnail.thumbnails,
      verified: std.verifiedFrom(comment.authorCommentBadge && isVerifiedBadge(comment.authorCommentBadge)),
    },
    content: processCommentContent(comment.contentText),
    publishedAt: relativeToAbsoluteDate(combineSomeText(comment.publishedTimeText)),
    likes: comment.voteCount ? Number(combineSomeText(comment.voteCount)) : 0,
    likeStatus:
      comment.voteStatus === 'LIKE'
        ? std.LikeStatus.Like
        : comment.voteStatus === 'DISLIKE'
          ? std.LikeStatus.Dislike
          : std.LikeStatus.Indifferent,
    listReplies:
      repliesContinuation !== undefined ? () => listCommentReplies(repliesContinuation) : undefined,
    createReply: async (commentText: string) => {
      // TODO: Check status from the response
      await fetchYt(Endpoint.CreateCommentReply, {
        commentText,
        createReplyParams:
          comment.actionButtons.commentActionButtonsRenderer.replyButton.buttonRenderer.navigationEndpoint
            .createCommentReplyDialogEndpoint.dialog.commentReplyDialogRenderer.replyButton.buttonRenderer
            .serviceEndpoint.createCommentReplyCommand.createReplyParams,
      })
    },
    setLikeStatus: async (currentLikeStatus: std.LikeStatus, likeStatus: std.LikeStatus) => {
      const likeButton = comment.actionButtons.commentActionButtonsRenderer.likeButton.toggleButtonRenderer
      const dislikeButton =
        comment.actionButtons.commentActionButtonsRenderer.dislikeButton.toggleButtonRenderer

      const likeParams = likeButton.defaultServiceEndpoint.performCommentActionCommand.action
      const removeLikeParams = likeButton.toggledServiceEndpoint.performCommentActionCommand.action
      const dislikeParams = dislikeButton.defaultServiceEndpoint.performCommentActionCommand.action
      const removeDislikeParams = dislikeButton.toggledServiceEndpoint.performCommentActionCommand.action

      const params =
        likeStatus === std.LikeStatus.Like
          ? likeParams
          : likeStatus === std.LikeStatus.Dislike
            ? dislikeParams
            : currentLikeStatus === std.LikeStatus.Like
              ? removeLikeParams
              : removeDislikeParams

      // TODO: Check status from the response
      await fetchYt(Endpoint.PerformCommentAction, {
        action: [params],
      })
    },
  }
}

export function processCommentContent(content: CommentContent): std.RichText {
  return someToArray(content).map<std.RichTextChunk>(chunk => ({
    content: 'simpleText' in chunk ? chunk.simpleText : chunk.text,
    type: std.RichTextChunkType.Text,
    // @ts-expect-error fixme: typescript can't infer that navigation endpoint is defined
    href: chunk.navigationEndpoint !== undefined ? getNavigationUrl(chunk) : undefined,
  }))
}
