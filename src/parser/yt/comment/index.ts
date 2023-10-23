import { unwrapRenderer } from '../core/internals'
import { makeCommentsIterator } from './api'
import { processComment } from './processors/comment'

export async function* listComments(videoId: string) {
  for await (const commentThreads of makeCommentsIterator(videoId)) {
    const comments = commentThreads.map(unwrapRenderer).map(thread => processComment(thread.comment))
    // todo: get the replies continuation renderer so it can be used on listCommentReplies
    yield comments
  }
}
