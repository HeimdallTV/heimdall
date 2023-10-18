import { Text } from '@yt/components/text'
import { Thumbnail } from '@yt/components/thumbnail'
import { NavigationSome } from '@yt/components/utility/navigation'
import { UrlEndpoint, WatchEndpoint } from '@yt/components/utility/endpoint'
import { Renderer, Some } from '@yt/core/internals'

export type MicroFormat = Renderer<
  'playerMicroformat',
  {
    title: Some<Text>
    /** TODO: Check if this is a short or full description */
    description: Some<NavigationSome<UrlEndpoint | WatchEndpoint, Text>>
    lengthSeconds: string
    viewCount: string
    category: string
    isFamilySafe: boolean
    isUnlisted: boolean
    thumbnail: Thumbnail

    /** Date of publish in YYYY-MM-DD format. For example 2022-05-25 */
    publishDate: string
    /** Date of upload in YYYY-MM-DD format. For example 2022-05-25. You likely want the publish date instead */
    uploadDate: string

    /** Browse ID for the channel */
    externalChannelId: string
    /** Plaintext string name of author. For example 2kliksphilip */
    ownerChannelName: string
    /** Link to the owner's user profile, not channel. Although these seem to be the same thing? For example "http://www.youtube.com/user/2kliksphilip". The channel would be "http://www.youtube.com/c/2kliksphilip" */
    ownerProfileUrl: string

    /** List of 2 letter country codes. For example CA, US, FR, etc. */
    availableCountries: string[]
    hasYpcMetadata: boolean
    embed: {
      iframeUrl: string
      flashUrl: string
      width: number
      height: number
      flashSecureUrl: string
    }
  }
>
