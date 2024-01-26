import * as std from '@std'
import { useState } from 'react'
import { Column } from 'lese'
import { Button, Divider, Text } from '@mantine/core'
import { VideoGrid } from './Video/Grid'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { Link } from 'wouter'

// todo: detect when all items are shown and dont show the divider
type ShelfProps = Pick<std.Shelf, 'name' | 'shortDescription' | 'href'> & {
	expanded: boolean
	onExpandedChange: (expanded: true) => void
}
export const Shelf: FC<PropsWithChildren<ShelfProps>> = ({
	name,
	shortDescription,
	href,
	expanded,
	onExpandedChange,
	children,
}) => {
	return (
		<Column>
			<Column separation="2px" style={{ marginBottom: '16px' }}>
				<Text component={href ? Link : 'h2'} href={href} size="xl" fw="bold">
					{name}
				</Text>
				{shortDescription && (
					<Text component="h3" c="dimmed" fw={500}>
						{shortDescription}
					</Text>
				)}
			</Column>
			{children}
			<ShowMoreDivider expanded={expanded} onClick={() => onExpandedChange(!expanded)} />
		</Column>
	)
}

type VideoShelfProps = Omit<ShelfProps, 'expanded' | 'onExpand'> & {
	size: 'sm' | 'md'
	videos: std.Video[]
}
export const VideoShelf: FC<VideoShelfProps> = ({ size, videos, ...props }) => {
	const [expanded, setExpanded] = useState(false)
	return (
		<Shelf {...props} expanded={expanded} onExpandedChange={setExpanded}>
			<VideoGrid size={size} collapsed={!expanded} videos={videos} />
		</Shelf>
	)
}

const ShowMoreDivider = ({ expanded, onClick }: { expanded: boolean; onClick: () => void }) => {
	const text = expanded ? 'Show less' : 'Show more'
	const Icon = expanded ? IconChevronUp : IconChevronDown
	return (
		<Divider
			label={
				<Button variant="transparent" onClick={onClick}>
					{text} <Icon size={24} style={{ marginLeft: '4px' }} />
				</Button>
			}
		/>
	)
}
