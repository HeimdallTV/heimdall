/**
 * Implements a double click handler that triggers the single click
 * handler after "eagerDelayMS" but continues to wait for a second click
 * for the "delayMS". This allows for quick feedback for interactions
 * that can also be double clicked, where the single click action is
 * reversible.
 * 0 ms - user clicks
 * eagerDelayMS - trigger eager click handler
 * 423ms (< delayMS) - user clicks
 * 423ms (< delayMS) - trigger double click handler with triggeredEager = true
 **/

import { useCallback, useRef, MouseEvent, EventHandler } from 'react'

type DoubleClickOptions = {
	/** The amount of time (in milliseconds) to wait before triggering the eager single click */
	eagerDelayMS?: number
	/** The amount of time (in milliseconds) to wait between clicks */
	delayMS?: number
	/** A callback function for eager single click */
	onEagerSingleClick?: () => void
	/** A callback function for double click */
	onDoubleClick?: (triggeredEager: boolean) => void
}
export default function useDoubleClick({
	eagerDelayMS = 200,
	delayMS = 500,
	onEagerSingleClick = () => {},
	onDoubleClick = () => {},
}: DoubleClickOptions): EventHandler<MouseEvent> {
	const lastClickTime = useRef(0)
	const timeoutId = useRef<number | undefined>()
	const onClick = useCallback(() => {
		const timeSinceLastClick = Date.now() - lastClickTime.current
		lastClickTime.current = Date.now()
		// confirmed double click
		if (timeSinceLastClick < delayMS) {
			lastClickTime.current = 0
			onDoubleClick(timeSinceLastClick > eagerDelayMS)
			clearTimeout(timeoutId.current)
		}
		// first click
		else {
			timeoutId.current = window.setTimeout(() => {
				onEagerSingleClick()
			}, eagerDelayMS)
		}
	}, [onEagerSingleClick, onDoubleClick, delayMS, eagerDelayMS])
	return onClick
}
