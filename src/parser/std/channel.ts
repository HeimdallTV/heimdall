import { Image } from './components/image'
import { RichText } from './components/rich-text'
import { Video, Playlist, User, ProviderName, Shelf } from '.'

// TODO: How to handle twitch's panel?
/**
 * Includes all necessary information to render a channel page other than the videos and playlists
 * which should be fetched separately since it contains continuation data.
 */
export type Channel = {
	provider: ProviderName
	user: User
	id: string
	banner?: Image[]
	shortDescription?: string
	description?: RichText

	/** Ex. trailer or hosted channel */
	featuredVideo?: Video
}
