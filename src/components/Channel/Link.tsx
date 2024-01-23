import { Row } from 'lese'
import { Link } from 'wouter'
import styled from 'styled-components'

import * as std from '@std'

import { Skeleton, Text } from '@mantine/core'
import { VerifiedBadge } from '../Badges'

// Channel Icon
type ChannelIconProps = {
	channel: std.User
	size?: number
}

// Seems to be a bug with types? Removing the ImgHTMLAttributes makes alt and src undefined
const ChannelIconImage = styled('img')<{ size: number } & React.HTMLAttributes<HTMLImageElement>>`
  width: ${({ size }) => `${size ?? 36}px`};
  height: ${({ size }) => `${size ?? 36}px`};
  border-radius: 50%;

  background-color: var(--bg-700);
`

export const ChannelIcon: React.FC<Partial<ChannelIconProps>> = (props) => {
	if (!props.channel?.avatar) return <Skeleton circle height={props.size ?? 36} />
	return <ChannelIconImage size={props.size ?? 36} src={props.channel.avatar[0].url} />
}

export const ChannelName: React.FC<{ author?: Pick<std.User, 'name' | 'verified' | 'id'> }> = ({
	author,
}) => {
	if (!author) return <Skeleton width="100px" height="1.2em" />
	return (
		<Row as={Link} href={`/c/${author.id}`} separation="4px" yAlign>
			<Text c="dark.0" fw={500}>
				{author.name}
			</Text>
			{author.verified && <VerifiedBadge size="md" />}
		</Row>
	)
}
