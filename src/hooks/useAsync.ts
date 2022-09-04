import { useEffect, useState } from 'react'

export type UseAsyncResponse<T> = { data: T | undefined; error: any; isLoading: boolean }
export function useAsync<T>(fn: () => Promise<T>): UseAsyncResponse<T> {
  const [data, setData] = useState<T | undefined>()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    fn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
  return { data, error, isLoading }
}
