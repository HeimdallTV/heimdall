import { VideoGrid } from '@/components/Video/Grid'
import { usePaginated } from '@/hooks/usePaginated'
import { formatDayRelative } from '@/libs/format'

import yt from '@yt'

export default function History() {
	const history = usePaginated(yt.listHistory!)
	if (history.errors.length) return <div>{history.errors.map((e) => String(e)).join('\n')}</div>
	return (
		<main>
			{history.data.flat().map(({ date, videos }) => (
				<VideoGrid
					as="section"
					key={date.toISOString()}
					header={formatDayRelative(date)}
					loading={false}
					videos={videos}
					padding="24px"
				/>
			))}
		</main>
	)
}
