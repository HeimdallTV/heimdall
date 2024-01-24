import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'

import yt from '@yt'

export default function Home() {
	const videoPages = usePaginated(yt.listRecommended!)
	console.log(videoPages.data.flat())
	return (
		<VideoGrid as="main" header="Recommended" videos={videoPages.data.flat()} getNext={videoPages.next} />
	)
}
