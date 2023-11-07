import { useEffect, useState } from 'react'

export type UseAsyncResponse<T> = { data: T | undefined; error: any; isLoading: boolean }
export function useAsync<T>(fn: () => Promise<T>, deps: any[]): UseAsyncResponse<T> {
  const [data, setData] = useState<T | undefined>()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    fn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, deps)
  return { data, error, isLoading }
}
