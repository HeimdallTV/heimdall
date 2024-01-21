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
          requestDomains: ['yt3.ggpht.com', 'i.ytimg.com'],
        },
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            {
              header: 'Cookie',
              operation: 'remove',
            },
            {
              header: 'Origin',
              operation: 'remove',
            },
            {
              header: 'Referer',
              operation: 'remove',
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
