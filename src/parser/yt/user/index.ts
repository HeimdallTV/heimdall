import { getChannel } from '@yt/channel'
import { findRenderer, isRenderer, unwrapRenderer } from '@yt/core/internals'
import { pipe } from 'fp-ts/lib/function'
import { fetchGuide, fetchSubscribe, fetchUnsubscribe } from './api'
import { processChannelGuideEntry } from './processors'

export const getUser = (userId: string) => getChannel(userId).then(channel => channel.user)

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

export const setUserFollowed = (id: string) => (isFollowing: boolean) =>
  (isFollowing ? fetchSubscribe : fetchUnsubscribe)(id).then(() => {})
