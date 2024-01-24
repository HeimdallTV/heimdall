import styled from 'styled-components'
import { Column } from 'lese'
import * as std from '@/parser/std'
import { useEffect, useRef, useState } from 'react'
import { formatDateAgo, formatNumberShort } from '@/libs/format'
import { Skeleton, Text, UnstyledButton } from '@mantine/core'
import { RichTextChunk } from '@/components/RichText'

const DescriptionContainer = styled(Column)<{ $canExpanded: boolean }>`
  justify-content: flex-start;
  padding: 12px;
  border-radius: 12px;
  background-color: var(--mantine-color-default);

  > * + * {
    margin-top: 8px;
  }

  ${({ $canExpanded }) =>
		!$canExpanded &&
		`
  &:hover {
    background-color: var(--mantine-color-default-hover);
    cursor: pointer;
  }`}
`

// todo: handle no rich text chunks
export const Description: React.FC<{
	description?: std.RichText
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
	})

	// todo: Get a better key for the description list rendering
	return (
		<DescriptionContainer
			ref={descriptionRef}
			$canExpanded={isExpanded || !requiresExpansion}
			onClick={() => setIsExpanded(true)}
		>
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
	return <Text fw={500}>{text.join(' • ')}</Text>
}

const ShowMoreLessButton: React.FC<{
	requiresExpansion: boolean
	isExpanded: boolean
	setIsExpanded: (value: boolean | ((prevState: boolean) => boolean)) => void
}> = ({ requiresExpansion, isExpanded, setIsExpanded }) => {
	if (!requiresExpansion) return null
	return (
		<UnstyledButton
			fw={500}
			onClick={(e) => {
				e.stopPropagation()
				setIsExpanded((expanded) => !expanded)
			}}
		>
			{isExpanded ? 'Show Less' : 'Show More'}
		</UnstyledButton>
	)
}

const DescriptionChunks: React.FC<{ chunks?: std.RichTextChunk[]; isExpanded: boolean }> = ({
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
				<RichTextChunk key={i} chunk={chunk} />
			))}
		</Text>
	)
}
