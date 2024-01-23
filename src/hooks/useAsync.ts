import { useEffect, useState } from 'react'

export type UseAsyncResponse<T> = { data: T | undefined; error: unknown; isLoading: boolean }
// todo: use export default
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): UseAsyncResponse<T> {
	const [data, setData] = useState<T | undefined>()
	const [isLoading, setLoading] = useState(true)
	const [error, setError] = useState<Error | undefined>()

	useEffect(() => {
		fn()
			.then(setData)
			.catch(setError)
			.finally(() => setLoading(false))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, fn])
	return { data, error, isLoading }
}
