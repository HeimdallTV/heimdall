import { MantineSize } from '@mantine/core'
import {
  IconCircleCheckFilled,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from '@tabler/icons-react'
import * as std from '@std'

// todo: get from the --mantine-font-size-* or the theme object
// todo: move somewhere else
const sizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
}
export const resolveSize = (size: MantineSize) => sizes[size]

export const VerifiedBadge = ({ size = 'md' }: { size?: MantineSize }) => (
  <IconCircleCheckFilled size={resolveSize(size)} />
)

export const LikeIcon = ({ likeStatus, size }: { likeStatus: std.LikeStatus; size: MantineSize }) =>
  likeStatus === std.LikeStatus.Like ? (
    <IconThumbUpFilled size={resolveSize(size)} />
  ) : (
    <IconThumbUp size={resolveSize(size)} />
  )
export const DislikeIcon = ({ likeStatus, size }: { likeStatus: std.LikeStatus; size: MantineSize }) =>
  likeStatus === std.LikeStatus.Dislike ? (
    <IconThumbDownFilled size={resolveSize(size)} />
  ) : (
    <IconThumbDown size={resolveSize(size)} />
  )
