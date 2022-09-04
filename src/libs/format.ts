import { formatDistance } from 'date-fns/esm'

export const formatDateAgo = (date: Date) =>
  formatDistance(date, new Date(), { addSuffix: true }).replace(/^about\s+/, '')

export const formatNumberShort = (num: number) => {
  if (num > 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num > 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num > 1_000) return Math.floor(num / 1_000) + 'K'
  return num
}

export const formatNumberDuration = (durationInSeconds: number) => {
  durationInSeconds = Math.floor(durationInSeconds)
  const parts = []
  if (durationInSeconds > 60 * 60) parts.push(Math.floor(durationInSeconds / 60 ** 2))
  parts.push(Math.floor((durationInSeconds % 60 ** 2) / 60))
  parts.push(durationInSeconds % 60)
  return [parts[0], ...parts.slice(1).map(part => String(part).padStart(2, '0'))].join(':')
}
