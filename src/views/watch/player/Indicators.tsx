import { useContext } from 'react'
import { PlayerContext } from './context'
import { useBuffering } from './hooks/use'

export default function Indicators() {
	const playerInstance = useContext(PlayerContext)
	const { buffering } = useBuffering(playerInstance!)

	if (buffering) {
		return
	}
}
