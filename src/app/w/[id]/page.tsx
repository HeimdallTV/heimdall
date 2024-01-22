import Watch from './views/Watch'

export const runtime = 'edge'
export default function WatchPage({ params }: { params: { id: string } }) {
  return <Watch videoId={params.id} />
}
