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
  colors: {
    dark: [
      '#C9C9C9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#393348',
      '#332E41',
      '#2d2939',
      '#1E1E28',
      '#1c1a24',
      '#131019',
    ],
    // dark: [
    //   '#131019',
    //   '#1B1923',
    //   '#1c1a24',
    //   '#1E1E28',
    //   '#1E1E28',
    //   '#20202b',
    //   '#232330',
    //   '#2d2939',
    //   '#332E41',
    //   '#393348',
    // ],
  },
  lineHeights: {
    xs: '1.3',
    sm: '1.35',
    md: '1.45',
    lg: '1.5',
    xl: '1.55',
  },
})

const Shell = styled.div`
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
      <body>
        <noscript>
          <p>Heimdall requires JavaScript to function</p>
        </noscript>
        <StyledComponentsRegistry>
          <MantineProvider theme={theme} defaultColorScheme="dark">
            <Shell className={roboto.className}>
              <NavBar />
              {children}
            </Shell>
          </MantineProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
