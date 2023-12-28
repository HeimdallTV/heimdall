import { Button } from '../../components/button'
import { ContinuationItem } from '../../components/continuation'
import { Renderer } from '../../core/internals'

export type CommentReplies = Renderer<
  'commentReplies',
  {
    contents: ContinuationItem[]
    viewReplies: Button
    viewRepliesIcon: Button
    /** Defined if the creator of the video has replied to the comment */
    viewRepliesCreatorThumbnail?: Button
    hideReplies: Button
    hideRepliesIcon: Button
  }
>
