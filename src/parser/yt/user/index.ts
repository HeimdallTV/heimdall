import { getChannel } from '@yt/channel'
import { findRenderer } from '@yt/core/internals'
import { pipe } from 'fp-ts/lib/function'
import { fetchGuide, fetchSubscribe, fetchUnsubscribe } from './api'
import { processChannelGuideEntry } from './processors'

export const getUser = (userId: string) => getChannel(userId).then(channel => channel.user)

export const listFollowedUsers = async function* () {
  const guideResponse = await fetchGuide()
  yield pipe(guideResponse.items, findRenderer('guideSubscriptionsSection'), item =>
    (item?.items ?? []).map(entry => entry.guideEntryRenderer).map(processChannelGuideEntry),
  )
}

export const listLiveFollowedUsers = async function* () {
  for await (const users of listFollowedUsers()) {
    yield users.filter(user => user.isLive)
  }
}

export const setUserFollowed = (id: string) => (isFollowing: boolean) =>
  (isFollowing ? fetchSubscribe : fetchUnsubscribe)(id).then(() => {})
