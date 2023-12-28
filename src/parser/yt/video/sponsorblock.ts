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

export const fetchSponsorBlock = async (videoID: string) => {
  const query = new URLSearchParams({
    videoID,
    categories: JSON.stringify([
      std.PlayerSkipSegmentCategory.Sponsor,
      std.PlayerSkipSegmentCategory.SelfPromo,
      std.PlayerSkipSegmentCategory.Interaction,
      std.PlayerSkipSegmentCategory.Intro,
      std.PlayerSkipSegmentCategory.Outro,
      std.PlayerSkipSegmentCategory.Preview,
      std.PlayerSkipSegmentCategory.MusicOfftopic,
      std.PlayerSkipSegmentCategory.Filler,
      std.PlayerSkipSegmentCategory.POI,
      std.PlayerSkipSegmentCategory.ExclusiveAccess,
      std.PlayerSkipSegmentCategory.Chapter,
    ]),
    actionTypes: JSON.stringify([
      std.PlayerSkipSegmentActionType.Skip,
      std.PlayerSkipSegmentActionType.Mute,
      std.PlayerSkipSegmentActionType.POI,
      std.PlayerSkipSegmentActionType.Full,
      std.PlayerSkipSegmentActionType.Chapter,
    ]),
  }).toString()

  const url = new URL('/api/skipSegments?' + query, 'https://sponsor.ajay.app')

  const resp = await fetch(url)

  if (resp.status !== 200) {
    return {
      skipSegments: [],
      chapters: [],
      highlights: [],
    }
  }

  const data: SponsorBlockResponse = await resp.json()

  // TODO: handle mute action types ??

  const segments: std.PlayerSkipSegments = {
    skipSegments: data
      .filter(segment => segment.actionType === std.PlayerSkipSegmentActionType.Skip)
      .map(segment => ({
        UUID: segment.UUID,
        startTimeMs: segment.segment[0] * 1000,
        endTimeMs: segment.segment[1] * 1000,
        category: segment.category as std.PlayerSkipSegmentCategory,
        locked: segment.locked,
        votes: segment.votes,
        videoDuration: segment.videoDuration * 1000,
      })),
    chapters: data
      .filter(segment => segment.actionType === std.PlayerSkipSegmentActionType.Chapter)
      .map(segment => ({
        UUID: segment.UUID,
        startTimeMs: segment.segment[0] * 1000,
        endTimeMs: segment.segment[1] * 1000,
        title: segment.description,
      })),
    highlights: data
      .filter(segment => segment.actionType === std.PlayerSkipSegmentActionType.POI)
      .map(segment => ({
        UUID: segment.UUID,
        timestampMs: segment.segment[0] * 1000,
      })),
  }

  return segments
}
