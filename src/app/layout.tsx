'use client'
import { Roboto } from 'next/font/google'

import StyledComponentsRegistry from './StyledComponentRegistry'

import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core'
import { NavBar } from '@/components/NavBar'
import '@mantine/core/styles.css'
import './layout.css'
import styled from 'styled-components'

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

const Shell = styled.body`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: auto 1fr;

  > * {
    overflow-y: auto;
  }
`

// todo: swap appshell out for just a regular grid?
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <Shell className={roboto.className}>
          <MantineProvider theme={theme} defaultColorScheme="dark">
            <NavBar />
            {children}
          </MantineProvider>
        </Shell>
      </StyledComponentsRegistry>
    </html>
  )
}
