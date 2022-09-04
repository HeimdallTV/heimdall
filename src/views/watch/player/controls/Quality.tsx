import { SettingsRounded } from '@mui/icons-material'
import { useContext, useMemo, useState } from 'react'
import { PlayerContext } from '../context'
import { useSource } from '../hooks/use'
import { Button } from '../components/Button'
import { CombinedSource } from '../hooks/usePlayer'
import { not } from 'ramda'
import * as std from '@std'
import { FloatingMenuContainer, Menu, MenuListItem } from '../components/Menu'

type QualityOption = {
  height: number
  frameRate: number
  bitRate: number
  source: CombinedSource
}

const getQualityOptions = (sources: std.Source<std.SourceType>[]) => {
  const bestAudioSource = sources
    .filter(std.isAudioSource)
    .sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0))[0]
  if (!bestAudioSource) {
    throw Error('An audio source must be available for now')
  }
  const combinedQualityOptions = sources.filter(std.isVideoSource).map(source => ({
    height: source.height,
    frameRate: source.frameRate,
    bitRate: source.videoBitrate!,
    source: { video: source, audio: bestAudioSource },
  }))
  const videoQualityOptions = sources.filter(std.isAudioVideoSource).map(source => ({
    height: source.height,
    frameRate: source.frameRate,
    bitRate: source.videoBitrate!,
    source,
  }))
  return (
    [...combinedQualityOptions, ...videoQualityOptions]
      .sort((a, b) => b.bitRate - a.bitRate)
      .sort((a, b) => b.frameRate - a.frameRate)
      .sort((a, b) => b.height - a.height)
      // We've sorted by the best sources so now remove duplicates
      .filter(
        (source, index, sources) =>
          !sources.slice(0, index).some(previousSource => previousSource.height === source.height),
      )
  )
}

export const Quality: FC = () => {
  const [visible, setVisible] = useState(false)
  const playerInstance = useContext(PlayerContext)
  const { source: selectedSource, sources, setSource } = useSource(playerInstance!)
  const selectedSourceHeight = !selectedSource
    ? 0
    : 'video' in selectedSource
    ? selectedSource.video.height
    : selectedSource.height
  const qualityOptions: QualityOption[] = useMemo(() => getQualityOptions(sources), [sources])

  return (
    <FloatingMenuContainer visible={visible} setVisible={setVisible}>
      <Button onClick={() => setVisible(not)}>
        <SettingsRounded />
      </Button>
      <Menu background="var(--bg-700)">
        {qualityOptions.map(({ height, frameRate, source }) => (
          <MenuListItem
            key={height}
            onClick={() => setSource(source)}
            selected={height === selectedSourceHeight}
          >
            {height}p{frameRate > 30 ? frameRate : ''}
          </MenuListItem>
        ))}
      </Menu>
    </FloatingMenuContainer>
  )
}
