import type { MantineSize } from '@mantine/core'
import styled from 'styled-components'
import { Link } from 'wouter'

export const LinkWithHover = styled(Link)<{
  size?: MantineSize
  color?: string
  fw?: number | string
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--mantine-color-${(_) => _.color ?? 'dimmed'});
  font-size: var(--mantine-font-size-${({ size }) => size ?? 'md'});
  font-weight: ${({ fw }) => fw ?? 'normal'};
  &:hover {
    color: var(--mantine-color-text);
  }
`
