import { ToggleButton } from '../components/button'
import { ContinuationItem } from '../components/continuation'
import { Text } from '../components/text'
import { Thumbnail, ThumbnailOverlays } from '../components/thumbnail'
import { BrowseEndpoint } from '../components/utility/endpoint'
import { LikeEndpoint } from '../components/utility/endpoints'
import { Command, CommandMetadata, Renderer, Some } from '../core/internals'
import { PlaylistVideo } from './processors/video'

export type PlaylistVideoList = Renderer<
  'playlistVideoList',
  {
    playlistId: string
    isEditable: boolean
    canReorder: boolean
    contents: (PlaylistVideo | ContinuationItem)[]
    /** Skipping this since it doesn't provide any needed info to do re-ordering */
    onReorderEndpoint: Renderer<'TODO'>
    /** Provides sorting options, skipping for now */
    sortFilterMenu: Renderer<'TODO'>
  }
>

type HeroPlaylistThumbnail = Renderer<
  'heroPlaylistThumbnail',
  {
    thumbnail: Thumbnail
    thumbnailOverlays: ThumbnailOverlays
    /** Image aspect ratio as height / width */
    maxRatio: number
    /** Points to playing the first video in the playlist */
    onTap: Renderer<'TODO'>
  }
>

/** Missing plenty of fields that were deemed unneeded */
export type PlaylistHeader = Renderer<
  'playlistHeader',
  {
    playlistId: string
    title: Some<Text>
    descriptionText: Some<Text>
    privacy: 'PUBLIC' | 'UNLISTED' | 'PRIVATE'
    playlistHeaderBanner: HeroPlaylistThumbnail
    numVideosText: Some<Text>

    isEditable: boolean
    saveButton?: ToggleButton<
      Command<'', Record<never, never>, LikeEndpoint>,
      Command<'', Record<never, never>, LikeEndpoint>
    >
    editableDetails: { canDelete: boolean }

    ownerText: Some<Text>
    ownerEndpoint: BrowseEndpoint & CommandMetadata
  }
>
