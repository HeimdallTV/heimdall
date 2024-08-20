import { memoizeAsync } from '@libs/cache'
import { endpoints } from '@libs/extension'

// FIXME: Check if the rule exists and then run this on init
// FIXME: Should be part of a startup process for the provider
export const setDeclarativeNetRequestHeaderRule = memoizeAsync(() =>
  endpoints.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1000, 1001, 1002],
    addRules: [
      {
        id: 1000,
        condition: {
          requestDomains: ['yt3.ggpht.com', 'i.ytimg.com', 'googlevideo.com'],
        },
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            {
              header: 'Origin',
              operation: 'set',
              value: 'https://www.youtube.com',
            },
            {
              header: 'Referer',
              operation: 'set',
              value: 'https://www.youtube.com',
            },
          ],
        },
      },
      // TODO: handle embeds
      // {
      //   id: 1001,
      //   condition: {
      //     regexFilter: 'https://www.youtube.com/watch\\?v=(.*)',
      //     resourceTypes: ['main_frame'],
      //   },
      //   action: {
      //     type: 'redirect',
      //     redirect: {
      //       regexSubstitution: 'http://localhost:3000/w/\\1',
      //     },
      //   },
      // },
      // {
      //   id: 1002,
      //   condition: {
      //     regexFilter: 'https://www.youtube.com',
      //     resourceTypes: ['main_frame'],
      //   },
      //   action: {
      //     type: 'redirect',
      //     redirect: {
      //       regexSubstitution: 'http://localhost:3000/',
      //     },
      //   },
      // },
    ],
  }),
)
