import type { MantineSize } from '@mantine/core'
import {
  IconCircleCheckFilled,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from '@tabler/icons-react'
import * as std from '@std'
import { resolveSize } from './utils'

// todo: get from the --mantine-font-size-* or the theme object
// todo: move somewhere else

export const VerifiedBadge = ({ size = 'md' }: { size?: MantineSize }) => (
  <IconCircleCheckFilled size={resolveSize(size)} />
)
