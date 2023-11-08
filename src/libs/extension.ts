import { Endpoints, Sockets } from '@extension/src/main'
import {
  requestInitToTransferableRequestInit,
  transferableResponseToResponse,
} from '@extension/src/routes/proxy/convert'
import { createEndpointClient, createSocketClient } from '@saghen/hermes'
import { createEndpointTransport, createSocketTransport } from '@saghen/hermes/transports/extension'
import type { Runtime } from 'webextension-polyfill'

// @ts-expect-error  fixme: add global typing for .chrome and .browser
const browser = typeof globalThis.browser === 'undefined' ? globalThis.chrome : globalThis.browser

const sendMessage: Runtime.Static['sendMessage'] = (
  extensionId: string | undefined,
  message: any,
  options?: Runtime.SendMessageOptionsType,
) =>
  new Promise<any>((resolve, reject) =>
    browser.runtime.sendMessage(extensionId, message, options, (value: any) => {
      if (value !== undefined) resolve(value)
      reject(browser.runtime.lastError)
    }),
  )
export const endpoints = createEndpointClient<Endpoints>(
  createEndpointTransport({ sendMessage }, import.meta.env.VITE_PUBLIC_EXTENSION_ID!),
)

export const sockets = createSocketClient<Sockets>(
  createSocketTransport(browser.runtime, import.meta.env.VITE_PUBLIC_EXTENSION_ID!),
)

// FIXME: Implement abort on the extension side somehow
export const fetchProxy = (url: string, init: RequestInit = {}) =>
  requestInitToTransferableRequestInit(init).then(init =>
    endpoints!.proxy.fetch(url, init).then(transferableResponseToResponse),
  )

export const matchAsync =
  <Data, A, B, C>(onData: (data: Data) => A, onError: (error: any) => B, onLoading?: () => C) =>
  ({ data, error }: { data: Data; error: any }) => {
    if (error !== undefined) return onError(error)
    if (data !== undefined) return onData(data)
    return onLoading?.()
  }
