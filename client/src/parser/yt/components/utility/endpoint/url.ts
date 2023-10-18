import { Endpoint } from '@yt/core/internals'

/** Used for navigation outside of Youtube */
export type UrlEndpoint = Endpoint<
  'url',
  {
    nofollow: boolean
    target: string // Only seen 'TARGET_NEW_WINDOW'
    /** A youtube URL that redirects externally. Should calculate actual url from this */
    url: string // https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbDNfajZmYWFzN0dCLWg2MmFGZ3ZFUmIyQ2RBd3xBQ3Jtc0trdk1tVEFrNGlqdmNnQXB5VWxuMzVnVDlzbWpVanFFVlVKYk9NeDFnaGhCSUtEeXhoaWVxMU9XVHVOdGVwN1ZMajJWZUgwN0oyNTV4NGZqTkE3cmpEalQzN0JQN3dYSmZBemxYWjhaNU9XQXZCTGJ3cw&q=http%3A%2F%2FExtremitiesPodcast.com
  }
>

/** What a name */
export const getUrlEndpointUrl = (endpoint: UrlEndpoint) => endpoint.urlEndpoint.url
