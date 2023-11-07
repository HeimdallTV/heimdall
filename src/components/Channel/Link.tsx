import { Flex, Row } from 'lese'
import Link from 'next/link'
import styled from 'styled-components'

import { IconCircleCheckFilled } from '@tabler/icons-react'
import * as std from '@std'

import { ExternalLink } from '../Typography'
import { Skeleton, Text } from '@mantine/core'

// Channel Icon
type ChannelIconProps = {
  channel?: std.User
  size?: number
}

// Seems to be a bug with types? Removing the ImgHTMLAttributes makes alt and src undefined
const ChannelIconImage = styled('img')<{ size: number } & React.ImgHTMLAttributes<HTMLImageElement>>`
  width: ${({ size }) => `${size ?? 36}px`};
  height: ${({ size }) => `${size ?? 36}px`};
  border-radius: 50%;

  background-color: var(--bg-700);
`

export const ChannelIcon: React.FC<ChannelIconProps> = props => {
  if (!props.channel) return <Skeleton circle height={props.size ?? 36} />
  return <ChannelIconImage size={props.size ?? 36} src={props.channel.avatar[0].url} />
}

export const ChannelIconWithName: React.FC<ChannelIconProps> = props => (
  <Flex as={Link} href={`/c/${props.channel.id}`} yAlign separation="8px">
    <ChannelIconImage size={props.size ?? 36} src={props.channel.avatar[0].url} />
    <ExternalLink secondary medium>
      {props.channel.name}
    </ExternalLink>
  </Flex>
)

/** @deprecated */
export const ChannelLink: React.FC<Omit<ChannelIconProps, 'size'>> = ({ channel }) => (
  <Text c="dimmed" fw={500} component={Link} href={`/c/${channel.id}`}>
    {channel.name}
  </Text>
)

// todo: can't make this a link because it gets nested in other links...
/** @deprecated */
export const CompactChannelLink: React.FC<Omit<ChannelIconProps, 'size'>> = ({ channel }) => (
  <Text size="sm" c="dimmed">
    {channel.name}
  </Text>
)

export const ChannelName: React.FC<{ author?: Pick<std.User, 'name' | 'verified' | 'id'> }> = ({
  author,
}) => {
  if (!author) return <Skeleton width="100px" height="1.2em" />
  return (
    <Row as={Link} href={`/c/${author.id}`} separation="4px" yAlign>
      <Text c="dark.0" fw={500}>
        {author.name}
      </Text>
      {author.verified && <IconCircleCheckFilled size={18} />}
    </Row>
  )
}
