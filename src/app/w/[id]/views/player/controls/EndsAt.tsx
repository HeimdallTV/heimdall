import { useContext, useState } from 'react'
import { PlayerContext } from '../context'
import { useCurrentScrubTimeMS, useDurationMS, usePlaybackRate } from '../hooks/use'
import { Text } from '@mantine/core'
import { addMilliseconds } from 'date-fns/addMilliseconds'
import { format } from 'date-fns/format'
import usePoll from '@/hooks/usePoll'

export const EndsAt: React.FC = () => {
  const player = useContext(PlayerContext)!
  const [timeLeftMS, setTimeLeftMS] = useState(0)
  const { durationMS } = useDurationMS(player)
  const { currentScrubTimeMS } = useCurrentScrubTimeMS(player)
  const { playbackRate } = usePlaybackRate(player)
  usePoll(() => {
    setTimeLeftMS((durationMS - (currentScrubTimeMS ?? player.currentTimeMS.get())) / playbackRate)
    return 1000
  }, [durationMS, currentScrubTimeMS, playbackRate, player])

  return (
    <Text span fw={500}>
      Ends at {format(addMilliseconds(new Date(), isNaN(timeLeftMS) ? 0 : timeLeftMS), 'h:mm aa')}
    </Text>
  )
}
