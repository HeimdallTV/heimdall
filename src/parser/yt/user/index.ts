import { getChannel } from '@yt/channel'
import { findRenderer, isRenderer } from '@yt/core/internals'
import { pipe } from 'fp-ts/lib/function'
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
import { addDays, parse, subDays } from 'date-fns'
import { combineSomeText } from '../components/text'

export const getUser = (userId: string) => getChannel(userId).then(channel => channel.user)

// todo: will break if non-english or sunday is not first day
const historyHeaderToDate = (header: string) => {
  header = header.toLowerCase()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (header === 'today') return today
  if (header === 'yesterday') return subDays(today, 1)

  const daysOfTheWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayOfTheWeek = daysOfTheWeek.indexOf(header)
  if (dayOfTheWeek !== -1) {
    const day = today.getDay()
    const diff = day - dayOfTheWeek
    return addDays(today, diff)
  }

  return parse('MMM d', header, new Date())
}
export const getHistory = async function* () {
  const historyIterator = makeContinuationIterator(
    () =>
      fetchHistory().then(
        response =>
          response.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer
            .contents,
      ),
    token =>
      fetchHistoryContinuation(token).then(
        response => response.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems,
      ),
  )
  for await (const section of historyIterator) {
    section
      .map(section => section.itemSectionRenderer)
      .map(({ header, contents }) => ({
        date: historyHeaderToDate(combineSomeText(header.itemSectionHeaderRenderer.title)),
        videos: contents.map(processVideo),
      }))
  }
}

export const listFollowedUsers = async function* () {
  const guideResponse = await fetchGuide()

  const subscriptionSectionItems = pipe(
    guideResponse.items,
    findRenderer('guideSubscriptionsSection'),
    _ => _?.items ?? [],
  )
  const nonCollapsedItems = subscriptionSectionItems.filter(isRenderer('guideEntry'))
  const collapsedItems = pipe(
    subscriptionSectionItems,
    findRenderer('guideCollapsibleEntry'),
    _ => _?.expandableItems.filter(isRenderer('guideEntry')) ?? [],
  )

  yield [...nonCollapsedItems, ...collapsedItems]
    // fixme: update types to include the buttons at the bottom of the guideCollapsibleEntry which are just buttons
    // but are still called guideEntryRenderers
    .filter(entry => !('icon' in entry.guideEntryRenderer))
    .map(processChannelGuideEntry)
}

export const listLiveFollowedUsers = async function* () {
  for await (const users of listFollowedUsers()) {
    yield users.filter(user => user.isLive)
  }
}

export const listFollowedUsersVideos = async function* () {
  const subscriptionsIterator = makeContinuationIterator(
    () =>
      fetchSubscriptions().then(
        response =>
          response.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer
            .contents,
      ),
    token =>
      fetchSubscriptionsContinuation(token).then(
        response => response.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems,
      ),
  )
  for await (const videos of subscriptionsIterator) {
    yield videos
      .filter(isRenderer('richItem'))
      .map(renderer => renderer.richItemRenderer.content)
      .filter(isRenderer('video'))
      .map(processVideo)
  }
}

export const setUserFollowed = (id: string) => (isFollowing: boolean) =>
  (isFollowing ? fetchSubscribe : fetchUnsubscribe)(id).then(() => {})
