type ProviderConfig = {
  thumbnailUrl: string
}

/**TODO:(@aaditya-sahay): make this more extendable for future providers  */
type Config = {
  youtube: ProviderConfig
}

export const config: Config = {
  youtube: {
    thumbnailUrl: 'https://i.ytimg.com/vi/',
  },
}
