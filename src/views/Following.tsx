import yt from '@yt'
import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'

export default function Following() {
	const videoPages = usePaginated(yt.listFollowedUsersVideos!)
	if (videoPages.errors.length) return <div>{videoPages.errors.map((e) => String(e)).join('\n')}</div>
	return (
		<VideoGrid
			as="main"
			header="Following"
			loading={videoPages.loading}
			videos={videoPages.data.flat()}
			getNext={videoPages.next}
		/>
	)
}
