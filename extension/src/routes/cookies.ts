import { ExtensionRequestMetadata } from '@saghen/hermes/transports/extension'
import browser from 'webextension-polyfill'

export const get = async (details: browser.Cookies.GetDetailsType, metadata: ExtensionRequestMetadata) => {
  const cookie = await browser.cookies.get({
    ...details,
    storeId: details.storeId ?? metadata.sender.tab?.cookieStoreId,
  })
  console.log(cookie)
  return cookie
}
export const getAll = (details: browser.Cookies.GetAllDetailsType, metadata: ExtensionRequestMetadata) =>
  browser.cookies.getAll({
    ...details,
    storeId: details.storeId ?? metadata.sender.tab?.cookieStoreId,
  })
export const set = (details: browser.Cookies.SetDetailsType, metadata: ExtensionRequestMetadata) =>
  browser.cookies.set({
    ...details,
    storeId: details.storeId ?? metadata.sender.tab?.cookieStoreId,
  })
export const remove = (details: browser.Cookies.RemoveDetailsType, metadata: ExtensionRequestMetadata) =>
  browser.cookies.remove({
    ...details,
    storeId: details.storeId ?? metadata.sender.tab?.cookieStoreId,
  })
export const getAllCookieStores = browser.cookies.getAllCookieStores
