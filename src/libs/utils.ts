import { applyTo, curry, map } from 'ramda'

export const applyEach = curry((fns, x) => map(applyTo(x), fns))

export const when =
  (predicate: boolean) =>
  <T>(value: T) =>
    predicate ? value : undefined
