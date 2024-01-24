import { Divider, Text, Title } from '@mantine/core'
import { Column, Grid } from 'lese'

export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<Column separation="20px" yAlign>
		<Title size="h4" style={{ gridColumn: '1 / 3' }}>
			{title}
		</Title>
		<Divider />
		{children}
	</Column>
)

export const Label = ({
	label,
	description,
	children,
	reverse,
}: { label: string; description?: string; children: React.ReactNode; reverse?: boolean }) => (
	<Grid gap={reverse ? '8px 12px' : '4px 16px'} columns="auto 1fr" autoRows="auto" yAlign>
		{!reverse && children}
		<Text>{label}</Text>
		{reverse && children}
		{description && (
			<Text size="sm" c="dimmed" style={{ gridColumn: reverse ? '1 / 3' : '2' }}>
				{description}
			</Text>
		)}
	</Grid>
)
