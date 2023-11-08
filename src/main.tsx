import { render } from 'preact'

import { AppShell, Burger, MantineProvider, createTheme } from '@mantine/core'
import { NavBar } from '@/components/NavBar'
import { Link } from 'wouter'
import { useDisclosure } from '@mantine/hooks'
import '@mantine/core/styles.css'
import Router from './router'

const theme = createTheme({
  lineHeights: {
    xs: '1.3',
    sm: '1.35',
    md: '1.45',
    lg: '1.5',
    xl: '1.55',
  },
})

// todo: swap appshell out for just a regular grid?
function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(true)

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
        padding={0}
        transitionDuration={0}
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} size="sm" />
          <Link href="/">Recommended</Link>
          <Link href="/subscriptions">Subscriptions</Link>
          <Link href="/trending">Browse</Link>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <NavBar />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}

render(
  <Layout>
    <Router />
  </Layout>,
  document.getElementById('root')!,
)
