import { useContext } from 'react'
import { PlayerContext } from '../context'
import { useCurrentTimeMS, useDurationMS } from '../hooks/use'
import { Text } from '@components/Typography'
import addMilliseconds from 'date-fns/addMilliseconds'
import format from 'date-fns/esm/format'

export const EndsAt: FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { durationMS } = useDurationMS(playerInstance!)
  const { currentTimeMS } = useCurrentTimeMS(playerInstance!)
  const timeLeftMS = durationMS - currentTimeMS
  return <Text>Ends at {format(addMilliseconds(new Date(), isNaN(timeLeftMS) ? 0 : timeLeftMS), 'h:mm aa')}</Text>
}
