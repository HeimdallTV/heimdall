'use client'
import { Roboto } from 'next/font/google'

import StyledComponentsRegistry from './StyledComponentRegistry'

import { AppShell, Burger, ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core'
import { NavBar } from '@/components/NavBar'
import { useDisclosure } from '@mantine/hooks'
import '@mantine/core/styles.css'
import './layout.css'
import Link from 'next/link'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  style: ['italic', 'normal'],
})

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
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(true)

  return (
    <html lang="en">
      <head>
        <title>Heimdall</title>
        <meta
          name="description"
          content="Reverse Engineered Youtube, Twitch, Nebula, Curiosity Stream and Floatplane Client"
        />
        <ColorSchemeScript />
      </head>
      <StyledComponentsRegistry>
        <body className={roboto.className}>
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
        </body>
      </StyledComponentsRegistry>
    </html>
  )
}
