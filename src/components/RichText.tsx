import * as std from '@/parser/std'
import { Anchor, Text } from '@mantine/core'
import { Link } from 'wouter'

const RichTextChunk: React.FC<{ chunk: std.RichTextChunk }> = ({ chunk }) => {
  if (chunk.type !== std.RichTextChunkType.Text) return null
  if (chunk.href !== undefined) {
    // todo: instead of stopping propagation here, we should instead check the target in the top
    // level listener
    return (
      <Anchor
        component={Link}
        href={chunk.href}
        target="_blank"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {chunk.content}
      </Anchor>
    )
  }
  return (
    <Text
      component="span"
      style={{
        display: 'inline',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {chunk.content}
    </Text>
  )
}

export const RichText: React.FC<{ chunks?: std.RichTextChunk[] }> = ({ chunks }) => {
  if (chunks === undefined) return null
  return (
    <>
      {chunks.map((chunk, i) => (
        <RichTextChunk key={i} chunk={chunk} />
      ))}
    </>
  )
}
