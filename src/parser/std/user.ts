import { Image } from './components/image'

export type User = {
  name: string
  id: string
  avatar: Image[]
  verified: VerifiedStatus

  isLive?: boolean
  viewCount?: number
  followerCount?: number
  followed?: boolean
}

export enum VerifiedStatus {
  Verified = 'verified',
  Unverified = 'unverified',
  Unknown = 'unknown',
}

export const verifiedFrom = (verified: boolean | undefined) =>
  verified ? VerifiedStatus.Verified : VerifiedStatus.Unverified
