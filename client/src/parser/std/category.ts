import { Image } from "./components/image"
import { ProviderName } from "./core"

enum CategoryType {
  Generic = 'generic',
  Gaming = 'gaming'
}

// TODO: To be enabled later
type Category = {
  provider: ProviderName
  id: string
  type: CategoryType
  name: string

  description?: string
  tags?: { id?: string, name: string }[]
  viewCount?: number

  followed?: boolean
  followerCount?: number

  staticThumbnail?: Image[]
}

export type GameCategory = Category & {
  type: CategoryType.Gaming
  developer?: string
}
