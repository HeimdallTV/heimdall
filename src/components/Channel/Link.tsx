import { Flex, Row } from 'lese'
import Link from 'next/link'
import styled from 'styled-components'

import { IconCircleCheckFilled } from '@tabler/icons-react'
import * as std from '@std'

import { ExternalLink, Text } from '../Typography'

// Channel Icon
type ChannelIconProps = {
  channel: std.User
  size?: number
}

// Seems to be a bug with types? Removing the ImgHTMLAttributes makes alt and src undefined
const ChannelIconImage = styled('img')<{ size?: number } & React.ImgHTMLAttributes<HTMLImageElement>>`
  width: ${({ size }) => `${size ?? 36}px`};
  height: ${({ size }) => `${size ?? 36}px`};
  border-radius: 50%;

  background-color: var(--bg-700);
`

export const ChannelIcon: React.FC<ChannelIconProps> = props => (
  <ChannelIconImage size={props.size} src={props.channel.avatar[0].url} />
)

export const ChannelIconWithName: React.FC<ChannelIconProps> = props => (
  <Link href={`/c/${props.channel.id}`} {...props}>
    <Flex yAlign separation="8px">
      <ChannelIconImage size={props.size} src={props.channel.avatar[0].url} />
      <ExternalLink secondary medium>
        {props.channel.name}
      </ExternalLink>
    </Flex>
  </Link>
)

/** @deprecated */
export const ChannelLink: React.FC<Omit<ChannelIconProps, 'size'>> = props => (
  <Link href={`/c/${props.channel.id}`} {...props}>
    <ExternalLink secondary medium>
      {props.channel.name}
    </ExternalLink>
  </Link>
)

/** @deprecated */
export const CompactChannelLink: React.FC<Omit<ChannelIconProps, 'size'>> = props => (
  <Link href={`/c/${props.channel.id}`} {...props}>
    <ExternalLink secondary>{props.channel.name}</ExternalLink>
  </Link>
)

export const ChannelName: React.FC<{ author: Pick<std.User, 'name' | 'verified' | 'id'> }> = ({ author }) => (
  <Link href={`/c/${author.id}`} style={{ color: 'currentColor' }}>
    <Row separation="4px" yAlign>
      <Text medium>{author.name}</Text>
      {author.verified && <IconCircleCheckFilled size={18} />}
    </Row>
  </Link>
)
