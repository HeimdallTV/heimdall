import { BaseResponse, BrowseId, Endpoint, fetchYt } from '@yt/core/api'
import { GuideResponse } from './types/responses/guide'
import { SubscriptionsContinuationResponse, SubscriptionsResponse } from './types/responses/subscriptions'
import { HistoryContinuationResponse, HistoryResponse } from './types/responses/history'

export const fetchGuide = (): Promise<GuideResponse> => fetchYt(Endpoint.Guide, { fetchLiveStatus: true })

export const fetchSubscriptions = (): Promise<SubscriptionsResponse> =>
  fetchYt(Endpoint.Browse, { browseId: BrowseId.Subscriptions })
export const fetchSubscriptionsContinuation = (
  continuation: string,
): Promise<SubscriptionsContinuationResponse> => fetchYt(Endpoint.Browse, { continuation })

export const fetchHistory = (): Promise<HistoryResponse> =>
  fetchYt(Endpoint.Browse, { browseId: BrowseId.History })
export const fetchHistoryContinuation = (continuation: string): Promise<HistoryContinuationResponse> =>
  fetchYt(Endpoint.Browse, { continuation })

export const fetchSubscribe = (channelId: string): Promise<BaseResponse> =>
  fetchYt(Endpoint.Subscribe, { channelIds: [channelId] })
export const fetchUnsubscribe = (channelId: string): Promise<BaseResponse> =>
  fetchYt(Endpoint.Unsubscribe, { channelIds: [channelId] })
