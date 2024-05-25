import type { Endpoint } from '@yt/core/internals'

/** Used for navigation within Youtube */
export type BrowseEndpoint = Endpoint<
  'browse',
  { browseId: string; params?: string; canonicalBaseUrl?: string }
>

export const getBrowseEndpointId = (endpoint: BrowseEndpoint) => endpoint.browseEndpoint.browseId

/** TODO Handle using the browseId when canonicalBaseUrl doesn't exist */
export const getBrowseEndpointUrl = (endpoint: BrowseEndpoint) => endpoint.browseEndpoint.canonicalBaseUrl
