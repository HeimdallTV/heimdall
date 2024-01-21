/**
 * Runs the mutate function as soon as the previous mutation call finishes
 * Immediately sets the eagerValue to the desired value. If the mutation call
 * fails, the eagerValue is set back to the previous successful value. If multiple
 * calls to mutate are made during a single active mutation, only the last call
 * will be run.
 *
 * WARN: If the "eagerValue" matches the "value", the mutate function will not
 * run. As such, if you request a mutation from "false" to "true" that fails,
 * the value will be reset back to false. However, if you made a call in the mean
 * time setting "value" back to false, that mutation will not run.
 */

import { useEffect, useRef, useState } from 'react'

export const useEagerMutation = <T>(
  initialValue: T,
  mutate: (current: T, desired: T) => Promise<any>,
  onError: (error: any) => any,
) => {
  const [value, setValue] = useState(initialValue)
  const [eagerValue, setEagerValue] = useState(initialValue)
  const runningMutation = useRef<Promise<T> | undefined>()

  useEffect(() => {
    const abortController = new AbortController()

    const runMutation = (value: T) => {
      if (abortController.signal.aborted) return
      if (value === eagerValue) return
      runningMutation.current = mutate(value, eagerValue)
        .then(() => {
          setValue(eagerValue)
          return eagerValue
        })
        .catch(error => {
          onError(error)
          // If there wasnt a new operation, set the value back to the previous value
          if (!abortController.signal.aborted) setEagerValue(value)
          return value
        })
    }

    if (runningMutation.current) runningMutation.current.then(runMutation)
    else runMutation(value)

    return () => abortController.abort()
  }, [eagerValue, mutate])

  return [value, eagerValue, (value: T) => setEagerValue(value)] as const
}
