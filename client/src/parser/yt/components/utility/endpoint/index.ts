import { BrowseEndpoint, getBrowseEndpointUrl } from './browse'
import { UrlEndpoint, getUrlEndpointUrl } from './url'
import { WatchEndpoint, getWatchEndpointUrl } from './watch'

export * from './browse'
export * from './reel-watch'
export * from './url'
export * from './watch'

export const getEndpointUrl = (val: BrowseEndpoint | WatchEndpoint | UrlEndpoint) => {
  if ('urlEndpoint' in val) return getUrlEndpointUrl(val)
  if ('browseEndpoint' in val) return getBrowseEndpointUrl(val)
  if ('watchEndpoint' in val) return getWatchEndpointUrl(val)

  throw Error(`Unrecognized endpoint: ${JSON.stringify(val, undefined, 2)}`)
}
