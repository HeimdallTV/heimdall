import type { Image } from './components/image'
import type { RichText } from './components/rich-text'
import { type User, type ProviderName, Video, type Visibility } from '.'

export type Playlist = {
  provider: ProviderName
  id: string
  visibility: Visibility
  title: string
  /** Example: https://www.youtube.com/channel/UC-9b7aDP6ZN0coj9-xFnrtw */
  shortDescription?: string
  description?: RichText
  thumbnail: Image[]
  author?: User
  videoCount?: number

  saved?: boolean
  canSave?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canReorder?: boolean
}
