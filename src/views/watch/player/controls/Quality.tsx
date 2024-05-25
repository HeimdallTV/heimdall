import { IconCheck, IconSettingsFilled } from '@tabler/icons-react'
import { useContext, useMemo } from 'react'
import { PlayerContext } from '../context'
import { useSource } from '../hooks/use'
import type { CombinedSource } from '../hooks/usePlayerInstance'
import * as std from '@std'
import { Menu } from '@mantine/core'
import { ControlButton } from '../components/ControlButton'

type QualityOption = {
  width: number
  height: number
  aspectRatio: number
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
  const combinedQualityOptions = sources.filter(std.isVideoSource).map((source) => ({
    width: source.width,
    height: source.height,
    aspectRatio: source.height / source.width,
    frameRate: source.frameRate,
    bitRate: source.videoBitrate!,
    source: { video: source, audio: bestAudioSource },
  }))
  const videoQualityOptions = sources.filter(std.isAudioVideoSource).map((source) => ({
    width: source.width,
    height: source.height,
    aspectRatio: source.height / source.width,
    frameRate: source.frameRate,
    bitRate: source.videoBitrate!,
    source: { video: source, audio: source },
  }))
  return (
    [...combinedQualityOptions, ...videoQualityOptions]
      .sort((a, b) => b.bitRate - a.bitRate)
      .sort((a, b) => b.frameRate - a.frameRate)
      .sort((a, b) => b.height - a.height)
      // We've sorted by the best sources so now remove duplicates
      .filter(
        (source, index, sources) =>
          !sources.slice(0, index).some((previousSource) => previousSource.height === source.height),
      )
  )
}

export const Quality: React.FC = () => {
  const playerInstance = useContext(PlayerContext)
  const { source: selectedSource, sources, setSource } = useSource(playerInstance!)
  const selectedSourceHeight = selectedSource?.video.height ?? 0
  const qualityOptions: QualityOption[] = useMemo(() => getQualityOptions(sources), [sources])

  return (
    <Menu position="top" closeOnItemClick={false}>
      <Menu.Target>
        <ControlButton>
          <IconSettingsFilled />
        </ControlButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Quality</Menu.Label>
        {qualityOptions.map(({ height, aspectRatio, frameRate, source }) => (
          <Menu.Item
            key={height}
            leftSection={<IconCheck size={16} style={{ opacity: Number(selectedSourceHeight === height) }} />}
            onClick={() => setSource(source)}
          >
            {Math.round((height / aspectRatio / 16) * 9)}p{frameRate > 30 ? frameRate : ''}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
