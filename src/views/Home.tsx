import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'

import yt from '@yt'

export default function Home() {
	const videoPages = usePaginated(yt.listRecommended!)
	return (
		<VideoGrid
			as="main"
			header="Recommended"
			loading={videoPages.loading}
			videos={videoPages.data.flat()}
			getNext={videoPages.next}
		/>
	)
}
