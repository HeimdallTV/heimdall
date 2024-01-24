import { IconBrandSpeedtest, IconCheck } from '@tabler/icons-react'
import { useContext } from 'react'
import { PlayerContext } from '../context'
import { usePlaybackRate } from '../hooks/use'
import { ControlButton } from '../components/ControlButton'

import { Menu } from '@mantine/core'

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export const PlaybackRate: React.FC = () => {
	const playerInstance = useContext(PlayerContext)
	const { playbackRate, setPlaybackRate } = usePlaybackRate(playerInstance!)

	return (
		<Menu position="top" closeOnItemClick={false}>
			<Menu.Target>
				<ControlButton>
					<IconBrandSpeedtest />
				</ControlButton>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label>Playback rate</Menu.Label>
				{PLAYBACK_RATES.map((rate) => (
					<Menu.Item
						key={rate}
						leftSection={<IconCheck size={16} style={{ opacity: Number(playbackRate === rate) }} />}
						onClick={() => setPlaybackRate(rate)}
					>
						{rate}x
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	)
}
