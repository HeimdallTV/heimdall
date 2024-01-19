import { useContext } from 'react'
import { PlayerContext } from '../context'
import { useDurationMS, usePlaybackRate, usePlayerState } from '../hooks/use'
import { Text } from '@mantine/core'
import { addMilliseconds } from 'date-fns/addMilliseconds'
import { format } from 'date-fns/format'

export const EndsAt: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { durationMS } = useDurationMS(playerInstance!)
  const { playbackRate } = usePlaybackRate(playerInstance!)
  const _ = usePlayerState(playerInstance!)
  const timeLeftMS = (durationMS - playerInstance!.getCurrentTimeMS()) / playbackRate
  return (
    <Text span fw={500}>
      Ends at {format(addMilliseconds(new Date(), isNaN(timeLeftMS) ? 0 : timeLeftMS), 'h:mm aa')}
    </Text>
  )
}
