import type { Thumbnail } from '@yt/components/thumbnail'

export type VideoDetails = {
  videoId: string
  title: string
  lengthSeconds: string
  keywords: string[]
  channelId: string
  isOwnerViewing: boolean
  shortDescription: string
  isCrawlable: boolean
  thumbnail: Thumbnail
  allowRatings: boolean
  viewCount: string
  /** Plaintext string name of author. For example 2kliksphilip */
  author: string
  isPrivate: boolean
  isUnpluggedCorpus: boolean
  isLiveContent: boolean
}
