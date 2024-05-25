import { useCallback, useEffect, useState } from 'react'
import { usePaginated } from '@/hooks/usePaginated'
import yt from '@/parser/yt'
import * as std from '@/parser/std'
import { Avatar, Text, UnstyledButton } from '@mantine/core'
import { Column, Row } from 'lese'
import { formatDateAgo } from '@/libs/format'
import { RichText } from '@/components/RichText'
import { toShortHumanReadable } from '@/parser/yt/core/helpers'
import { DislikeIcon, LikeIcon } from '@/components/Icons'
import { useEagerMutation } from '@/hooks/useEagerMutation'

export const Comments: React.FC<{ videoId: string }> = ({ videoId }) => {
  const commentPages = usePaginated(useCallback(() => yt.listComments!(videoId), [videoId]))
  useEffect(() => {
    if (commentPages.errors.length) console.error(commentPages.errors)
  }, [commentPages.errors])
  return (
    <Column separation="32px">
      {commentPages.data.flat().map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </Column>
  )
}

const Comment: React.FC<{ comment: std.Comment }> = ({ comment }) => {
  return (
    <Row separation="16px">
      <Avatar radius="xl" src={comment.author.avatar![0].url} alt={comment.author.name} />
      <Column separation="6px">
        <Row yAlign separation="4px">
          <Text component="h3" size="sm" fw={600}>
            {comment.author.name}
          </Text>
          <Text c="dimmed" size="sm">
            {formatDateAgo(comment.publishedAt)}
          </Text>
        </Row>
        <Text size="md" lh="lg">
          <RichText chunks={comment.content} />
        </Text>
        <CommentMetadata comment={comment} />
      </Column>
    </Row>
  )
}

const CommentMetadata: React.FC<{ comment: std.Comment }> = ({ comment }) => {
  if (!comment.likes || !comment.likeStatus || !comment.setLikeStatus) return null
  return (
    <Row yAlign separation="8px 10px">
      <CommentLikeButtons
        likeStatus={comment.likeStatus}
        likeCount={comment.likes}
        setLikeStatus={comment.setLikeStatus}
      />
    </Row>
  )
}

const CommentLikeButtons = ({
  likeStatus: initialLikeStatus,
  likeCount,
  setLikeStatus: externalSetLikeStatus,
}: {
  likeStatus: std.LikeStatus
  likeCount: number
  setLikeStatus: (currentLikeStatus: std.LikeStatus, desiredLikeStatus: std.LikeStatus) => Promise<void>
}) => {
  const [, likeStatus, setLikeStatus] = useEagerMutation(
    initialLikeStatus,
    externalSetLikeStatus,
    // todo: error notification
    console.error,
  )

  return (
    <>
      <UnstyledButton onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Like, likeStatus))}>
        <LikeIcon likeStatus={likeStatus} size="lg" />
      </UnstyledButton>
      <Text fw="bold" size="sm">
        {toShortHumanReadable(
          Math.max(
            0,
            likeCount +
              std.matchLikeStatus(likeStatus, 1, 0, -1) +
              std.matchLikeStatus(initialLikeStatus, -1, 0, 1),
          ),
        )}
      </Text>
      <UnstyledButton onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Dislike, likeStatus))}>
        <DislikeIcon likeStatus={likeStatus} size="lg" />
      </UnstyledButton>
    </>
  )
}
