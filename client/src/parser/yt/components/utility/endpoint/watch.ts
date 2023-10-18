import { Endpoint } from '@yt/core/internals'

/** Used for links to other Youtube videos */
export type WatchEndpoint = Endpoint<
  'watch',
  {
    videoId: string
    startTimeSeconds?: number
    nofollow?: boolean
    params?: string
    playerParams?: string

    // For playlists
    playlistId?: string
    continuePlayback?: boolean
  }
>

export const getWatchEndpointId = (endpoint: WatchEndpoint) => endpoint.watchEndpoint.videoId

export const getWatchEndpointUrl = (endpoint: WatchEndpoint) => {
  if (!endpoint.watchEndpoint.startTimeSeconds) return `/w/${endpoint.watchEndpoint.videoId}`
  return `/w/${endpoint.watchEndpoint.videoId}?t=${endpoint.watchEndpoint.startTimeSeconds}`
}
