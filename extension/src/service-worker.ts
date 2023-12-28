import browser from 'webextension-polyfill'

import { createRouter } from '@saghen/hermes'
import { listenOnMessage, listenOnConnect } from '@saghen/hermes/transports/extension'

import * as cookies from './routes/cookies'
import * as declarativeNetRequest from './routes/declarativeNetRequest'
import * as proxy from './routes/proxy'
import * as storage from './routes/storage'

const router = createRouter(
  { cookies, declarativeNetRequest, proxy, storage: { local: storage.local } },
  { storage: { local: storage.localSockets } },
)
listenOnMessage(browser.runtime, router)
listenOnConnect(browser.runtime, router)

export type Endpoints = typeof router.endpoints
export type Sockets = typeof router.sockets