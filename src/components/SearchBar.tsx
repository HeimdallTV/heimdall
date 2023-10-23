import { useState } from 'react';

import { Flex } from 'lese';
import { useParams } from 'react-router';
import styled from 'styled-components';

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-search"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const SearchBarStyled = styled('input')<React.InputHTMLAttributes<HTMLInputElement>>`
  border: none;
  outline: none;
  border-radius: 16px 0 0 16px;
  font-size: 1.2em;

  background-color: var(--bg-800);
  color: var(--text-primary);

  padding: 12px 24px;
  min-width: 400px;
`

const SearchBarButton = styled('button')`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 24px;

  border: none;
  outline: none;
  border-radius: 0 16px 16px 0;

  cursor: pointer;

  background-color: var(--bg-900);
  color: var(--text-primary);
`

export type SearchBarProps = { onSearch: (query: string) => void }
export const SearchBar: React.FC<SearchBarProps> = props => {
  const params = useParams()
  const [query, setQuery] = useState(params.query)

  return (
    <Flex>
      <SearchBarStyled
        placeholder="Search..."
        value={query}
        onChange={e => {
          setQuery((e.target as HTMLInputElement).value)
        }}
        onKeyDown={e => {
          if (e.key !== 'Enter') return
          props.onSearch((e.target as HTMLInputElement).value)
          e.preventDefault()
        }}
      />
      <SearchBarButton>
        <SearchIcon />
      </SearchBarButton>
    </Flex>
  )
}
