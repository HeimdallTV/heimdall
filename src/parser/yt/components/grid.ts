import type { Renderer } from '../core/internals'

export type Grid<Item extends Renderer> = Renderer<
  'grid',
  {
    items: Item[]
    targetId: string
  }
>

export type RichGrid<Content extends Renderer, Header extends Renderer | undefined = undefined> = Renderer<
  'richGrid',
  {
    contents: Content[]
    header: Header
    // TODO:
    targetId: string
    // TODO:
    reflowOptions: {
      minimumRowsOfVideosAtStart: number
      minimumRowsOfVideosBetweenSections: number
    }
  }
>
