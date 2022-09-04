import { Socket } from '@saghen/hermes'
import browser from 'webextension-polyfill'

export const local = {
  get: (keys: string | string[] | Record<string, any> | null | undefined) => browser.storage.local.get(keys),
  set: (items: Record<string, any>) => browser.storage.local.set(items),
  remove: (keys: string | string[]) => browser.storage.local.remove(keys),
  clear: () => browser.storage.local.clear(),
}

export const localSockets = {
  onChanged: async (socket: Socket<browser.Storage.StorageAreaOnChangedChangesType, unknown>) => {
    browser.storage.local.onChanged.addListener(socket.send)
    await socket.waitForClose().then(() => browser.storage.local.onChanged.removeListener(socket.send))
  },
}

// TODO: sync, managed, session
