import { Provider } from '@std/core'
import {
  ReloadContinuationItemsResponse,
  getReloadContinuationItemsResponseItems,
} from '@yt/components/continuation'
import { Endpoint, fetchYt, makeContinuationIterator } from '@yt/core/api'
import { fetchVideo } from '@yt/video/api'
import { CommentThread } from './types'

const fetchComments = (continuation: string) =>
  fetchYt<ReloadContinuationItemsResponse<CommentThread>>(Endpoint.Next, { continuation }).then(
    getReloadContinuationItemsResponseItems,
  )

export function makeCommentsIterator(videoId: string): AsyncGenerator<CommentThread[]> {
  return makeContinuationIterator(
    () =>
      fetchVideo(videoId)
        .then(
          video =>
            video.contents.twoColumnWatchNextResults.results.results.contents[3].itemSectionRenderer
              .contents[0].continuationItemRenderer.continuationEndpoint.continuationCommand.token,
        )
        .then(fetchComments),
    fetchComments,
  )
}
