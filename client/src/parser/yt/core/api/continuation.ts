import { ContinuationItem } from '@yt/components/continuation'
import { fetchYt, Endpoint } from '.'
import { Renderer, findRenderer } from '../internals'

export const fetchEndpointContinuation =
  (endpoint: Endpoint) =>
  <T>(continuation: string): Promise<T> =>
    fetchYt(endpoint, { continuation })

export const findContinuation = (items: (Renderer | ContinuationItem)[]): string | undefined =>
  findRenderer('continuationItem')(items)?.continuationEndpoint.continuationCommand.token

export const isNotContinuationItem = <T extends Renderer>(item: T | ContinuationItem): item is T =>
  !('continuationItemRenderer' in item)

export async function* makeContinuationIterator<T extends Renderer>(
  getInitial: () => Promise<(T | ContinuationItem)[]>,
  getContinuation: (continuationToken: string) => Promise<(T | ContinuationItem)[]>,
): AsyncGenerator<T[]> {
  let continuationToken: string | undefined
  do {
    const results = await (continuationToken ? getContinuation(continuationToken) : getInitial())
    continuationToken = findContinuation(results)
    yield results.filter(isNotContinuationItem)
  } while (continuationToken)
}
