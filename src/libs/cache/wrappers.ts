import { CacheProvider, createInMemoryProvider } from './providers'

export type MemoizedFunction<T extends (...args: any[]) => any> = T & {
  invalidateCache: (args?: Parameters<T>) => void
}
export type MemoizeOptions<T extends (...args: any[]) => any> = {
  argsToKey?: (...args: Parameters<T>) => any
  timeout?: number
  provider?: CacheProvider
}

export const memoizeAsync = <T extends (...args: any[]) => Promise<any>>(
  callback: T,
  { argsToKey = () => 'key', timeout, provider = createInMemoryProvider() }: MemoizeOptions<T> = {},
): T & MemoizedFunction<T> => {
  let promiseCache = new Map<any, Promise<any>>()

  const callbackWithCache = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = await argsToKey(...(args as Parameters<T>))
    if (key === undefined || key === null) {
      throw new Error('Cache: argsToKey did not return a valid key: ' + key)
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
      const promise = callback(...args).then(result => {
        // Cache was invalidated while the callback was running
        if (promiseCache.get(key) !== promise) return result

        // Cache the result and remove from the promise cache
        promiseCache.delete(key)
        provider.set(key, result)
        return result
      })
      promiseCache.set(key, promise)
      return promise
    }
    return cacheItem.value
  }

  callbackWithCache.invalidateCache = (...args: Parameters<T>) => {
    const key = argsToKey(...args)
    provider.delete(key)
  }
  return callbackWithCache as unknown as T & MemoizedFunction<T>
}
