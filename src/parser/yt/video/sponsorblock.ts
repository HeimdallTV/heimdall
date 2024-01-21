import * as std from '@std'

type SponsorBlockResponse = {
  segment: number[]
  UUID: string
  category: string
  videoDuration: number
  actionType: string
  locked: number
  votes: number
  description: string
}[]

export const fetchSponsorBlock = async (videoID: string): Promise<std.PlayerSegments> => {
  const query = new URLSearchParams({
    videoID,
    categories: JSON.stringify([
      std.PlayerSegmentCategory.Sponsor,
      std.PlayerSegmentCategory.SelfPromo,
      std.PlayerSegmentCategory.Interaction,
      std.PlayerSegmentCategory.Intro,
      std.PlayerSegmentCategory.Outro,
      std.PlayerSegmentCategory.Preview,
      std.PlayerSegmentCategory.MusicOfftopic,
      std.PlayerSegmentCategory.Filler,
      std.PlayerSegmentCategory.Highlight,
      std.PlayerSegmentCategory.ExclusiveAccess,
      std.PlayerSegmentCategory.Chapter,
    ]),
    actionTypes: JSON.stringify([
      std.PlayerSegmentActionType.Skip,
      std.PlayerSegmentActionType.Mute,
      std.PlayerSegmentActionType.POI,
      std.PlayerSegmentActionType.Full,
      std.PlayerSegmentActionType.Chapter,
    ]),
  }).toString()

  const url = new URL('/api/skipSegments?' + query, 'https://sponsor.ajay.app')

  const resp = await fetch(url)

  if (resp.status !== 200) {
    return {
      categories: [],
      chapters: [],
      highlights: [],
    }
  }

  const data: SponsorBlockResponse = await resp.json()
  // TODO: handle mute action types ??
  return {
    categories: data
      .filter(segment => segment.actionType === std.PlayerSegmentActionType.Skip)
      .map(segment => ({
        id: segment.UUID,
        startTimeMS: segment.segment[0] * 1000,
        endTimeMS: segment.segment[1] * 1000,
        category: segment.category as std.PlayerSegmentCategory,
        locked: segment.locked,
        votes: segment.votes,
        videoDurationMS: segment.videoDuration * 1000,
      })),
    chapters: data
      .filter(segment => segment.actionType === std.PlayerSegmentActionType.Chapter)
      .map(segment => ({
        id: segment.UUID,
        startTimeMS: segment.segment[0] * 1000,
        endTimeMS: segment.segment[1] * 1000,
        title: segment.description,
      })),
    highlights: data
      .filter(segment => segment.actionType === std.PlayerSegmentActionType.POI)
      .map(segment => ({
        id: segment.UUID,
        timestampMS: segment.segment[0] * 1000,
      })),
  }
}
