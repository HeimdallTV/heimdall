import { useContext, useState } from 'react'
import { PlayerContext } from '../context'
import { useDurationMS, usePlaybackRate } from '../hooks/use'
import { Text } from '@mantine/core'
import { addMilliseconds } from 'date-fns/addMilliseconds'
import { format } from 'date-fns/format'
import usePoll from '@/hooks/usePoll'

export const EndsAt: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const [timeLeftMS, setTimeLeftMS] = useState(0)
  const { durationMS } = useDurationMS(playerInstance!)
  const { playbackRate } = usePlaybackRate(playerInstance!)
  usePoll(() => {
    setTimeLeftMS((durationMS - playerInstance!.currentTimeMS.get()) / playbackRate)
    return 1000
  }, [durationMS, playbackRate, playerInstance])

  return (
    <Text span fw={500}>
      Ends at {format(addMilliseconds(new Date(), isNaN(timeLeftMS) ? 0 : timeLeftMS), 'h:mm aa')}
    </Text>
  )
}
