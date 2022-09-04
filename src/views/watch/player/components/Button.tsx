import styled from '@emotion/styled'

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  background: none;
  color: inherit;
  margin: none;
  padding: 4px;
  border: none;
  outline: none;
  cursor: ${({ disabled, onClick }) => (disabled || !onClick ? 'default' : 'pointer')};

  svg {
    font-size: 28px;
  }
`
