import { Row } from 'lese'
import { Link, useLocation } from 'wouter'
import { styled } from '@linaria/react'

import { SearchBar } from './SearchBar'
import { Burger } from '@mantine/core'

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  padding: 8px 24px;
`

export const Header = () => {
  const [_, setLocation] = useLocation()

  return (
    <HeaderContainer>
      <Row separation="24px" align>
        <Burger />
        <Link href="/">
          <img src="/logo.svg" style={{ height: '40px' }} />
        </Link>
      </Row>
      <SearchBar onSearch={query => setLocation(`/s/${query.replace(/\s+/, '+')}`)} />
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
