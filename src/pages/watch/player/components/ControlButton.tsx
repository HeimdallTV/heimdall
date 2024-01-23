import { UnstyledButton, UnstyledButtonProps } from '@mantine/core'
import styled from 'styled-components'

export const ControlButton = styled(UnstyledButton)<
	React.ButtonHTMLAttributes<HTMLButtonElement> & UnstyledButtonProps
>`
  display: flex;
  align-items: center;
  padding: 4px;
`
