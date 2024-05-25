import { createStorageProvider, memoizeAsync } from '@/libs/cache'
import { fetchProxy } from '@/libs/extension'

export const fetchBaseJS = memoizeAsync(
  () =>
    fetchProxy('https://www.youtube.com/feed/you')
      .then((res) => res.text())
      .then((text) => `https://www.youtube.com${text.match(/"([^"]+\/base\.js)"/)![1]}`)
      .then(fetchProxy)
      .then((res) => res.text()),
  { provider: createStorageProvider('YT_BASE_JS'), timeout: 1000 * 60 * 60 * 24 },
)
