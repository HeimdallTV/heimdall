import { VideoShelf } from '@/components/Shelf'
import { useAsync } from '@/hooks/useAsync'
import * as std from '@std'
import yt from '@yt'
import { useEffect } from 'preact/hooks'

export default function HomeTab({ channelId }: { channelId: string }) {
	const shelves = useAsync(() => yt.listChannelShelves!(channelId), [channelId])
	useEffect(() => {
		if (shelves.error) {
			console.error(shelves.error)
		}
	}, [shelves.error])

	if (!shelves.data) return null
	return (
		<div className="channel-max-width">
			{shelves.data.map((shelf, i) => (
				<VideoShelf key={shelf.name} {...shelf} size={i === 0 ? 'md' : 'sm'} videos={shelf.items} />
			))}
		</div>
	)
}
