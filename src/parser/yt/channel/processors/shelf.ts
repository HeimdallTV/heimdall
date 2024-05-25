import * as std from '@std'
import type { HorizontalList, Shelf } from '../../components/core'
import { type GridVideo, processGridVideo } from '../../video/processors/grid'
import { combineSomeText } from '../../components/text'
import { getBrowseEndpointUrl } from '../../components/utility/endpoint'
import type { GridChannel } from '../types'
import { isRenderer } from '../../core/internals'
import { processGridChannel } from './grid'
import { processGridPlaylist } from '../../playlist/processors/grid'

export const processShelf = ({
  shelfRenderer: shelf,
}: Shelf<HorizontalList<GridVideo> | HorizontalList<GridChannel>>): std.Shelf<
  std.ShelfType.Videos | std.ShelfType.Channels | std.ShelfType.Playlists
> => {
  const items = shelf.content.horizontalListRenderer.items
  const isVideo = items.some(isRenderer('gridVideo'))
  const isChannel = items.some(isRenderer('gridChannel'))
  const isPlaylist = items.some(isRenderer('gridPlaylist'))

  if (!isVideo && !isChannel && !isPlaylist) {
    throw new Error('Unknown shelf type')
  }

  return {
    provider: std.ProviderName.YT,
    type: isVideo ? std.ShelfType.Videos : isChannel ? std.ShelfType.Channels : std.ShelfType.Playlists,
    name: combineSomeText(shelf.title),
    shortDescription: shelf.subtitle && combineSomeText(shelf.subtitle),
    href: shelf.navigationEndpoint && getBrowseEndpointUrl(shelf.navigationEndpoint),
    items: shelf.content.horizontalListRenderer.items
      .map((renderer) => {
        if (isRenderer('gridVideo')(renderer)) return processGridVideo(renderer)
        if (isRenderer('gridChannel')(renderer)) return processGridChannel(renderer)
        if (isRenderer('gridPlaylist')(renderer)) return processGridPlaylist(renderer)
        console.warn(`Unknown renderer type "${Object.keys(renderer)[0]}" in shelf... ignoring`)
      })
      .filter((item): item is std.Video | std.Channel | std.Playlist => Boolean(item)),
  }
}
