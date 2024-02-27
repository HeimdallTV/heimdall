import * as std from '@std'
import yt from '@yt'
import { toShortHumanReadable } from '@/parser/yt/core/helpers'
import { useEagerMutation } from '@/hooks/useEagerMutation'
import { Button } from '@mantine/core'
import { DislikeIcon, LikeIcon } from '../Icons'
import { CollapsibleButton } from './CollapsibleButton'

export const LikeButtons: React.FC<{
  videoId: string
  likeStatus: std.LikeStatus
  likeCount?: number
  dislikeCount?: number
}> = ({ videoId, likeStatus: initialLikeStatus, likeCount, dislikeCount }) => {
  const [, likeStatus, setLikeStatus] = useEagerMutation(
    initialLikeStatus,
    (currentLikeStatus, desiredLikeStatus) =>
      yt.setVideoLikeStatus!(videoId, currentLikeStatus, desiredLikeStatus),
    // todo: error notification
    console.error,
  )

  // todo: handle provider not supporting like counts, or not supporting setting like status
  return (
    <Button.Group>
      <CollapsibleButton
        variant="default"
        collapseWidth="300px"
        leftSection={<LikeIcon likeStatus={likeStatus} size="xl" />}
        onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Like, likeStatus))}
      >
        {toShortHumanReadable(likeCount!) + likeStatus === std.LikeStatus.Like ? 1 : 0}
      </CollapsibleButton>
      <CollapsibleButton
        variant="default"
        collapseWidth="500px"
        leftSection={<DislikeIcon likeStatus={likeStatus} size="xl" />}
        onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Dislike, likeStatus))}
      >
        {toShortHumanReadable(dislikeCount!) + likeStatus === std.LikeStatus.Dislike ? 1 : 0}
      </CollapsibleButton>
    </Button.Group>
  )
}
