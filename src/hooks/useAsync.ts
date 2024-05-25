import { useEffect, useState } from 'react'

export type UseAsyncResponse<T> = {
  data: T | undefined
  error: unknown
  isLoading: boolean
}
// todo: use export default
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): UseAsyncResponse<T> {
  const [data, setData] = useState<T | undefined>()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  // We need not specify fn since it's expected that dependencies
  // would inclued its dependencies
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    fn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, deps)
  return { data, error, isLoading }
}
