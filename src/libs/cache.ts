interface ICacheOptions {
  timeout?: number
}

export const memoize = <T extends (...args: any[]) => any>(
  callback: T,
  { timeout }: ICacheOptions = {}
): T & {
  invalidateCache(): void
} => {
  let cache: ReturnType<T> | undefined
  let lastCache = -(timeout ?? 0)

  // @ts-ignore
  const callbackWithCache: T = (...args) => {
    if (timeout && lastCache + timeout < performance.now()) cache = undefined
    if (cache) return cache

    cache = callback(...args)
    lastCache = performance.now()

    return cache
  }

  return Object.assign(callbackWithCache, {
    invalidateCache: () => {
      cache = undefined
    },
  })
}

export const memoizeAsync = <T extends (...args: any[]) => Promise<any>>(
  callback: T,
  { timeout }: ICacheOptions = {}
): T & {
  invalidateCache(): void
} => {
  let cache: Promise<ReturnType<T>> | undefined
  let lastCache = -(timeout ?? 0)

  // @ts-ignore
  const callbackWithCache: T = async (...args) => {
    if (timeout && lastCache + timeout < performance.now()) cache = undefined
    if (cache) return cache

    cache = callback(...args)
    lastCache = performance.now()

    return cache
  }

  return Object.assign(callbackWithCache, {
    invalidateCache: () => {
      cache = undefined
    },
  })
}

export function createCache<T>({ timeout }: ICacheOptions) {
  const cache: Record<string, { value: T; createdAt: number }> = {}

  return {
    get: (key: string) => {
      if (!cache[key]) return
      const { value, createdAt } = cache[key]
      if (!timeout || createdAt > performance.now() - timeout) return value
    },
    set: (key: string, value: T) => {
      cache[key] = { value, createdAt: performance.now() }
    },
  }
}
