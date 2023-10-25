import styled from 'styled-components'
import { Column } from 'lese'
import { Video } from '@/parser/std'
import { useEffect, useRef, useState } from 'react'
import { formatDateAgo, formatNumberShort } from '@/libs/format'
import Link from 'next/link'
import { Button, Text } from '@mantine/core'
import { not } from 'rambda'

const DescriptionContainer = styled(Column)<{ isExpanded: boolean }>`
  padding: 12px;
  border-radius: 12px;
  background-color: var(--bg-700);

  ${({ isExpanded }) =>
    isExpanded
      ? ''
      : `
  :hover {
    background-color: var(--bg-900);
    cursor: pointer;
  }`}
`

export const Description: React.FC<{
  description: Video['description']
  viewCount: number
  publishDate: Date
}> = props => {
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
    <DescriptionContainer
      ref={descriptionRef}
      separation="8px"
      xAlign="flex-start"
      isExpanded={isExpanded}
      onClick={() => setIsExpanded(true)}
    >
      <Text fw="medium">
        {formatNumberShort(props.viewCount)} views {formatDateAgo(props.publishDate)}
      </Text>
      <Text lineClamp={isExpanded ? Infinity : 3}>
        {props.description?.map((chunk, i) =>
          'href' in chunk ? (
            <Link key={i} href={chunk.href} onClick={e => e.stopPropagation()}>
              {chunk.content}
            </Link>
          ) : (
            <Text
              key={i}
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {chunk.content}
            </Text>
          ),
        )}
      </Text>
      {requiresExpansion && (
        <Button
          onClick={e => {
            e.stopPropagation()
            setIsExpanded(not)
          }}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </DescriptionContainer>
  )
}
