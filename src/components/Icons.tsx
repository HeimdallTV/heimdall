import { MantineSize } from '@mantine/core'
import { IconThumbDown, IconThumbDownFilled, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import * as std from '@std'
import { resolveSize } from './utils'

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
