import React from 'react'
import * as std from '@std'
import { MantineColor, MantineSize } from '@mantine/core'
import { VerifiedBadge } from './Badges'
import { LinkWithHover } from './Link'

export const Author: React.FC<{
  author: Pick<std.User, 'name' | 'verified' | 'id'>
  size?: MantineSize
  color?: MantineColor
}> = ({ author, size = 'md', color }) => (
  <LinkWithHover href={`/c/${author.id}`} color={color} size={size}>
    {author.name}
    {author.verified === std.VerifiedStatus.Verified && <VerifiedBadge size={size} />}
  </LinkWithHover>
)
