import { useEffect } from 'react'

export default function usePoll(poll: () => number, dependencies: any[]) {
  useEffect(() => {
    let timeoutId: number
    const runPoll = () => {
      const timeout = poll()
      if (timeout === Infinity) return
      timeoutId = window.setTimeout(runPoll, timeout)
    }
    runPoll()
    return () => clearTimeout(timeoutId)
  }, dependencies)
}
