import { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'

import * as std from '@std'

import { PlayerContext } from './context'
import { useClosedCaptions, usePlaybackRate } from './hooks/use'
import usePoll from '@/hooks/usePoll'

const ClosedCaptionsContainer = styled.div<{ $overlapping: boolean }>`
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 2rem;
  text-align: ${({ $overlapping }) => ($overlapping ? 'left' : 'center')};

  width: ${({ $overlapping }) => ($overlapping ? '100%' : 'auto')};
  max-width: 632px;
  border-radius: 4px;

  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  white-space: pre-wrap;
`

export const ClosedCaptions: React.FC = () => {
  const playerContext = useContext(PlayerContext)!
  const { closedCaptions } = useClosedCaptions(playerContext)
  const { playbackRate } = usePlaybackRate(playerContext)

  const [track, setTrack] = useState<std.ClosedCaptionTrack | undefined>(undefined)
  useEffect(() => {
    if (!closedCaptions) return setTrack(undefined)
    closedCaptions.getTrack().then(setTrack).catch(console.error)
  }, [closedCaptions])

  const [cues, setCues] = useState<string[]>([])
  usePoll(() => {
    if (!track) {
      setCues([])
      return Infinity
    }

    // Update the cues
    const currentTimeMS = playerContext.currentTimeMS.get()
    setCues(
      track
        .filter(caption => caption.startTimeMS <= currentTimeMS && caption.endTimeMS >= currentTimeMS)
        .flatMap(caption =>
          'words' in caption
            ? caption.words
                .filter(word => word.startTimeMS <= currentTimeMS)
                .map(_ => _.text)
                .join('')
            : caption.text,
        ),
    )

    // Queue the next update
    // fixme: inefficient on long videos because of filter
    const timeOfNextCueWord =
      track
        .filter(caption => caption.startTimeMS <= currentTimeMS)
        .flatMap(caption => ('words' in caption ? caption.words : caption))
        .find(caption => caption.startTimeMS > currentTimeMS)?.startTimeMS ?? 100
    return (timeOfNextCueWord - currentTimeMS) / playbackRate
  }, [playerContext, playbackRate, track])

  if (!cues || cues.length === 0) return <></>
  return (
    <ClosedCaptionsContainer $overlapping={closedCaptions?.type === std.ClosedCaptionType.Overlapping}>
      {cues.join('\n')}
    </ClosedCaptionsContainer>
  )
}
