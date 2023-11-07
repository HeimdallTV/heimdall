'use client'

import { Flex } from 'lese'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

import { SearchBar } from './SearchBar'
import { Burger } from '@mantine/core'

const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  padding: 8px 24px;
`

export const Header = () => {
  const router = useRouter()

  return (
    <HeaderContainer>
      <Flex separation="24px" align>
        <Burger />
        <Link href="/">
          <img src="/logo.svg" style={{ height: '40px' }} />
        </Link>
      </Flex>
      <SearchBar onSearch={query => router.push(`/s/${query.replace(/\s+/, '+')}`)} />
      <div
        style={{
          background: 'var(--bg-800)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
        }}
      ></div>
    </HeaderContainer>
  )
}
