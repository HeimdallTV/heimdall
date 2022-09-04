import { useEffect, useMemo, useState } from 'react'
import pLimit from 'p-limit'

export const usePaginated = <T>(iterator: Lazy<AsyncGenerator<T>>) => {
  const [errors, setErrors] = useState<any[]>([])
  const [done, setDone] = useState(false)
  const [data, setData] = useState<T[]>([])
  const generator = useMemo(iterator, [iterator])
  const next = useMemo(() => {
    const limit = pLimit(1)
    return () =>
      limit(() =>
        generator
          .next()
          .then(res => {
            if (!res.done) setData(data => [...data, res.value])
            setDone(Boolean(res.done))
          })
          .catch(console.error),
      )
  }, [generator])

  useEffect(() => {
    next()
  }, [])

  return [data, errors, next, done] as const
}
