import yt from '@yt'
import { useEagerMutation } from '@/hooks/useEagerMutation'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { useState } from 'react'
import { CollapsibleButton } from './CollapsibleButton'

export const FollowButton: React.FC<{ followed: boolean; userId: string }> = ({
  followed: initialFollowed,
  userId,
}) => {
  const [, followed, setFollowed] = useEagerMutation(
    initialFollowed,
    (_, desired) => yt.setUserFollowed(userId, desired),
    // todo: error notification
    console.error,
  )
  const [areYouSure, setAreYouSure] = useState(false)

  const Icon = followed ? IconHeartFilled : IconHeart
  const text = followed ? (areYouSure ? 'Are you sure?' : 'Following') : 'Follow'
  return (
    <CollapsibleButton
      onClick={() => {
        if (followed && !areYouSure) return setAreYouSure(true)
        setFollowed(!followed)
        setAreYouSure(false)
      }}
      variant={followed ? 'light' : 'filled'}
      leftSection={<Icon size={24} />}
    >
      {text}
    </CollapsibleButton>
  )
}
