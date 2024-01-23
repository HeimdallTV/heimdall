import { combineSomeText } from '@yt/components/text'
import { durationTextToSeconds } from '@yt/core/helpers'
import { findRenderer } from '@yt/core/internals'
import { subYears, subMonths, subDays, subHours, subMinutes, subSeconds, subWeeks } from 'date-fns'
import { BaseVideo } from './regular'

export const getLength = (lengthText: BaseVideo['lengthText']): number =>
	lengthText && durationTextToSeconds(combineSomeText(lengthText))
export const getViewedLength = (
	thumbnailOverlays: BaseVideo['thumbnailOverlays'],
	length: number | undefined,
) => {
	const viewedPercent = findRenderer('thumbnailOverlayResumePlayback')(
		thumbnailOverlays,
	)?.percentDurationWatched
	if (viewedPercent === undefined || length === undefined) return
	return (length * viewedPercent) / 100
}

export const relativeToAbsoluteDate = (relativeDate: string): Date => {
	const date = new Date()
	const value = relativeDate
		.split(' ')
		.map(Number)
		.find((val) => !Number.isNaN(val))
	if (!value) throw Error(`Failed to find number in date "${relativeDate}"`)

	if (relativeDate.includes('year')) return subYears(date, value)
	if (relativeDate.includes('month')) return subMonths(date, value)
	if (relativeDate.includes('week')) return subWeeks(date, value)
	if (relativeDate.includes('day')) return subDays(date, value)
	if (relativeDate.includes('hour')) return subHours(date, value)
	if (relativeDate.includes('minute')) return subMinutes(date, value)
	if (relativeDate.includes('second')) return subSeconds(date, value)

	throw Error(`Failed to parse date "${relativeDate}`)
}

export const parseDateString = (dateStr: string): Date => {
	const date = new Date(dateStr)
	if (Number.isNaN(date.getTime())) {
		throw Error(`Failed to parse date "${dateStr}`)
	}
	return date
}

export const parseDate = (dateStr: string): Date => {
	try {
		return relativeToAbsoluteDate(dateStr)
	} catch (err) {
		return parseDateString(dateStr)
	}
}
