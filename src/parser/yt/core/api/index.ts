import { fetchProxy } from '@libs/extension'
import { fetchSAPISID } from './sapisid'
import { fetchAPIKey } from './api-key'
import { setDeclarativeNetRequestHeaderRule } from './declarative-net-request'
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
  Unsubscribe = 'unsubscribe',
  /** Used for subscribing to a channel. ~500ms */
  Subscribe = 'subscribe',
  /** Used for liking a video. ~300ms */
  Like = 'like',
  /** Used for disliking a video. ~300ms */
  Dislike = 'dislike',
  /** Used for removing like or dislike from a video. ~300ms */
  RemoveLike = 'removelike',
}

export enum BrowseId {
  // Should be unneeded because of guide
  // Subscribed = 'FEchannels',
  Recommended = 'FEwhat_to_watch',
  History = 'FEhistory',
}

/** Must be escaped and converted to base64 */
export enum BrowseParams {
  ChannelHome = '\x12\bfeatured',
  ChannelVideos = '\x12\x06videos',
  ChannelPlaylists = '\x12\tplaylists',
  ChannelCommunity = '\x12\tcommunity',
  ChannelChannels = '\x12\bchannels',
  ChannelAbout = '\x12\x05about',
}

export const fetchYt = async <T = any>(endpoint: Endpoint, body: Record<string, any>): Promise<T> => {
  await setDeclarativeNetRequestHeaderRule()
  const [sapisid, apiKey] = await Promise.all([fetchSAPISID(), fetchAPIKey()])
  const res = await fetchProxy(`https://www.youtube.com/youtubei/v1/${endpoint}?key=${apiKey}`, {
    headers: {
      authorization: `SAPISIDHASH ${sapisid}`,
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
}

const getContext = () =>
  Object.freeze({
    client: {
      clientName: 'WEB',
      // TODO: Fetch from youtube page? Or manually update
      clientVersion: '2.20231016.04.01',
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
  frameworkUpdates: Record<string, any>
  topbar?: Record<string, any>
}
