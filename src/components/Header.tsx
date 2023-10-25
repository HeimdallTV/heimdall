'use client'

import { Flex } from 'lese';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

import { SearchBar } from './SearchBar';

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-menu"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

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
        <HamburgerIcon />
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