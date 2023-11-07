import { memoizeAsync } from '@/libs/cache'
import { fetchProxy } from '@/libs/extension'

export const fetchBaseJS = memoizeAsync(() =>
  fetchProxy('https://www.youtube.com/')
    .then(res => res.text())
    .then(text => `https://www.youtube.com${text.match(/"([^"]+\/base\.js)"/)![1]}`)
    .then(fetchProxy)
    .then(res => res.text()),
)
