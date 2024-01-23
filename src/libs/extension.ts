import { Endpoints, Sockets } from '@extension/src/service-worker'
import {
	requestInitToTransferableRequestInit,
	transferableResponseToResponse,
} from '@extension/src/routes/proxy/convert'
import { createEndpointClient, createSocketClient } from '@saghen/hermes'
import { createEndpointTransport, createSocketTransport } from '@saghen/hermes/transports/web'

export const endpoints = createEndpointClient<Endpoints>(createEndpointTransport(location.origin))
export const sockets = createSocketClient<Sockets>(createSocketTransport(location.origin))

// FIXME: Implement abort on the extension side somehow
export const fetchProxy = (url: string, init: RequestInit = {}) =>
	requestInitToTransferableRequestInit(init)
		.then((init) => endpoints!.proxy.fetch(url, init))
		.then(transferableResponseToResponse)
