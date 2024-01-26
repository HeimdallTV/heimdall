import * as std from '@std'
import { HorizontalList, Shelf } from '../../components/core'
import { GridVideo, processGridVideo } from '../../video/processors/grid'
import { combineSomeText } from '../../components/text'
import { getBrowseEndpointUrl } from '../../components/utility/endpoint'
import { GridChannel } from '../types'
import { isRenderer } from '../../core/internals'
import { processGridChannel } from './grid'

export const processShelf = ({
	shelfRenderer: shelf,
}: Shelf<HorizontalList<GridVideo> | HorizontalList<GridChannel>>): std.Shelf => {
	return {
		provider: std.ProviderName.YT,
		name: combineSomeText(shelf.title),
		shortDescription: shelf.subtitle && combineSomeText(shelf.subtitle),
		href: shelf.navigationEndpoint && getBrowseEndpointUrl(shelf.navigationEndpoint),
		items: shelf.content.horizontalListRenderer.items
			.map((renderer) => {
				if (isRenderer('gridVideo')(renderer)) return processGridVideo(renderer)
				if (isRenderer('gridChannel')(renderer)) return processGridChannel(renderer)
				console.warn(`Unknown renderer type "${Object.keys(renderer)[0]}" in shelf... ignoring`)
			})
			.filter((item): item is std.Video | std.Channel => Boolean(item)),
	}
}
