import styled from '@emotion/styled'
import { ExternalLink, Text } from '../Typography'
import { Flex, Row } from 'lese'
import { Link, NavLink } from 'react-router-dom'
import * as std from '@std'
import { CheckCircleRounded } from '@mui/icons-material'

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

export const ChannelIcon: FC<ChannelIconProps> = props => (
  <NavLink to={`/c/${props.channel.id}`} {...props}>
    <ChannelIconImage size={props.size} src={props.channel.avatar[0].url} />
  </NavLink>
)

export const ChannelIconWithName: FC<ChannelIconProps> = props => (
  <NavLink to={`/c/${props.channel.id}`} {...props}>
    <Flex yAlign separation="8px">
      <ChannelIconImage size={props.size} src={props.channel.avatar[0].url} />
      <ExternalLink secondary medium>
        {props.channel.name}
      </ExternalLink>
    </Flex>
  </NavLink>
)

/** @deprecated */
export const ChannelLink: FC<Omit<ChannelIconProps, 'size'>> = props => (
  <NavLink to={`/c/${props.channel.id}`} {...props}>
    <ExternalLink secondary medium>
      {props.channel.name}
    </ExternalLink>
  </NavLink>
)

/** @deprecated */
export const CompactChannelLink: FC<Omit<ChannelIconProps, 'size'>> = props => (
  <NavLink to={`/c/${props.channel.id}`} {...props}>
    <ExternalLink secondary>{props.channel.name}</ExternalLink>
  </NavLink>
)

export const ChannelName: FC<{ author: Pick<std.User, 'name' | 'verified' | 'id'> }> = ({ author }) => (
  <Link to={`/c/${author.id}`} style={{ color: 'currentColor' }}>
    <Row separation="4px" yAlign>
      <Text medium>{author.name}</Text>
      {author.verified && <CheckCircleRounded />}
    </Row>
  </Link>
)
