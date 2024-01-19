'use client'
import { Roboto } from 'next/font/google'
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import './layout.css'
import '../dev'
import styled from 'styled-components'
import StyledComponentsRegistry from './StyledComponentRegistry'
import { NavBar } from '@/components/NavBar'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  style: ['italic', 'normal'],
})

const theme = createTheme({
  fontFamily: roboto.style.fontFamily,
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
        <noscript>Heimdall requires JavaScript to function</noscript>
        <StyledComponentsRegistry>
          <MantineProvider theme={theme} defaultColorScheme="dark">
            <Shell>
              <NavBar />
              {children}
            </Shell>
          </MantineProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
