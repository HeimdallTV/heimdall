import * as std from '@std'
import { Comment, CommentContent, CommentReplies, isVerifiedBadge } from './types'
import { combineSomeText } from '../components/text'
import { someToArray } from '../core/internals'
import { getNavigationUrl } from '../components/utility/navigation'
import { relativeToAbsoluteDate } from '../video/processors/helpers'
import { Endpoint, fetchYt } from '../core/api'
import { listCommentReplies } from '.'
import { fromShortHumanReadable } from '../core/helpers'

export function processComment({ commentRenderer: comment }: Comment, replies?: CommentReplies): std.Comment {
  const repliesContinuation =
    replies?.commentRepliesRenderer.contents[0].continuationItemRenderer.continuationEndpoint
      .continuationCommand.token
  return {
    provider: std.ProviderName.YT,
    id: comment.commentId,
    author: {
      id: combineSomeText(comment.authorText),
      // slice to remove the @
      name: combineSomeText(comment.authorText).slice(1),
      avatar: comment.authorThumbnail.thumbnails,
      verified: std.verifiedFrom(comment.authorCommentBadge && isVerifiedBadge(comment.authorCommentBadge)),
    },
    content: processCommentContent(comment.contentText),
    publishedAt: relativeToAbsoluteDate(combineSomeText(comment.publishedTimeText)),
    likes: comment.voteCount ? fromShortHumanReadable(combineSomeText(comment.voteCount)) : 0,
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
    setLikeStatus: async (currentLikeStatus: std.LikeStatus, desiredLikeStatus: std.LikeStatus) => {
      if (currentLikeStatus === desiredLikeStatus) return

      const likeButton = comment.actionButtons.commentActionButtonsRenderer.likeButton.toggleButtonRenderer
      const dislikeButton =
        comment.actionButtons.commentActionButtonsRenderer.dislikeButton.toggleButtonRenderer

      const likeParams = likeButton.defaultServiceEndpoint.performCommentActionEndpoint.action
      const removeLikeParams = likeButton.toggledServiceEndpoint.performCommentActionEndpoint.action
      const dislikeParams = dislikeButton.defaultServiceEndpoint.performCommentActionEndpoint.action
      const removeDislikeParams = dislikeButton.toggledServiceEndpoint.performCommentActionEndpoint.action

      const params = std.matchLikeStatus(
        desiredLikeStatus,
        likeParams,
        () =>
          std.matchLikeStatus(
            currentLikeStatus,
            removeLikeParams,
            () => {
              throw Error('Unreachable')
            },
            removeDislikeParams,
          ),
        dislikeParams,
      )

      // TODO: Check status from the response
      // FIXME: Bypass cache
      await fetchYt(Endpoint.PerformCommentAction, {
        actions: [params],
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
