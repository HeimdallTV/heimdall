import styled from '@emotion/styled'
import { useContext, useState } from 'react'
import { PlayerContext } from '../context'
import { useBufferedMS, useCurrentTimeMS, useDurationMS } from '../hooks/use'
import { Row } from 'lese'

const SeekBarSectionContainer = styled.div<{ widthPercent: number }>`
  position: relative;
  width: ${_ => _.widthPercent}%;
  background-color: rgba(255, 255, 255, 0.2);
  height: 3px;
  border-radius: 2px;

  transition: transform 0.2s ease;
  transform: scaleY(1);
  &:hover {
    transform: scaleY(2);
  }
`

const SeekBarSectionPadding = styled.div`
  position: absolute;
  bottom: -4px;
  height: 20px;
  left: 0;
  right: 0;
`

const SeekBarSection: FC<PropsWithChildren<{ widthPercent: number }>> = ({ widthPercent, children }) => {
  const [hover, setHover] = useState(false)
  return (
    <SeekBarSectionContainer widthPercent={widthPercent}>
      <SeekBarSectionPadding onMouseOver={() => setHover(true)} onMouseOut={() => setHover(true)} />
      {children}
    </SeekBarSectionContainer>
  )
}

const SeekBarOverlay = styled.div<{ left: string; right: string; color: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${_ => _.left};
  right: ${_ => _.right};
  background-color: ${_ => _.color};
`

const SeekBarThumbStyled = styled.div`
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.1s ease;
  background-color: var(--red);
  pointer-events: none;
`

const SeekBarThumb: FC<{ percent: number }> = ({ percent }) => (
  <SeekBarThumbStyled className="seek-bar-thumb" style={{ left: `${percent}%` }} />
)

const SeekBarContainer = styled(Row)`
  position: relative;
  cursor: pointer;
  &:hover ${SeekBarThumbStyled} {
    transform: translate(-50%, -50%) scale(1);
  }
`

export const SeekBar: FC = () => {
  const playerContext = useContext(PlayerContext)
  const { currentTimeMS } = useCurrentTimeMS(playerContext!)
  const { durationMS } = useDurationMS(playerContext!)
  const { bufferedMS } = useBufferedMS(playerContext!)
  return (
    <SeekBarContainer separation="2px">
      <SeekBarSection widthPercent={100}>
        <SeekBarOverlay left="0" right={`${100 - (currentTimeMS / durationMS) * 100}%`} color="var(--red)" />
        <SeekBarOverlay
          left="0"
          right={`${100 - (bufferedMS / durationMS) * 100}%`}
          color="rgba(255, 255, 255, 0.2)"
        />
      </SeekBarSection>
      <SeekBarThumb percent={(currentTimeMS / durationMS) * 100} />
    </SeekBarContainer>
  )
}
