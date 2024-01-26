import { useEffect, useState } from 'react'

export function useTemporary<T>(duration = 5000) {
	const [temporary, setTemporary] = useState<T | undefined>()

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const timeout = setTimeout(() => setTemporary(undefined), duration)
		return () => clearTimeout(timeout)
	}, [duration, temporary])

	return [temporary, setTemporary] as const
}
