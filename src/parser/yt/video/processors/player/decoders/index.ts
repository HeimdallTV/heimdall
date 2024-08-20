import { getNonce } from '../../../api'
import { getDecodedNParam } from './n'
import { getDecodedSigParam } from './signature'

export async function decodeVideoPlaybackUrl(url: URL, videoId: string): Promise<URL> {
  const urlQueryParams = new URLSearchParams(url.search)
  if (!urlQueryParams.has('n')) {
    throw Error('Video playback URL does not contain a "n" query parameter')
  }
  const decodedNParam = await getDecodedNParam(urlQueryParams.get('n')!)
  urlQueryParams.set('n', decodedNParam)

  if (urlQueryParams.get('alr') === 'yes' && urlQueryParams.has('sig')) {
    urlQueryParams.set('sig', await getDecodedSigParam(urlQueryParams.get('sig')!))
  }

  urlQueryParams.set('cpn', getNonce(videoId))

  const decodedUrl = new URL(url)
  decodedUrl.search = urlQueryParams.toString()
  return decodedUrl
}
