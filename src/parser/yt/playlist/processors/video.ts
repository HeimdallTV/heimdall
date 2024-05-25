import * as std from '@std'
import { type ManyText, type Text, combineSomeText } from '../../components/text'
import { parseDate } from '../../video/processors/helpers'
import { fromShortHumanReadable } from '../../core/helpers'
import type { Renderer, Runs, Some } from '../../core/internals'
import type { Navigation } from '../../components/utility/navigation'
import type { Thumbnail, ThumbnailOverlays } from '../../components/thumbnail'
import type { Menu } from '../../components/menu'

export type PlaylistVideo = Renderer<
  'playlistVideo',
  {
    /** Index starts at "1" */
    index: Some<Text>
    videoId: string
    /** Id of this instance of the video in this playlist. Used for referencing the video when doing i.e. reordering */
    setVideoId: string
    title: Some<Text>
    /** Typically the author of the video */
    shortBylineText: Runs<Navigation & ManyText>
    thumbnail: Thumbnail
    thumbnailOverlays: ThumbnailOverlays
    /** Length in number format such as "515" */
    lengthSeconds: string
    /** Length in the format "X:XX" */
    lengthText: Some<Text>
    /** Typically runs in the format: ["Xk views", " • ", "Y months ago"] */
    videoInfo: Runs<ManyText>
    menu: Menu<Renderer<'TODO'>>
  }
>

export function processPlaylistVideo({ playlistVideoRenderer: video }: PlaylistVideo): std.Video {
  return {
    provider: std.ProviderName.YT,
    type: std.VideoType.Static,
    id: video.videoId,
    author: {
      id: video.shortBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId,
      name: combineSomeText(video.shortBylineText),
    },

    title: combineSomeText(video.title),
    staticThumbnail: video.thumbnail.thumbnails,

    viewCount: fromShortHumanReadable(video.videoInfo.runs[0].text),
    length: Number(video.lengthSeconds),
    publishDate: parseDate(video.videoInfo.runs[2].text),
  }
}
