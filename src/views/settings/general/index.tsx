import { enable24HourTimeAtom } from '@/settings'
import { SegmentedControl } from '@mantine/core'
import { useAtom } from 'jotai'
import { Label } from '../components'

export default function PlayerGeneralSettings() {
  const [enable24HourTime, setEnable24HourTime] = useAtom(enable24HourTimeAtom)
  return (
    <>
      <Label label="Time format" description="Default chosen based on browser preference" reverse>
        <SegmentedControl
          value={String(enable24HourTime)}
          onChange={(value) => setEnable24HourTime(value === 'true')}
          data={[
            { label: '12 Hour', value: 'false' },
            { label: '24 Hour', value: 'true' },
          ]}
        />
      </Label>
    </>
  )
}
