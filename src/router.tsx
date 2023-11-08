import { Route } from 'wouter'
import Home from './pages/Home'
import WatchPage from './pages/watch/page'
import SearchPage from './pages/search/page'

export default function Router() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/w/:id">{params => <WatchPage videoId={params.id} />}</Route>
      <Route path="/s/:query">{params => <SearchPage query={params.query} />}</Route>
    </>
  )
}
