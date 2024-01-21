export const divideByAndConcat = (divisor: number, suffix: string) => (num: number) => {
  const divided = num / divisor
  const stringified = divided >= 10 ? String(Math.floor(divided)) : divided.toFixed(1)
  return stringified + suffix
}

export const toShortHumanReadable = (num: number) => {
  if (num <= 1_000) return String(num)
  if (num <= 1_000_000) return divideByAndConcat(1_000, 'K')(num)
  if (num <= 1_000_000_000) return divideByAndConcat(1_000_000, 'M')(num)
  return divideByAndConcat(1_000_000_000, 'B')(num)
}

/** Text must be in the form "123,345 views", "123k views", "1.5M views", etc. */
export function fromShortHumanReadable(text: string): number {
  const relativeNumber = text
    .split(/([\d\.,KMBT]+)/gi)
    .filter(Boolean)[0]
    .replaceAll(',', '')

  const number = Number(relativeNumber.replaceAll(/[^\d\.]/g, ''))
  if (isNaN(number)) throw Error(`Unable to parse number in short human readable number: "${text}"`)

  const suffix = relativeNumber.replaceAll(/[\d\.]/g, '').toLowerCase()
  if (suffix.length > 1) {
    throw new Error(`Detected more than one suffix "${suffix}" in short human readable number: "${text}"`)
  }
  if (suffix.length === 0) return number
  if (suffix === 'k') return number * 1000
  if (suffix === 'm') return number * 1_000_000
  if (suffix === 'b') return number * 1_000_000_000
  throw new Error(`Unknown suffix "${suffix}" provided in short human readable number: "${text}"`)
}

/**
 * Converts from "20:36" to the number of seconds.
 * Ex. 20:36 -> 20 * 60 + 36 -> 1236
 */
export function durationTextToSeconds(simpleText: string): number {
  return simpleText
    .split(':')
    .reverse() // Seconds, Minutes, Hours, etc..
    .map((val, i) => +val * 60 ** i) // Seconds 60 ** 0 (1), Minutes 60 ** 1 (60), etc...
    .reduce((a, b) => a + b, 0) // Add seconds together
}

/** Text must be in the form "123,345 views" */
export const parseViewCount = (viewCount: string) =>
  Number(
    viewCount
      .split(/([\d,]+)/)
      .filter(Boolean)[0]
      .replaceAll(',', ''),
  )
