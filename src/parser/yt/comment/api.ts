import {
  type AppendContinuationItemsResponse,
  type ContinuationItem,
  getContinuationResponseItems,
} from '@yt/components/continuation'
import { type BaseResponse, Endpoint, fetchYt, makeContinuationIterator } from '@yt/core/api'
import { fetchVideo } from '@yt/video/api'
import type { CommentThread } from './types'
import type { Text } from '../components/text'
import { type Some, isRenderer } from '../core/internals'
import type { CommentsHeader } from './types/comments-header'
import type { ItemSectionWithIdentifier } from '../components/core'

/** Entry point for fetching comments since we can't retrieve them directly from the video */
export const fetchVideoCommentsContinuationToken = (videoId: string) =>
  fetchVideo(videoId).then(
    (video) =>
      video.contents.twoColumnWatchNextResults.results.results.contents.find(
        (renderer): renderer is ItemSectionWithIdentifier<ContinuationItem, 'comment-item-section'> =>
          isRenderer('itemSection')(renderer) &&
          renderer.itemSectionRenderer.sectionIdentifier === 'comment-item-section',
      )!.itemSectionRenderer.contents[0].continuationItemRenderer.continuationEndpoint.continuationCommand
        .token,
  )

// List comments
type FetchCommentsResponse = AppendContinuationItemsResponse<CommentThread | CommentsHeader>
const getCommentThreadsFromResponse = (res: FetchCommentsResponse) =>
  getContinuationResponseItems(res, isRenderer('commentThread'))
const fetchCommentThreadsContinuation = (continuation: string) =>
  fetchYt<FetchCommentsResponse>(Endpoint.Next, { continuation }).then(getCommentThreadsFromResponse)

export function makeCommentsIterator(continuation: string): AsyncGenerator<CommentThread[]> {
  return makeContinuationIterator(
    () => fetchCommentThreadsContinuation(continuation),
    fetchCommentThreadsContinuation,
  )
}

// Create comments
type CreateCommentResponse = BaseResponse & {
  /* Tells the client how it should update the UI **/
  actions: { TODO: true }[]
  /* The status of the action and what to show the user because fuck a status code **/
  actionResult: {
    // TODO: Check status from the response
    status: 'STATUS_SUCCEEDED' | string
    feedbackText: Some<Text>
  }
}

const getCommentsHeaderFromResponse = (res: FetchCommentsResponse) =>
  getContinuationResponseItems(res, isRenderer('commentsHeader'))[0] as CommentsHeader
const fetchCommentsHeader = (continuation: string) =>
  fetchYt<FetchCommentsResponse>(Endpoint.Next, { continuation }).then(getCommentsHeaderFromResponse)

export async function createComment(comment: string, videoId: string) {
  const commentsHeader = await fetchVideoCommentsContinuationToken(videoId).then(fetchCommentsHeader)
  await fetchYt<CreateCommentResponse>(Endpoint.CreateComment, {
    commentText: comment,
    createCommentParams:
      commentsHeader.commentsHeaderRenderer.createRenderer.commentSimpleBoxRenderer.submitButton
        .buttonRenderer.serviceEndpoint.createCommentEndpoint.createCommentParams,
  })
}
