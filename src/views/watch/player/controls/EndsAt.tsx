import { useContext, useState } from 'react'
import { PlayerContext } from '../context'
import { useCurrentScrubTimeMS, useDurationMS, usePlaybackRate } from '../hooks/use'
import { Text } from '@mantine/core'
import { addMilliseconds } from 'date-fns/addMilliseconds'
import usePoll from '@/hooks/usePoll'
import { useAtom } from 'jotai'
import { enable24HourTimeAtom } from '@/settings'

export const EndsAt: React.FC = () => {
  const player = useContext(PlayerContext)!
  const [timeLeftMS, setTimeLeftMS] = useState(0)
  const { durationMS } = useDurationMS(player)
  const { currentScrubTimeMS } = useCurrentScrubTimeMS(player)
  const { playbackRate } = usePlaybackRate(player)
  usePoll(() => {
    if (durationMS === undefined) {
      setTimeLeftMS(0)
      return Number.POSITIVE_INFINITY
    }
    setTimeLeftMS((durationMS - (currentScrubTimeMS ?? player.currentTimeMS.get())) / playbackRate)
    return 1000
  }, [durationMS, currentScrubTimeMS, playbackRate, player])

  const [use24HourClock] = useAtom(enable24HourTimeAtom)
  const date = addMilliseconds(new Date(), Number.isNaN(timeLeftMS) ? 0 : timeLeftMS)
  const hour = date.getHours() === 0 ? 12 : date.getHours()
  const endsAt12Hour = `${((hour - 1) % 12) + 1}:${String(date.getMinutes()).padStart(2, '0')} ${
    date.getHours() >= 12 ? 'PM' : 'AM'
  }`
  const endsAt24Hour = `${date.getHours() + 1}:${String(date.getMinutes()).padStart(2, '0')}`
  return (
    <Text span fw={500}>
      Ends at {use24HourClock ? endsAt24Hour : endsAt12Hour}
    </Text>
  )
}
