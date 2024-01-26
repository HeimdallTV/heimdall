import { useEffect, useMemo, useState } from 'react'

import pLimit from 'p-limit'

// todo: use export default
// fixme: has all kinds of race conditions, error handling issues and doesnt reset when iterator changes
// fixme: needs dependency array
export const usePaginated = <T>(iterator?: () => AsyncGenerator<T>) => {
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<unknown[]>([])
	const [done, setDone] = useState(false)
	const [data, setData] = useState<T[]>([])
	const generator = useMemo(() => iterator?.(), [iterator])
	const next = useMemo(() => {
		if (!generator) return () => Promise.resolve()
		const limit = pLimit(1)
		return () =>
			limit(() => {
				setLoading(true)
				return generator
					.next()
					.then((res) => {
						if (res.value) setData((data) => [...data, res.value])
						setDone(Boolean(res.done))
					})
					.catch((err) => setErrors((errors) => [...errors, err]))
					.finally(() => setLoading(false))
			})
	}, [generator])

	useEffect(() => {
		next()
	}, [next])

	return { data, loading, errors, done, next } as const
}
