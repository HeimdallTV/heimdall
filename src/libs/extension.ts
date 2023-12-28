import type { SWRResponse } from 'swr'

import { Endpoints, Sockets } from '@extension/src/main'
import {
  requestInitToTransferableRequestInit,
  transferableResponseToResponse,
} from '@extension/src/routes/proxy/convert'
import { createEndpointClient, createSocketClient } from '@saghen/hermes'
import { createEndpointTransport, createSocketTransport } from '@saghen/hermes/transports/web'

const definedInBrowser = <F extends (...args: any[]) => any>(f: F): ReturnType<F> =>
  globalThis.window !== undefined ? f() : null

export const endpoints = definedInBrowser(() =>
  createEndpointClient<Endpoints>(createEndpointTransport(location.origin)),
)
export const sockets = definedInBrowser(() =>
  createSocketClient<Sockets>(createSocketTransport(location.origin)),
)

// FIXME: Implement abort on the extension side somehow
export const fetchProxy = (url: string, init: RequestInit = {}) =>
  requestInitToTransferableRequestInit(init)
    .then(init => endpoints!.proxy.fetch(url, init))
    .then(transferableResponseToResponse)

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
