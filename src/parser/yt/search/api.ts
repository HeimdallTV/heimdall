import { fetchProxy } from '@libs/extension'
import { getContinuationResponseItems } from '@yt/components/continuation'
import { Endpoint, fetchYt, fetchEndpointContinuation, makeContinuationIterator } from '@yt/core/api'
import { SearchResponse, SearchResponseContinuation, SearchSuggestions } from './types'

export const fetchSearch = (query: string): Promise<SearchResponse> => fetchYt(Endpoint.Search, { query })
export const fetchSearchContinuation = fetchEndpointContinuation(Endpoint.Search)<SearchResponseContinuation>

export const fetchSearchIterator = (query: string) =>
  makeContinuationIterator(
    () =>
      fetchSearch(query).then(
        res => res.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents,
      ),
    token => fetchSearchContinuation(token).then(getContinuationResponseItems),
  )

/** TODO: Youtube includes video_id when on a video. What else do they include? How does this affect results? */
export const fetchSearchSuggestions = (query: string): Promise<SearchSuggestions> =>
  fetchProxy(
    `https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&q=${encodeURIComponent(
      query,
    )}&callback=google.sbox.p50`,
  )
    .then(res => res.text())
    .then(res => JSON.parse(res.slice(35, -1)))
