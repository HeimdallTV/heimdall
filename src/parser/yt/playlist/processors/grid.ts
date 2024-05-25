import * as std from '@std'
import { type MetadataBadge, isVerifiedBadge } from '../../components/badge'
import { type ManyText, type Text, combineSomeText } from '../../components/text'
import type { Thumbnail, ThumbnailOverlays } from '../../components/thumbnail'
import type { Navigation } from '../../components/utility/navigation'
import type { Renderer, Runs, Some } from '../../core/internals'

export type GridPlaylist = Renderer<
  'gridPlaylist',
  {
    playlistId: string
    title: Some<Text>

    /** Name of the author and "Playlist". I.e. "Veritasium", " · ", "Playlist" */
    longBylineText: Runs<Partial<Navigation> & ManyText>
    ownerBadges: MetadataBadge[]

    /** todo: include the additional colors for the playlist */
    thumbnail: Thumbnail
    thumbnailOverlays: ThumbnailOverlays
    /** Seems to contain a renderer that has the same data as the "thumbnail" field inside of it */
    thumbnailRenderer: Renderer<'TODO'>
    /** Nubmer of videos in the playlist, redundant with videoCountText */
    thumbnailText: Some<Text>
    /** Seems like these are used when displaying the full playlist, not sure. They're only 120px wide */
    sidebarThumbnails: Thumbnail[]

    /** Number formatted as string. Ex. "12" */
    videoCountShortText: Some<Text>
    /** Number formatted as string with type. Ex. "12 videos" */
    videoCountText: Some<Text>
    /** Contains navigation to full playlist */
    viewPlaylistText: Runs<Navigation & ManyText>
  }
>

export const processGridPlaylist = ({ gridPlaylistRenderer: playlist }: GridPlaylist): std.Playlist => {
  return {
    provider: std.ProviderName.YT,
    id: playlist.playlistId,
    title: combineSomeText(playlist.title),
    author:
      'longBylineText' in playlist
        ? {
            id: playlist.longBylineText.runs[0].navigationEndpoint!.browseEndpoint.browseId,
            name: playlist.longBylineText.runs[0].text,
            verified: std.verifiedFrom(playlist.ownerBadges.some(isVerifiedBadge)),
          }
        : undefined,
    thumbnail: playlist.thumbnail.thumbnails,
    // fixme: this is an assumption, is there anywhere it wouldn't be true?
    visibility: std.Visibility.Public,
    videoCount: Number(combineSomeText(playlist.videoCountShortText)),
  }
}
