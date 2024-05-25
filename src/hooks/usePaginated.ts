import { useEffect, useMemo, useState } from 'react'
import pLimit from 'p-limit'

// todo: use export default
// fixme: has all kinds of race conditions, error handling issues and doesnt reset when iterator changes
// fixme: needs dependency array
export const usePaginated = <T>(iterator?: () => AsyncGenerator<T>) => {
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<unknown[]>([])
  const [done, setDone] = useState(false)
  const [data, setData] = useState<T[]>([])
  const generator = useMemo(() => iterator?.(), [iterator])
  const next = useMemo(() => {
    if (!generator) return () => Promise.resolve()
    const limit = pLimit(1)
    return () =>
      limit(() => {
        // hack: wait a sec to see if the cache returns the data instantly to avoid
        // flashing loading state
        let loaded = false
        setTimeout(() => {
          if (!loaded) setLoading(true)
        }, 0)
        return generator
          .next()
          .then((res) => {
            if (res.value) setData((data) => [...data, res.value])
            setDone(Boolean(res.done))
          })
          .catch((err) => setErrors((errors) => [...errors, err]))
          .finally(() => {
            loaded = true
            return setLoading(false)
          })
      })
  }, [generator])

  useEffect(() => {
    next()
  }, [next])

  useEffect(() => {
    if (errors.length) console.error(errors[errors.length - 1])
  }, [errors])

  return { data, loading, errors, done, next } as const
}
