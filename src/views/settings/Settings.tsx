import { Modal, ModalProps } from '@mantine/core'
import { Section } from './components'
import React, { Suspense } from 'react'

// todo: keybinds
// todo: theme

const PlayerGeneralSettings = React.lazy(() => import('./player/General'))
const PlayerSegmentSettings = React.lazy(() => import('./player/Segments'))

export default function Settings({ opened, onClose }: Pick<ModalProps, 'opened' | 'onClose'>) {
	return (
		<Modal opened={opened} onClose={onClose} withCloseButton={false} size="xl" padding="xl">
			<Section title="Player Settings">
				<Suspense>
					<PlayerGeneralSettings />
					<PlayerSegmentSettings />
				</Suspense>
			</Section>
		</Modal>
	)
}
