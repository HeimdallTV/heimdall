import { Button } from '../../components/button'
import { ContinuationItem } from '../../components/continuation'
import { Renderer } from '../../core/internals'

export type CommentReplies = Renderer<
  'commentReplies',
  {
    contents: ContinuationItem[]
    viewReplies: Button<undefined>
    hideReplies: Button<undefined>
  }
>
