import Search from './views/Search';

export default function SearchPage({ params }: { params: { query: string } }) {
  return <Search query={params.query} />
}
