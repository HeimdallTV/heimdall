import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import { GlobalStyles } from '@/components/GlobalStyles';
import { Header } from '@/components/Header';

import StyledComponentsRegistry from './StyledComponentRegistry';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  style: ['italic', 'normal'],
})

export const metadata: Metadata = {
  title: 'Heimdall',
  description: 'Reverse Engineered Youtube, Twitch, Nebula, Curiosity Stream and Floatplane Client',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <GlobalStyles />
        <body className={roboto.className}>
          <Header />
          {children}
        </body>
      </StyledComponentsRegistry>
    </html>
  )
}
