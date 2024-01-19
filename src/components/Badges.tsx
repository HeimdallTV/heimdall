import { MantineSize } from '@mantine/core'
import {
  IconCircleCheckFilled,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from '@tabler/icons-react'
import * as std from '@std'

// todo: re-use this on all components
const resolveSize = (size: MantineSize) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--mantine-font-size-${size}`)

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
