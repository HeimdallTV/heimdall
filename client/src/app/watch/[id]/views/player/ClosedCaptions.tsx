import styled from '@emotion/styled'
import { useContext, useEffect, useState } from 'react'
import { PlayerContext } from './context'
import { useClosedCaptions, useCurrentTimeMS } from './hooks/use'
import * as std from '@std'

const ClosedCaptionsContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 4rem;
  text-align: center;

  max-width: 600px;
  border-radius: 4px;

  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
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

  const currentCaption = closedCaptionsTrack?.find(
    caption => caption.startTimeMS <= currentTimeMS && caption.endTimeMS >= currentTimeMS,
  )
  if (!currentCaption) return <></>
  return <ClosedCaptionsContainer>{currentCaption.text}</ClosedCaptionsContainer>
}
