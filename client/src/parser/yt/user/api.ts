import { BaseResponse, Endpoint, fetchYt } from "@yt/core/api";
import { GuideResponse } from "./types";

export const fetchGuide = (): Promise<GuideResponse> => fetchYt(Endpoint.Guide, { fetchLiveStatus: true })
export const fetchSubscribe = (channelId: string): Promise<BaseResponse> => fetchYt(Endpoint.Subscribe, { channelIds: [channelId]})
export const fetchUnsubscribe = (channelId: string): Promise<BaseResponse> => fetchYt(Endpoint.Unsubscribe, { channelIds: [channelId]})
