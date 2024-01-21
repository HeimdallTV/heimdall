import browser from 'webextension-polyfill'

import { createRouter } from '@saghen/hermes'
import { listenOnMessage, listenOnConnect } from '@saghen/hermes/transports/extension'

import * as cookies from './routes/cookies'
import * as declarativeNetRequest from './routes/declarative-net-request'
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

const requestPermissions = async () => {
  const manifest = browser.runtime.getManifest()
  const origins = manifest.host_permissions!
  console.log('Checking permissions for', origins)
  if (!(await browser.permissions.contains({ origins }))) {
    console.log('Missing required permissions. Opening a tab to ask the user for permission...')
    browser.tabs.create({ url: browser.runtime.getURL('permissions.html') })
  } else {
    console.log('Already have permissions')
  }
}
browser.action.onClicked.addListener(requestPermissions)
browser.runtime.onInstalled.addListener(requestPermissions)
