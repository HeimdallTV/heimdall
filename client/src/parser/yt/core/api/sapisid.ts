import { endpoints } from '@libs/extension';

export const fetchSAPISID = () =>
  endpoints?.cookies
    .get({
      url: 'https://www.youtube.com',
      name: 'SAPISID',
    })
    .then(cookie => {
      if (!cookie) throw Error('No SAPISID cookie found')
      return hashSAPISID(cookie.value)
    })

async function hashSAPISID(SAPISID: string) {
  const time = Math.floor(new Date().getTime() / 1000)
  const combined = `${time} ${SAPISID} https://www.youtube.com`

  return [time, await hash(combined)].join('_')
}

async function hash(message: string, method = 'SHA-1') {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest(method, msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
}
