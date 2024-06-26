import { Button, type ButtonProps } from '@mantine/core'
import styled from 'styled-components'

// todo: test for rightSection and loading
export const CollapsibleButton = styled(Button)<
  { $collapseWidth?: string } & ButtonProps & React.HTMLAttributes<HTMLButtonElement>
>`
  @container (max-width: ${(props) => props.$collapseWidth ?? '400px'}) {
    padding-right: calc(var(--button-padding-x) / 1.5);
    & .mantine-Button-section {
      margin-left: 0;
      margin-right: 0;
    }
    & .mantine-Button-label {
      display: none;
    }
  }
`

export const CollapsedButton = styled(Button)<ButtonProps & React.HTMLAttributes<HTMLButtonElement>>`
  --button-padding-x: calc(var(--button-padding-x-sm) / 1.5);
`
