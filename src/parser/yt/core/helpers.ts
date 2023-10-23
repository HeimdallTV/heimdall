import { __, pipe, cond, divide, concat, T, lte, split, filter, replace, head } from 'ramda'

export const divideByAndConcat = (divisor: number, suffix: string) => (num: number) =>
  pipe(
    (val: number) => divide(val, divisor),
    (val: number) => (divisor < 1_000_000 ? Math.floor(val) : val.toFixed(2)),
    String,
    concat(__, suffix),
  )(num)

export const toShortHumanReadable = cond([
  [lte(1_000_000_000), divideByAndConcat(1_000_000_000, 'B')],
  [lte(1_000_000), divideByAndConcat(1_000_000, 'M')],
  [lte(1_000), divideByAndConcat(1_000, 'K')],
  [T, divideByAndConcat(1, '')],
]) as (viewCount: number) => string

/**
 * Text must be in the form "123,345 views"
 */
export function humanReadableToNumber(text: string): number {
  return Number(
    text
      .split(/([\d,]+)/)
      .filter(Boolean)[0]
      .replaceAll(',', ''),
  )
}

/**
 * Text must be in the form "123,345 views", "123k views", "1.5M views", etc.
 */
export function shortHumanReadableToNumber(text: string): number {
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

export const parseViewCount = pipe(split(/([\d,]+)/), filter(Boolean), head, replace(/,/g, ''), Number)
