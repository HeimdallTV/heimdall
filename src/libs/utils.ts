export const when =
  (predicate: boolean) =>
  <T>(value: T) =>
    predicate ? value : undefined

export function dissoc<T extends Record<PropertyKey, any>, K extends keyof T>(key: K, obj: T): Omit<T, K> {
  const { [key]: omitted, ...rest } = obj
  return rest
}
