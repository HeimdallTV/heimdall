import { useContext, useState } from 'react'
import { PlayerContext } from '../context'
import { useDurationMS } from '../hooks/use'
import { formatNumberDuration } from '@libs/format'
import { Text } from '@mantine/core'
import usePoll from '@/hooks/usePoll'

export const Duration: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { durationMS } = useDurationMS(playerInstance!)
  const [currentTimeMS, setCurrentTimeMS] = useState(playerInstance!.getCurrentTimeMS())
  usePoll(() => {
    setCurrentTimeMS(playerInstance!.getCurrentTimeMS())
    return 1000 - (currentTimeMS % 1000)
  }, [playerInstance])

  return (
    <Text span fw={500}>
      {formatNumberDuration(currentTimeMS / 1000)} /{' '}
      {formatNumberDuration((isNaN(durationMS) ? 0 : durationMS) / 1000)}
    </Text>
  )
}
