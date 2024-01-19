import { useEffect, useState } from 'react'

// todo: use export default
export function useDebounce<T>(value: T, delay: number, shouldIgnoreUpdate?: (value: T) => boolean): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(
      () =>
        setDebouncedValue(debouncedValue => (shouldIgnoreUpdate?.(value) ?? false ? debouncedValue : value)),
      delay,
    )
    return () => clearTimeout(timeoutId)
  }, [value, delay, shouldIgnoreUpdate])

  return debouncedValue
}
