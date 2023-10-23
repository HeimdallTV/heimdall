import { Image } from './components/image'
import { RichText } from './components/rich-text'
import { User, ProviderName, Video } from '.'

export type Playlist = {
  provider: ProviderName
  id: string
  title: string
  author?: User

  /** Example: https://www.youtube.com/channel/UC-9b7aDP6ZN0coj9-xFnrtw */
  shortDescription?: string
  description?: RichText

  staticThumbnail: Image[]
  /** Probably unused? */
  animatedThumbnail?: Image[]

  videoCount?: number
  videos: AsyncGenerator<Video>
}
