import browser from 'webextension-polyfill'
import { Sockets, Endpoints } from './service-worker'
import { createSocketClient, createEndpointClient, createRouter, Socket, SocketHandler } from '@saghen/hermes'
import { createSocketTransport, createEndpointTransport } from '@saghen/hermes/transports/extension'
import { listenOnSocket, listenOnEndpoint } from '@saghen/hermes/transports/web'

const transport = createEndpointTransport(browser.runtime, browser.runtime.id)
const endpointClient = createEndpointClient<Endpoints>(transport)
const socketClient = createSocketClient<Sockets>(createSocketTransport(browser.runtime, browser.runtime.id))

type DeepRecord<Key extends keyof any, Value> = {
  [key in Key]: Value | DeepRecord<Key, Value>
}
type ReverseSockets<Sockets extends DeepRecord<string, SocketHandler<any, any>>> = {
  [K in keyof Sockets]: Sockets[K] extends SocketHandler<infer Send, infer Receive>
    ? SocketHandler<Receive, Send>
    : ReverseSockets<Exclude<Sockets[K], SocketHandler>>
}

const router = createRouter<Endpoints, ReverseSockets<Sockets>>(
  endpointClient,
  {
    storage: {
      local: {
        onChanged: async (webSocket) => {
          const extensionSocket = await socketClient.storage.local.onChanged()
          await proxySocket(webSocket, extensionSocket)
        },
      },
    },
  },
  true,
)
listenOnSocket(router, location.origin)
listenOnEndpoint(router, location.origin)

function proxySocket<Receive, Send>(a: Socket<Send, Receive>, b: Socket<Receive, Send>) {
  a.waitForClose().then(() => b.close())
  b.waitForClose().then(() => a.close())

  const aMessages = new Promise(async () => {
    for await (const message of a.receiveIter()) {
      b.send(message)
    }
  })
  const bMessages = new Promise(async () => {
    for await (const message of b.receiveIter()) {
      a.send(message)
    }
  })

  return Promise.all([aMessages, bMessages])
}
