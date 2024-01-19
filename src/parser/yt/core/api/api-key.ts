import { fetchProxy } from '@libs/extension'
import { endpoints } from '@libs/extension'
import { addDays } from 'date-fns/addDays'

export async function fetchAPIKey() {
  const { retrievalDate, value } = await endpoints.storage.local.get('apiKey').then(_ => _.apiKey ?? {})
  const notExpired = retrievalDate && addDays(new Date(), 2) > new Date(retrievalDate)
  const shouldRefresh = retrievalDate && addDays(new Date(), 1) < new Date(retrievalDate)
  if (value && notExpired) {
    if (shouldRefresh) refreshAPIKey()
    return value
  }
  await refreshAPIKey()
  return endpoints.storage.local.get('apiKey').then(({ apiKey }) => apiKey.value)
}

export const refreshAPIKey = () =>
  fetchProxy('https://www.youtube.com/feed/you', { credentials: 'include' })
    .then(res => res.text())
    .then(text => text.split('"INNERTUBE_API_KEY":"')[1].split('"')[0])
    .then(key =>
      endpoints.storage.local.set({ apiKey: { retrievalDate: new Date().toISOString(), value: key } }),
    )
