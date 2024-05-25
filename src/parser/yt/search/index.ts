import * as std from '@std'
import { processChannel } from '@yt/channel/processors/channel'
import { processVideo } from '@yt/video/processors/regular'
import { fetchSearchIterator, fetchSearchSuggestions } from './api'
import type { SearchItem } from './types'

const searchItemToResourceType = (item: SearchItem) =>
  'videoRenderer' in item ? std.ResourceType.Video : std.ResourceType.Channel
const processSearchItem = (item: SearchItem) =>
  'videoRenderer' in item ? processVideo(item) : processChannel(item)

// TODO: Refactor
export const listSearch = <
  Type extends std.ResourceType.Channel | std.ResourceType.Playlist | std.ResourceType.Video,
>(
  resourceTypes: Type[],
) =>
  async function* (query: string): AsyncGenerator<std.Resource<Type>[]> {
    for await (const sectionList of fetchSearchIterator(query)) {
      const results = sectionList[0].itemSectionRenderer.contents
      /**
       * TODO: Youtube sometimes returns shelves with many items that is collapsed by default.
       * For now, we'll just return however items are shown when collapsed but we should enable showing
       * all items at some point
       */
      const items = results.flatMap((item) =>
        'shelfRenderer' in item
          ? item.shelfRenderer.content.verticalListRenderer.items.slice(
              0,
              item.shelfRenderer.content.verticalListRenderer.collapsedItemCount,
            )
          : item,
      )

      // TODO: Playlists?
      yield items
        .filter((item) => resourceTypes.includes(searchItemToResourceType(item) as Type))
        .map(processSearchItem) as std.Resource<Type>[]
    }
  }

export const listSearchSuggestions = (_: std.ResourceType[]) => (query: string) =>
  fetchSearchSuggestions(query).then((res) => res[1].map((suggestion) => suggestion[0]))
