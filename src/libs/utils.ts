export const when =
  (predicate: boolean) =>
  <T>(value: T) =>
    predicate ? value : undefined

export const capitalize = (string: string) => string[0].toUpperCase() + string.slice(1)

export const dissoc = <T extends object, K extends keyof T>(key: K, obj: T): Omit<T, K> => {
  const { [key]: _, ...rest } = obj
  return rest
}
