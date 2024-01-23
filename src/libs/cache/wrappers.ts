import { CacheProvider, createInMemoryProvider } from './providers'

export type MemoizedFunction<Args extends unknown[], Return> = (...args: Args) => Promise<Return> & {
	invalidateCache: (args?: Args) => void
}
export type MemoizeOptions<Args extends unknown[]> = {
	argsToKey?: (...args: Args) => string
	timeout?: number
	provider?: CacheProvider
}

export const memoizeAsync = <Args extends unknown[], Return>(
	callback: (...args: Args) => Promise<Return>,
	{ argsToKey = () => 'key', timeout, provider = createInMemoryProvider() }: MemoizeOptions<Args> = {},
): MemoizedFunction<Args, Return> => {
	const promiseCache = new Map<string, Promise<Return>>()

	const callbackWithCache = async (...args: Args): Promise<Return> => {
		const key = argsToKey(...args)
		if (key === undefined || key === null) {
			throw new Error(`Cache: argsToKey did not return a valid key: ${key}`)
		}

		// Existing call in progress
		let promise = promiseCache.get(key)
		if (promise) return promise

		// Get the value fron the cache provider
		const cacheItem = await provider.get(key)
		const now = Date.now()

		// Check that no call began while we were waiting for the cache provider
		promise = promiseCache.get(key)
		if (promise) return promise

		// If it's expired or doesn't exist, call the callback and cache the result
		if (cacheItem === undefined || (timeout && now - cacheItem.createdAt > timeout)) {
			const promise = callback(...args).then((result) => {
				// Cache was invalidated while the callback was running
				if (promiseCache.get(key) !== promise) return result

				// Cache the result and remove from the promise cache
				promiseCache.delete(key)
				provider.set(key, result)
				return result
			})
			promiseCache.set(key, promise as Promise<Return>)
			return promise as Promise<Return>
		}
		return cacheItem.value as Return
	}

	callbackWithCache.invalidateCache = (...args: Args) => {
		const key = argsToKey(...args)
		provider.delete(key)
	}
	return callbackWithCache as unknown as MemoizedFunction<Args, Return>
}
