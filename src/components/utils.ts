import { MantineSize } from '@mantine/core'

const sizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
}
export const resolveSize = (size: MantineSize) => sizes[size]
