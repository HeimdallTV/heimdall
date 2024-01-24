import { Modal, ModalProps } from '@mantine/core'
import { Section } from './components'
import { PlayerGeneralSettings } from './player/General'
import { PlayerSegmentSettings } from './player/Segments'

export default function Settings({ opened, onClose }: Pick<ModalProps, 'opened' | 'onClose'>) {
	return (
		<Modal opened={opened} onClose={onClose} withCloseButton={false} size="xl" padding="xl">
			<Section title="Player Settings">
				<PlayerGeneralSettings />
				<PlayerSegmentSettings />
			</Section>
		</Modal>
	)
}
