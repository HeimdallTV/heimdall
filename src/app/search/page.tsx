import { useSearchParams } from 'next/navigation'
import Search from './views/Search'

export default function SearchPage() {
  const query = useSearchParams().get('query')
  if (!query) return 'No id query'
  return <Search query={query} />
}
