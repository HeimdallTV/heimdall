import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import Home from '@views/Home'
import Watch from '@views/watch/Watch'
import Search from '@views/Search'

import { Header } from '@components/Header'
import { globalStyles } from '@constants'
import { Global } from '@emotion/react'
import { Outlet } from 'react-router'

const App = () => (
  <>
    <Global styles={globalStyles} />
    <Header />
    <Outlet />
  </>
)

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="w/:id" element={<Watch />} />
          <Route path="s/:query" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
