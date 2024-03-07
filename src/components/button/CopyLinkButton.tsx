// todo: should this be in here or the watch view folder?
import type * as std from '@std'
import { resolveSize } from '../utils'
import { IconCheck, IconClipboard, IconClock } from '@tabler/icons-react'
import { Button, Tooltip } from '@mantine/core'
import { CollapsedButton, CollapsibleButton } from './CollapsibleButton'
import { useTemporary } from '@/hooks/useTemporary'

export const CopyLinkButton: FC<{
  provider: std.ProviderName
  videoId: string
  getCurrentTimeMS: () => number
}> = ({ provider, videoId, getCurrentTimeMS }) => {
  const [copied, setCopied] = useTemporary<boolean>()
  const [copiedAt, setCopiedAt] = useTemporary<boolean>()
  const CopiedIcon = copied ? IconCheck : IconClipboard
  return (
    <Button.Group>
      <CollapsibleButton
        variant="default"
        leftSection={<CopiedIcon size={resolveSize('xl')} />}
        $collapseWidth="500px"
        onClick={() => {
          // TODO: use provider
          navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}`)
          setCopied(true)
        }}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </CollapsibleButton>
      <Tooltip label="Copy link at current time" openDelay={500}>
        <CollapsedButton
          variant="default"
          onClick={() => {
            // TODO: use provider
            const currentTimeSeconds = Math.floor(getCurrentTimeMS() / 1000)
            navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}&t=${currentTimeSeconds}`)
            setCopiedAt(true)
          }}
        >
          {copiedAt && <IconCheck size={resolveSize('xl')} />}
          {!copiedAt && <IconClock size={resolveSize('xl')} />}
        </CollapsedButton>
      </Tooltip>
    </Button.Group>
  )
}
