import { atomWithStorage } from 'jotai/utils'
import type { DefaultMantineColor, MantineColorsTuple } from '@mantine/core'
import * as std from '@std'
import { focusAtom } from 'jotai-optics'

// todo: categorize
export const enable24HourTimeAtom = atomWithStorage<boolean>(
  'settings-enable-24-hour-time',
  Intl.DateTimeFormat(navigator.language, { hour: 'numeric' }).resolvedOptions().hourCycle === 'h23',
)

/// Theme
type ThemeSettings = {
  mode: ThemeMode
  fontFamily: string
  colors: Partial<Record<DefaultMantineColor, MantineColorsTuple>>
  primaryColor: DefaultMantineColor
  primaryShade: number
}
enum ThemeMode {
  Dark = 'dark',
  Light = 'light',
  Auto = 'auto',
}
export const themeAtom = atomWithStorage<ThemeSettings>('settings-theme', {
  mode: ThemeMode.Dark,
  fontFamily: 'Roboto Flex',
  colors: {
    gray: [
      '#c9c9c9',
      '#b8b8b8',
      '#828282',
      '#696969',
      '#393348',
      '#332e41',
      '#2d2939',
      '#1e1e28',
      '#1c1a24',
      '#131019',
    ],
  },
  primaryColor: 'blue',
  primaryShade: 6,
})

/// Player
type PlayerSettings = {
  autoplay: boolean
  defaultQuality: number
  defaultVolume: number
  defaultPlaybackRate: number
}
export const playerAtom = atomWithStorage<PlayerSettings>('settings-player', {
  autoplay: true,
  defaultQuality: 2560,
  defaultVolume: 1,
  defaultPlaybackRate: 1,
})
export const playerAutoplayAtom = focusAtom(playerAtom, (optic) => optic.prop('autoplay'))
export const playerDefaultQualityAtom = focusAtom(playerAtom, (optic) => optic.prop('defaultQuality'))

/// Player Segments
export enum PlayerSegmentCategoryBehavior {
  /** Show in player UI */
  Show = 'show',
  /** Show in player UI and prompt user to skip */
  Notify = 'notify',
  /** Skip automatically */
  Skip = 'skip',
}
export type PlayerSegmentCategorySettings = {
  enabled: boolean
  behavior: PlayerSegmentCategoryBehavior
  color: DefaultMantineColor
  shade: number
}

export enum PlayerSegmentHighlightBehavior {
  /** Show in player UI */
  Show = 'show',
  /** Show in player UI and prompt user to jump to it */
  Notify = 'notify',
  /** Jump to the highlight automatically */
  Jump = 'jump',
}
type PlayerSegmentHighlightSettings = {
  enabled: boolean
  behaviour: PlayerSegmentHighlightBehavior
  color: DefaultMantineColor
  shade: number
}

type PlayerSegmentsSettings = {
  enableExclusiveAccess: boolean
  enableChapters: boolean
  highlight: PlayerSegmentHighlightSettings
  enableCategories: boolean
  categories: Record<std.PlayerSegmentCategory, PlayerSegmentCategorySettings>
}
export const playerSegmentsAtom = atomWithStorage<PlayerSegmentsSettings>('settings-player-segments', {
  enableExclusiveAccess: true,
  enableChapters: true,
  highlight: {
    enabled: true,
    behaviour: PlayerSegmentHighlightBehavior.Show,
    color: 'grape',
    shade: 5,
  },
  enableCategories: false,
  categories: {
    [std.PlayerSegmentCategory.Sponsor]: {
      enabled: true,
      behavior: PlayerSegmentCategoryBehavior.Skip,
      color: 'green',
      shade: 5,
    },
    [std.PlayerSegmentCategory.SelfPromo]: {
      enabled: false,
      behavior: PlayerSegmentCategoryBehavior.Skip,
      color: 'yellow',
      shade: 5,
    },
    [std.PlayerSegmentCategory.Interaction]: {
      enabled: false,
      behavior: PlayerSegmentCategoryBehavior.Skip,
      color: 'pink',
      shade: 5,
    },
    [std.PlayerSegmentCategory.Intro]: {
      enabled: false,
      behavior: PlayerSegmentCategoryBehavior.Skip,
      color: 'teal',
      shade: 5,
    },
    [std.PlayerSegmentCategory.Outro]: {
      enabled: false,
      behavior: PlayerSegmentCategoryBehavior.Skip,
      color: 'indigo',
      shade: 5,
    },
    [std.PlayerSegmentCategory.Preview]: {
      enabled: false,
      behavior: PlayerSegmentCategoryBehavior.Skip,
      color: 'cyan',
      shade: 5,
    },
    [std.PlayerSegmentCategory.Filler]: {
      enabled: false,
      behavior: PlayerSegmentCategoryBehavior.Skip,
      color: 'violet',
      shade: 5,
    },
    [std.PlayerSegmentCategory.MusicOfftopic]: {
      enabled: false,
      behavior: PlayerSegmentCategoryBehavior.Skip,
      color: 'orange',
      shade: 5,
    },
  },
})
export const playerSegmentsCategoriesAtom = focusAtom(playerSegmentsAtom, (optic) => optic.prop('categories'))
export const playerSegmentsHighlightAtom = focusAtom(playerSegmentsAtom, (optic) => optic.prop('highlight'))
