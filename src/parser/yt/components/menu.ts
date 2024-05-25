import type { Renderer } from '../core/internals'

// todo: incomplete
export type Menu<Item extends Renderer> = Renderer<'menu', { items: Item[] }>
