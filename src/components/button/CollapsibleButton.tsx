import { Button, type ButtonProps } from '@mantine/core'
import styled from 'styled-components'

// todo: test for rightSection and loading
export const CollapsibleButton = styled(Button)<
  { collapseWidth?: string } & ButtonProps & React.HTMLAttributes<HTMLButtonElement>
>`
  @container (max-width: ${props => props.collapseWidth ?? '400px'}) {
    padding-right: var(--_button-padding-left);
    & .mantine-Button-section {
      margin-left: 0;
      margin-right: 0;
    }
    & .mantine-Button-label {
      display: none;
    }
  }
`

export const CollapsedButton = styled(Button)<
  { collapseWidth?: string } & ButtonProps & React.HTMLAttributes<HTMLButtonElement>
>`
  --button-padding-x: calc(var(--button-padding-x-sm) / 1.5);
`
