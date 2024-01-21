import Watch from './views/Watch'

export default function WatchPage({ params }: { params: { id: string } }) {
  return <Watch videoId={params.id} />
}
