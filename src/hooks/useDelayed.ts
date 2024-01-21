import { useEffect, useState } from 'react'

// todo: better name
export const useDelayedEvent = (cb: () => void, delay: number) => {
  const [timeout, setTimeout] = useState<number | undefined>()
  return {
    trigger: () => {
      if (timeout) return
      setTimeout(window.setTimeout(cb, delay))
    },
    cancel: () => {
      if (!timeout) return
      window.clearTimeout(timeout)
      setTimeout(undefined)
    },
  }
}

export const useDelayedToggle = (value: boolean, delay: number) => {
  const [currentValue, setCurrentValue] = useState(false)
  useEffect(() => {
    if (!value) return setCurrentValue(false)
    const timeoutId = window.setTimeout(() => setCurrentValue(true), delay)
    return () => window.clearTimeout(timeoutId)
  }, [value])
  return currentValue
}
