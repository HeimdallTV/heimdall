import { fetchProxy } from '@libs/extension'
import { fetchSAPISID } from './sapisid'
import { fetchAPIKey } from './api-key'
import { setDeclarativeNetRequestHeaderRule } from './declarative-net-request'
import { memoizeAsync } from '@/libs/cache'
export * from './continuation'

export enum Endpoint {
  /**
   * Used for recommended, get channel, history, etc. The parameters come from browseEndpoint in the YT responses.
   * Recommended - ~1-2s
   * Channel Tabs - ~250ms
   */
  Browse = 'browse',
  /** Used for searching obviously */
  Search = 'search',
  /** Used to populate the sidebar and notably contains all of the subscribed channels. ~200ms*/
  Guide = 'guide',
  /** TODO: */
  Next = 'next',
  /** Used for getting the information needed to play a video. ~200ms */
  Player = 'player',
  /** Used for unsubscribing from a channel. ~500ms */
  Unsubscribe = 'subscription/unsubscribe',
  /** Used for subscribing to a channel. ~500ms */
  Subscribe = 'subscription/subscribe',
  /** Used for liking a video. ~300ms */
  Like = 'like/like',
  /** Used for disliking a video. ~300ms */
  Dislike = 'like/dislike',
  /** Used for removing like or dislike from a video. ~300ms */
  RemoveLike = 'like/removelike',
  /** Used for commenting on a video. ~600ms */
  CreateComment = 'comment/create_comment',
  /** Used for replying to a comment. ~600ms */
  CreateCommentReply = 'comment/create_comment_reply',
  /** Used for liking/disliking a comment and likely others. ~400ms */
  PerformCommentAction = 'comment/perform_comment_action',
  /** Used for creating a playlist. ~400ms */
  CreatePlaylist = 'playlist/create',
  /** Used for deleting a playlist. ~400ms */
  DeletePlaylist = 'playlist/delete',
  /** Used for making all modifications to playlists. ~600ms */
  EditPlaylist = 'browse/edit_playlist',
}
const cacheableEndpoints = new Set([
  Endpoint.Browse,
  Endpoint.Search,
  Endpoint.Guide,
  Endpoint.Next,
  Endpoint.Player,
])

export enum BrowseId {
  // Should be unneeded because of guide
  // Subscribed = 'FEchannels',
  Recommended = 'FEwhat_to_watch',
  History = 'FEhistory',
  Subscriptions = 'FEsubscriptions',
  Library = 'FElibrary',
}

/**
 * Must be escaped and converted to base64
 * The data sent to youtube is a protobuf message. The first byte is the type and the second byte is the field number.
 */
export enum BrowseParams {
  ChannelHome = '\x12\bfeatured',
  ChannelVideos = '\x12\x06videos',
  ChannelPlaylists = '\x12\tplaylists',
  ChannelCommunity = '\x12\tcommunity',
  ChannelChannels = '\x12\bchannels',
  ChannelLive = '\x12\x04live',
}

export const fetchYt = memoizeAsync(
  async <T = unknown>(endpoint: Endpoint | string, body: Record<string, unknown>): Promise<T> => {
    await setDeclarativeNetRequestHeaderRule()
    const [sapisid, apiKey] = await Promise.all([fetchSAPISID(), fetchAPIKey()])

    console.log('fetchYt', { endpoint, body, sapisid, apiKey })

    const res = await fetchProxy(`https://www.youtube.com/youtubei/v1/${endpoint}?key=${apiKey}`, {
      headers: {
        Authorization: `SAPISIDHASH ${sapisid}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        context: getContext(),
        ...body,
      }),
      method: 'POST',
      credentials: 'include',
    })
    if (res.ok) return res.json()
    const errorText = await res.text()
    throw Error(`YT ${endpoint} request failed with status code ${res.status}:\n${errorText}`)
  },
  {
    argsToKey: (endpoint, body) =>
      `${cacheableEndpoints.has(endpoint) ? endpoint : Math.random()}|${JSON.stringify(body)}`,
  },
)

// todo: lock to english since our date parsing relies on it
export const getContext = () =>
  Object.freeze({
    client: {
      browserName: 'Chrome',
      browserVersion: '123.0.0.0',
      clientFormFactor: 'UNKNOWN_FORM_FACTOR',
      clientName: 'WEB',
      // TODO: Fetch from youtube page? Or manually update
      clientVersion: '2.20240408.01.00',
      clientPlayer: 'UNIPLAYER',
      clientPlatform: 'DESKTOP',
      osName: 'X11',

      gl: 'CA',
      hl: 'en-GB',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })

type ServiceTrackingParams = {
  service: string
  params: { key: string; value: string }[]
}

export type ResponseContext = {
  serviceTrackingParams: ServiceTrackingParams[]
  maxAgeSeconds: number
  mainAppWebResponseContext: {
    datasyncId: string
    loggedOut: boolean
  }
  webResponseContextExtensionData: {
    hasDecorated: boolean
    // TODO: Has some other stuff too depending on context. Should probably just Record<string, any> on all of this tbh
  }
}

export type BaseResponse = {
  responseContext: ResponseContext
  frameworkUpdates: Record<string, unknown>
  topbar?: Record<string, unknown>
}
