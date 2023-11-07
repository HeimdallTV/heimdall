export const when =
  (predicate: boolean) =>
  <T>(value: T) =>
    predicate ? value : undefined
