import { useContext, useEffect, useState } from 'react'

import styled from 'styled-components'

import * as std from '@std'

import { PlayerContext } from './context'
import { useClosedCaptions, useCurrentTimeMS } from './hooks/use'

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
  const playerContext = useContext(PlayerContext)
  const { closedCaptions } = useClosedCaptions(playerContext!)
  const { currentTimeMS } = useCurrentTimeMS(playerContext!)

  const [closedCaptionsTrack, setClosedCaptionsTrack] = useState<std.ClosedCaptionTrack | undefined>(
    undefined,
  )
  useEffect(() => {
    if (!closedCaptions) return setClosedCaptionsTrack(undefined)
    closedCaptions.getTrack().then(setClosedCaptionsTrack).catch(console.error)
  }, [closedCaptions])

  const currentCaptionCues = closedCaptionsTrack?.filter(
    caption => caption.startTimeMS <= currentTimeMS && caption.endTimeMS >= currentTimeMS,
  )
  if (!currentCaptionCues || currentCaptionCues.length === 0) return <></>
  return (
    <ClosedCaptionsContainer $overlapping={closedCaptions?.type === std.ClosedCaptionType.Overlapping}>
      {currentCaptionCues
        .map(cue =>
          'words' in cue
            ? cue.words
                .filter(word => word.startTimeMS <= currentTimeMS)
                .map(cue => cue.text)
                .join('')
            : cue.text,
        )
        .join('\n')}
    </ClosedCaptionsContainer>
  )
}
