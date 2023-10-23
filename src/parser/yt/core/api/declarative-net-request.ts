import { memoizeAsync } from '@libs/cache';
import { endpoints } from '@libs/extension';

// FIXME: Check if the rule exists and then run this on init
// FIXME: Should be part of a startup process for the provider
export const setDeclarativeNetRequestHeaderRule = memoizeAsync(() =>
  endpoints?.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1000],
    addRules: [
      {
        id: 1000,
        condition: {
          requestDomains: ['www.youtube.com', 'yt3.ggpht.com'],
          // initiatorDomains: [import.meta.env.VITE_EXTENSION_ID, 'localhost'],
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
    ],
  }),
)
