import * as std from '@std'
import { Comment, CommentContent } from '../types'
import { isVerifiedBadge } from '../types/badge'
import { combineSomeText } from '@yt/components/text'
import { someToArray } from '../../core/internals'
import { getNavigationUrl } from '../../components/utility/navigation'

export function processComment({ commentRenderer: comment }: Comment): std.Comment {
  return {
    provider: std.ProviderName.YT,
    id: comment.commentId,
    author: {
      id: combineSomeText(comment.authorText),
      name: combineSomeText(comment.authorText),
      avatar: comment.authorThumbnail.thumbnails,
      verified: std.verifiedFrom(isVerifiedBadge(comment.authorCommentBadge)),
    },
    content: processCommentContent(comment.contentText),
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
