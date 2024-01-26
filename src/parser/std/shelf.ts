import { GameCategory } from './category'
import { Channel } from './channel'
import { ProviderName } from './core'
import { Video } from './video'

export type Shelf = {
	provider: ProviderName
	name: string
	href?: string
	shortDescription?: string
	items: (GameCategory | Channel | Video)[]
}
