import { getChannel } from '@yt/channel'
import { findRenderer, isRenderer } from '@yt/core/internals'
import {
  fetchGuide,
  fetchHistory,
  fetchHistoryContinuation,
  fetchSubscribe,
  fetchSubscriptions,
  fetchSubscriptionsContinuation,
  fetchUnsubscribe,
} from './api'
import { processChannelGuideEntry } from './processors'
import { processVideo } from '../video/processors/regular'
import { makeContinuationIterator } from '../core/api'
import { subDays } from 'date-fns/subDays'
import { combineSomeText } from '../components/text'
import { getContinuationResponseItems } from '../components/continuation'

export const getUser = (userId: string) => getChannel(userId).then((channel) => channel.user)

const indexOf = (str: string, substr: string) => {
  const index = str.indexOf(substr)
  if (index !== -1) return index
}
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'nov', 'dec']

// todo: will break if non-english or sunday is not first day
const historyHeaderToDate = (header: string) => {
  const headerLower = header.toLowerCase()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (headerLower === 'today') return today
  if (headerLower === 'yesterday') return subDays(today, 1)

  const daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayOfTheWeek = daysOfTheWeek.indexOf(headerLower)
  if (dayOfTheWeek !== -1) {
    const day = today.getDay()
    if (day < dayOfTheWeek) return subDays(today, 7 - dayOfTheWeek + day)
    return subDays(today, day - dayOfTheWeek)
  }

  // Jan 12 or Jan 12, 2024
  const commaIndex = indexOf(headerLower, ',')
  const month = headerLower.slice(0, 3)
  console.log('month', month)
  const dayOfMonth = Number(headerLower.slice(4, commaIndex ?? headerLower.length))
  console.log('dayOfMonth', dayOfMonth)
  const year = commaIndex && Number(headerLower.slice(commaIndex + 1))

  if (Number.isNaN(month) || Number.isNaN(dayOfMonth)) {
    throw Error(`Unable to parse date from history header: "${headerLower}"`)
  }
  if (year && !Number.isNaN(year)) {
    const yearDate = new Date(year, months.indexOf(month), dayOfMonth)
    if (!Number.isNaN(yearDate.getTime())) return yearDate
  }
  const monthDate = new Date(today.getFullYear(), months.indexOf(month), dayOfMonth)
  console.log('monthDate', monthDate)
  if (!Number.isNaN(monthDate.getTime())) return monthDate

  throw Error(`Unable to parse date from history header: "${headerLower}"`)
}
export const listHistory = async function* () {
  const historyIterator = makeContinuationIterator(
    () =>
      fetchHistory().then(
        (response) =>
          response.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer
            .contents,
      ),
    (token) => fetchHistoryContinuation(token).then(getContinuationResponseItems),
  )
  for await (const section of historyIterator) {
    yield section
      .map((section) => section.itemSectionRenderer)
      .map(({ header, contents }) => ({
        date: historyHeaderToDate(combineSomeText(header.itemSectionHeaderRenderer.title)),
        videos: contents.filter(isRenderer('video')).map(processVideo),
      }))
  }
}

export const listFollowedUsers = async function* () {
  const guideResponse = await fetchGuide()

  const subscriptionSectionItems = findRenderer('guideSubscriptionsSection')(guideResponse.items)?.items ?? []
  const nonCollapsedItems = subscriptionSectionItems.filter(isRenderer('guideEntry'))
  const guideCollapsibleSection = findRenderer('guideCollapsibleEntry')(subscriptionSectionItems)
  const collapsedItems = guideCollapsibleSection?.expandableItems.filter(isRenderer('guideEntry')) ?? []

  yield [...nonCollapsedItems, ...collapsedItems]
    // fixme: update types to include the buttons at the bottom of the guideCollapsibleEntry which are just buttons
    // but are still called guideEntryRenderers
    .filter((entry) => !('icon' in entry.guideEntryRenderer))
    .map(processChannelGuideEntry)
}

export const listLiveFollowedUsers = async function* () {
  for await (const users of listFollowedUsers()) {
    yield users.filter((user) => user.isLive)
  }
}

export const listFollowedUsersVideos = async function* () {
  const subscriptionsIterator = makeContinuationIterator(
    () =>
      fetchSubscriptions().then(
        (response) =>
          response.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer
            .contents,
      ),
    (token) => fetchSubscriptionsContinuation(token).then(getContinuationResponseItems),
  )
  for await (const videos of subscriptionsIterator) {
    yield videos
      .filter(isRenderer('richItem'))
      .map((renderer) => renderer.richItemRenderer.content)
      .filter(isRenderer('video'))
      .map(processVideo)
  }
}

export async function setUserFollowed(userId: string, isFollowing: boolean) {
  if (isFollowing) await fetchSubscribe(userId)
  else await fetchUnsubscribe(userId)
}
