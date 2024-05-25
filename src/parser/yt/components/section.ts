import type { Renderer } from '../core/internals'

export type RichSection<Content extends Renderer> = Renderer<
  'richSection',
  { content: Content; fullBleed: boolean }
>
