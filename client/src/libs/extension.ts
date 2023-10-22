import type { SWRResponse } from 'swr';

import { Sockets } from '@extension/src/main';
import {
  requestInitToTransferableRequestInit,
  transferableResponseToResponse,
} from '@extension/src/routes/proxy/convert';
import {
  createEndpointClient,
  createSocketClient,
} from '@saghen/hermes';
import {
  createEndpointTransport,
  createSocketTransport,
} from '@saghen/hermes/transports/extension';

// @ts-expect-error FIXME: Add typing
const browser = typeof globalThis.browser === 'undefined' ? globalThis.chrome : globalThis.browser

const isInBrowser = typeof window !== 'undefined'
const definedInBrowser = <F extends (...args: any[]) => any>(f: F): ReturnType<F> | null =>
  isInBrowser ? f() : null
// FIXME: Make this generic
export const endpoints = definedInBrowser(() =>
  createEndpointClient(
    createEndpointTransport(
      {
        sendMessage: (extensionId, options) =>
          new Promise((resolve, reject) =>
            browser.runtime.sendMessage(extensionId, options, value => {
              if (value !== undefined) resolve(value)
              reject(browser.runtime.lastError)
            }),
          ),
      },
      process.env.NEXT_PUBLIC_EXTENSION_ID,
    ),
  ),
)

export const sockets = definedInBrowser(() =>
  createSocketClient<Sockets>(
    createSocketTransport(browser.runtime, process.env.NEXT_PUBLIC_EXTENSION_ID ?? ''),
  ),
)

// FIXME: Implement abort on the extension side somehow
export const fetchProxy = (url: string, init: RequestInit = {}) =>
  requestInitToTransferableRequestInit(init).then(init =>
    endpoints?.proxy.fetch(url, init).then(transferableResponseToResponse),
  )

export const matchSWR =
  <Data, A, B, C>(onData: (data: Data) => A, onError: (error: any) => B, onLoading?: () => C) =>
  ({ data, error }: SWRResponse<Data, any>) => {
    if (error !== undefined) {
      console.error(error)
      return onError(error)
    }
    if (data !== undefined) return onData(data)
    return onLoading?.()
  }
export const matchAsync =
  <Data, A, B, C>(onData: (data: Data) => A, onError: (error: any) => B, onLoading?: () => C) =>
  ({ data, error }: { data: Data; error: any }) => {
    if (error !== undefined) return onError(error)
    if (data !== undefined) return onData(data)
    return onLoading?.()
  }
