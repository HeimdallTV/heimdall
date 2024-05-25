import { type Endpoint, headOfSome, type Some, type SomeOptions } from '../../core/internals'
import {
  type BrowseEndpoint,
  getBrowseEndpointId,
  getBrowseEndpointUrl,
  getEndpointUrl,
  getUrlEndpointUrl,
  getWatchEndpointId,
  getWatchEndpointUrl,
  type UrlEndpoint,
  type WatchEndpoint,
} from './endpoint'

export const mapNavigationEndpoint =
  <EP extends Endpoint, A>(a: (val: EP) => A) =>
  <T extends Record<never, never>, U extends Record<never, never>>(
    some: Some<NavigationSome<EP, SomeOptions<T, U>>> | Navigation<EP>,
  ) =>
    a(headOfSome(some).navigationEndpoint)

/** General function for converting a navigation endpoint to a relative or absolute url */
export const getNavigationUrl = mapNavigationEndpoint(getEndpointUrl)

export const getBrowseNavigationId = mapNavigationEndpoint(getBrowseEndpointId)
export const getBrowseNavigationUrl = mapNavigationEndpoint(getBrowseEndpointUrl)
export const getUrlNavigationUrl = mapNavigationEndpoint(getUrlEndpointUrl)
export const getWatchNavigationUrl = mapNavigationEndpoint(getWatchEndpointUrl)
export const getWatchNavigationId = mapNavigationEndpoint(getWatchEndpointId)

export const mapNavigation = <T, U extends Record<never, never>>(
  callback: ({ id, baseUrl }: { id: string; baseUrl?: string }) => T,
  value: Navigation<BrowseEndpoint> & U,
): T =>
  callback({
    id: value.navigationEndpoint.browseEndpoint.browseId,
    baseUrl: value.navigationEndpoint.browseEndpoint.canonicalBaseUrl,
  })

export type NavigationSome<
  NavigationEndpoint extends Endpoint = BrowseEndpoint,
  T extends SomeOptions<Record<never, never>, Record<never, never>> = SomeOptions<
    Record<never, never>,
    Record<never, never>
  >,
> = T extends SomeOptions<infer U, infer V>
  ? SomeOptions<Navigation<NavigationEndpoint> & U, Navigation<NavigationEndpoint> & V>
  : never

export type Navigation<NavigationEndpoint extends Endpoint = BrowseEndpoint> = Endpoint<
  'navigation',
  NavigationEndpoint
>

export type AllNavigation = Navigation<BrowseEndpoint | UrlEndpoint | WatchEndpoint>
