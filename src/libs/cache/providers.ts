import { endpoints } from '@/libs/extension'

export type CacheItem = {
  value: any
  createdAt: number
}

export type CacheProvider = {
  get: (key: string) => Promise<CacheItem | undefined>
  set: (key: string, value: any) => Promise<void>
  delete: (key: string) => Promise<void>
}

export function createInMemoryProvider(): CacheProvider {
  const store: Record<string, any> = {}
  return {
    get: async (key: string) => store[key],
    set: async (key: string, value: any) => {
      store[key] = { value, createdAt: Date.now() }
    },
    delete: async (key: string) => {
      delete store[key]
    },
  }
}

export function createStorageProvider(namespace: string): CacheProvider {
  // Ensure that we don't collide with other keys in the storage
  const ns = '___:::' + namespace + ':::___'
  const storage = endpoints?.storage.local
  return {
    get: async (key: string) => {
      const value = await storage.get(ns + key)
      if (ns + key in value) return value[ns + key]
    },
    set: (key: string, value: any) => storage.set({ [ns + key]: { value, createdAt: Date.now() } }),
    delete: (key: string) => storage.remove(ns + key),
  }
}
