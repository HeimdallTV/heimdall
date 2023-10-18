import { useContext } from 'react'
import { PlayerContext } from '../context'
import { useCurrentTimeMS, useDurationMS } from '../hooks/use'
import { formatNumberDuration } from '@libs/format'
import { Text } from '@components/Typography'

export const Duration: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { durationMS } = useDurationMS(playerInstance!)
  const { currentTimeMS } = useCurrentTimeMS(playerInstance!)
  return (
    <Text>
      {formatNumberDuration(currentTimeMS / 1000)} / {formatNumberDuration(durationMS / 1000)}
    </Text>
  )
}
