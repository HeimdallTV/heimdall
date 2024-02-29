export const formatDateAgo = (date: Date) => {
  const currentDate = new Date()
  const seconds = Math.floor((currentDate.getTime() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`
  throw new Error('Invalid date')
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
// todo: repeated code
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Nov', 'Dec']
/** Returns a date like "Today", "Yesterday", "Last Monday", "January 1st, 2023" */
export const formatDayRelative = (date: Date) => {
  date.setHours(0, 0, 0, 0)
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const daysAgo = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24)
  if (daysAgo < 0) {
    throw new Error(`Date must be today or in the past but got: ${date.toISOString()}`)
  }
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  // todo: what if their week starts on the monday
  if (daysAgo < 7) return `Last ${days[date.getDay()]}`
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export const formatNumberShort = (num: number) => {
  if (num > 1_000_000_000) return `${(num / 1_000_000_000).toFixed(Number(num < 10_000_000_000))}B`
  if (num > 1_000_000) return `${(num / 1_000_000).toFixed(Number(num < 10_000_000))}M`
  if (num > 1_000) return `${(num / 1_000).toFixed(Number(num < 10_000))}K`
  return num
}

export const formatNumberDuration = (durationInSeconds: number) => {
  const roundedDurationInSeconds = Math.floor(durationInSeconds)
  const parts = []
  if (roundedDurationInSeconds > 60 * 60) parts.push(Math.floor(roundedDurationInSeconds / 60 ** 2))
  parts.push(Math.floor((roundedDurationInSeconds % 60 ** 2) / 60))
  parts.push(roundedDurationInSeconds % 60)
  return [parts[0], ...parts.slice(1).map((part) => String(part).padStart(2, '0'))].join(':')
}
