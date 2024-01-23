// import { formatDistance } from 'date-fns/formatDistance'
// import { enGB } from 'date-fns/locale/en-GB'
// import { formatRelative } from 'date-fns/formatRelative'

export const formatDateAgo = (date: Date) => ''
// formatDistance(date, new Date(), { addSuffix: true }).replace(/^about\s+/, '')

// https://github.com/date-fns/date-fns/issues/1218#issuecomment-599182307
const formatRelativeLocale = {
	lastWeek: 'eeee',
	yesterday: "'Yesterday'",
	today: "'Today'",
	tomorrow: "'Tomorrow'",
	nextWeek: "'Next' eeee",
	other: 'MMMM do, yyyy',
}
/** Returns a date like "Today", "Yesterday", "Last Monday", "Next Friday", "January 1st, 2023" */
export const formatDayRelative = (date: Date) => ''
// formatRelative(date, new Date(), {
// 	locale: {
// 		...enGB,
// 		formatRelative: (token: keyof typeof formatRelativeLocale) => formatRelativeLocale[token],
// 	},
// })

export const formatNumberShort = (num: number) => {
	if (num > 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
	if (num > 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
	if (num > 1_000) return `${Math.floor(num / 1_000)}K`
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
