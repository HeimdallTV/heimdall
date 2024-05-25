import type { ContinuationItem } from '../components/continuation'
import type { ItemSectionWithHeader, SectionList } from '../components/core'
import type { Tab } from '../components/tab'
import type { TwoColumnBrowseResults } from '../components/two-column'
import { type BaseResponse, Endpoint, fetchYt } from '../core/api'
import { isRenderer } from '../core/internals'
import { processPlaylistMetadata } from './processors/metadata'
import type { PlaylistHeader, PlaylistVideoList } from './types'

type PlaylistResponse = BaseResponse & {
  contents: TwoColumnBrowseResults<
    Tab<never, SectionList<ItemSectionWithHeader<PlaylistVideoList | ContinuationItem>>, true>
  >
  header: PlaylistHeader
}

export async function fetchPlaylist(id: string) {
  const res = await fetchYt<PlaylistResponse>(Endpoint.Browse, {
    browseId: `VL${id}`,
  })
  console.log(res)
  const playlistVideoList =
    res.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents.find(
      isRenderer('playlistVideoList'),
    )
  const playlistHeader = res.header
  if (!playlistVideoList) throw Error('Playlist not found in YT response')
  if (!playlistHeader) throw Error('Playlist header not found in YT response')
  return { playlistVideoList, playlistHeader }
}

export async function getPlaylist(id: string) {
  const { playlistVideoList, playlistHeader } = await fetchPlaylist(id)
  return processPlaylistMetadata(playlistVideoList, playlistHeader)
}
