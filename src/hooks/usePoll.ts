import { useEffect } from 'react'

export default function usePoll(poll: () => number, dependencies: unknown[]) {
	// We need not specify poll since it's expected that dependencies
	// would inclued its dependencies
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		let timeoutId: number
		const runPoll = () => {
			const timeout = poll()
			if (timeout === Infinity) return
			timeoutId = window.setTimeout(runPoll, timeout)
		}
		runPoll()
		return () => clearTimeout(timeoutId)
	}, dependencies)
}
