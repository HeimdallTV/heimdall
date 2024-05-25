import * as std from '@std'
import { playerAutoplayAtom, playerDefaultQualityAtom } from '@/settings'
import { type ComboboxItem, SegmentedControl, Switch } from '@mantine/core'
import { useAtom } from 'jotai'
import { Label } from '../components'

export default function PlayerGeneralSettings() {
  const [autoplay, setAutoplay] = useAtom(playerAutoplayAtom)
  const [defaultQuality, setDefaultQuality] = useAtom(playerDefaultQualityAtom)
  return (
    <>
      <Label label="Autoplay" description="Attempt to automatically play the video when it's loaded">
        <Switch checked={autoplay} onChange={(event) => setAutoplay(event.currentTarget.checked)} />
      </Label>
      <Label
        label="Default Quality"
        description="Max quality level the player will use automatically"
        reverse
      >
        <SegmentedControl
          value={String(defaultQuality)}
          onChange={(value) => setDefaultQuality(Number(value))}
          data={std.SourceQualities.map<ComboboxItem>((quality) => ({
            label: quality.name,
            value: String(quality.width),
          }))}
        />
      </Label>
    </>
  )
}
