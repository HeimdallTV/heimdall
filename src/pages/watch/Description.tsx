import { Link } from 'wouter'
import { styled } from '@linaria/react'

import { RichText, RichTextChunk, RichTextChunkType } from '@/parser/std'
import { useEffect, useRef, useState } from 'react'
import { formatDateAgo, formatNumberShort } from '@/libs/format'
import { Anchor, Skeleton, Text, UnstyledButton } from '@mantine/core'

const DescriptionContainer = styled.div<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 12px;
  border-radius: 12px;
  background-color: var(--mantine-color-default);

  > * + * {
    margin-top: 8px;
  }

  &:hover {
    background-color: ${({ isExpanded }) =>
      !isExpanded ? 'var(--mantine-color-default-hover)' : 'var(--mantine-color-default)'};
    cursor: ${({ isExpanded }) => (!isExpanded ? 'pointer' : 'auto')};
  }
`

export const Description: React.FC<{
  description?: RichText
  viewCount?: number
  publishDate?: Date
}> = ({ viewCount, publishDate, description }) => {
  const [requiresExpansion, setRequiresExpansion] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const descriptionText = descriptionRef.current?.children[1]
    if (descriptionText) {
      setRequiresExpansion(descriptionText.scrollHeight > descriptionText.clientHeight)
    }
  }, [])

  // TODO Get a better key for the description list rendering
  return (
    <DescriptionContainer ref={descriptionRef} isExpanded={isExpanded} onClick={() => setIsExpanded(true)}>
      <DescriptionHeader viewCount={viewCount} publishDate={publishDate} />
      <DescriptionChunks chunks={description} isExpanded={isExpanded} />
      <ShowMoreLessButton
        requiresExpansion={requiresExpansion}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
    </DescriptionContainer>
  )
}

const DescriptionHeader: React.FC<{ viewCount?: number; publishDate?: Date }> = ({
  viewCount,
  publishDate,
}) => {
  if (viewCount === undefined && publishDate === undefined) return <Skeleton width="160px" height="1.5em" />

  const text = []
  if (viewCount !== undefined) text.push(`${formatNumberShort(viewCount)} views`)
  if (publishDate !== undefined) text.push(formatDateAgo(publishDate))
  return <Text fw={500}>{text.join(' ')}</Text>
}

const ShowMoreLessButton: React.FC<{
  requiresExpansion: boolean
  isExpanded: boolean
  setIsExpanded: (value: React.SetStateAction<boolean>) => void
}> = ({ requiresExpansion, isExpanded, setIsExpanded }) => {
  if (!requiresExpansion) return
  return (
    <UnstyledButton
      fw={500}
      onClick={e => {
        e.stopPropagation()
        setIsExpanded(expanded => !expanded)
      }}
    >
      {isExpanded ? 'Show Less' : 'Show More'}
    </UnstyledButton>
  )
}

const DescriptionChunks: React.FC<{ chunks?: RichTextChunk[]; isExpanded: boolean }> = ({
  chunks,
  isExpanded,
}) => {
  if (chunks === undefined) {
    return (
      <>
        <Skeleton width="250px" height="1em" />
        <Skeleton width="200px" height="1em" />
        <Skeleton width="170px" height="1em" />
      </>
    )
  }
  return (
    <Text lineClamp={isExpanded ? Infinity : 3}>
      {chunks.map((chunk, i) => (
        <DescriptionChunk key={i} chunk={chunk} />
      ))}
    </Text>
  )
}

const DescriptionChunk: React.FC<{ chunk: RichTextChunk }> = ({ chunk }) => {
  if (chunk.type !== RichTextChunkType.Text) return
  if (chunk.href !== undefined) {
    // todo: instead of stopping propagation here, we should instead check the target in the top
    // level listener
    return (
      <Anchor component={Link} href={chunk.href} target="_blank" onClick={e => e.stopPropagation()}>
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
