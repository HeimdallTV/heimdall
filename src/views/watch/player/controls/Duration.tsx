import { useContext, useState } from 'react'
import { PlayerContext } from '../context'
import { useCurrentScrubTimeMS, useDurationMS, useSeekMS } from '../hooks/use'
import { formatNumberDuration } from '@libs/format'
import { Text } from '@mantine/core'
import usePoll from '@/hooks/usePoll'

export const Duration: React.FC = () => {
  const player = useContext(PlayerContext)!
  const { durationMS } = useDurationMS(player)
  const [currentTimeMS, setCurrentTimeMS] = useState(player.currentTimeMS.get())
  const { currentScrubTimeMS } = useCurrentScrubTimeMS(player)
  const { seekMS } = useSeekMS(player)
  usePoll(() => {
    setCurrentTimeMS(currentScrubTimeMS ?? player.currentTimeMS.get())
    return 1000 - (currentTimeMS % 1000)
  }, [player, seekMS, currentScrubTimeMS])

  return (
    <Text span fw={500}>
      {formatNumberDuration(currentTimeMS / 1000)} / {formatNumberDuration((durationMS ?? 0) / 1000)}
    </Text>
  )
}
