import { useContext } from 'react'
import { PlayerContext } from '../context'
import { useCurrentTimeMS, useDurationMS } from '../hooks/use'
import { formatNumberDuration } from '@libs/format'
import { Text } from '@mantine/core'

export const Duration: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { durationMS } = useDurationMS(playerInstance!)
  const { currentTimeMS } = useCurrentTimeMS(playerInstance!)
  return (
    <Text span fw={500}>
      {formatNumberDuration(currentTimeMS / 1000)} /{' '}
      {formatNumberDuration((isNaN(durationMS) ? 0 : durationMS) / 1000)}
    </Text>
  )
}
