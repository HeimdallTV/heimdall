import type { Renderer } from '../core/internals'

export type RichItem<Content extends Renderer> = Renderer<'richItem', { content: Content }>
