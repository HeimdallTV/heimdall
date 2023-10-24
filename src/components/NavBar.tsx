'use client'

import Link from 'next/link'
import yt from '@yt'
import { usePaginated } from '@/hooks/usePaginated'
import { NavLink } from '@mantine/core'
import { ChannelIcon } from './Channel/Link'

export const NavBar = () => {
  const [followedUsers, , getNextPage] = usePaginated(yt.listFollowedUsers!)
  return followedUsers
    .flat()
    .map(user => (
      <NavLink
        key={user.id}
        component={Link}
        href={`/c/${user.id}`}
        leftSection={<ChannelIcon size={28} channel={user} />}
        label={user.name}
      />
    ))
}
