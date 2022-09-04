import browser from 'webextension-polyfill'
import { ExtensionRequestMetadata } from '@saghen/hermes/transports/extension'
import {
  TransferableRequestInit,
  responseToTransferableResponse,
  transferableRequestInitToRequestInit,
} from './convert'

const deserializeCookies = (cookies: string) =>
  Object.fromEntries(
    cookies
      .split(';')
      .map((cookie) => [
        cookie.slice(0, cookie.indexOf('=')).trim(),
        decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1).trim()),
      ]),
  )
const serializeCookies = (cookies: Record<string, string>) =>
  Object.entries(cookies)
    .map((cookie) => `${cookie[0]}=${encodeURIComponent(cookie[1])}`)
    .join(';')

// TODO: Support Request to match default behavior
export const fetch = async (
  url: string,
  transferableInit: TransferableRequestInit,
  metadata: ExtensionRequestMetadata,
) => {
  const init = transferableRequestInitToRequestInit(transferableInit)

  // Combine cookies from the request with the cookies from the given context
  const headers = new Headers(init?.headers)
  const requestCookies = deserializeCookies(headers.get('cookie') ?? '')
  const browserCookies = await browser.cookies
    .getAll({ url, storeId: metadata.sender.tab?.cookieStoreId })
    .then((cookies) => cookies.map((cookie) => [cookie.name, cookie.value]))
    .then(Object.fromEntries)
  headers.set('cookie', serializeCookies({ ...browserCookies, ...requestCookies }))

  console.log(url, init, headers)

  return globalThis.fetch(url, { ...init, headers }).then(responseToTransferableResponse)
}
