import { useCallback, useEffect, useState } from 'react'
import { usePaginated } from '@/hooks/usePaginated'
import yt from '@/parser/yt'
import * as std from '@/parser/std'
import { Avatar, Text, UnstyledButton } from '@mantine/core'
import { Column, Row } from 'lese'
import { formatDateAgo } from '@/libs/format'
import { RichTextChunk } from '@/components/RichText'
import { toShortHumanReadable } from '@/parser/yt/core/helpers'
import { DislikeIcon, LikeIcon } from '@/components/Badges'

export const Comments: React.FC<{ videoId: string }> = ({ videoId }) => {
  const [commentPages, errors, next, done] = usePaginated(
    useCallback(() => yt.listComments!(videoId), [videoId]),
  )
  useEffect(() => {
    if (errors.length) console.error(errors)
  }, [errors])
  return (
    <Column separation="32px">
      {commentPages.flat().map(comment => (
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
          {comment.content.map((chunk, i) => (
            <RichTextChunk key={i} chunk={chunk} />
          ))}
        </Text>
        <CommentMetadata comment={comment} />
      </Column>
    </Row>
  )
}

const CommentMetadata: React.FC<{ comment: std.Comment }> = ({ comment }) => {
  return (
    <Row yAlign separation="16px 8px 10px">
      <Text fw="bold" size="sm">
        REPLY
      </Text>
      {comment.likeStatus && comment.likes !== undefined && comment.setLikeStatus && (
        <CommentLikeButtons
          likeStatus={comment.likeStatus}
          likeCount={comment.likes}
          setLikeStatus={comment.setLikeStatus}
        />
      )}
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
  const [currentLikeStatus, setCurrentLikeStatus] = useState<std.LikeStatus>(initialLikeStatus)
  // fixme: should use a queue for the user actions and run this serially on the latest user action
  const setLikeStatus = useCallback(
    async (newLikeStatus: std.LikeStatus) => {
      setCurrentLikeStatus(newLikeStatus)
      await externalSetLikeStatus(currentLikeStatus, newLikeStatus).catch(err => {
        setCurrentLikeStatus(currentLikeStatus)
        throw err
      })
    },
    [externalSetLikeStatus, currentLikeStatus],
  )

  return (
    <>
      <UnstyledButton
        onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Like, currentLikeStatus))}
      >
        <LikeIcon likeStatus={currentLikeStatus} size="lg" />
      </UnstyledButton>
      <Text fw="bold" size="sm">
        {toShortHumanReadable(
          Math.max(
            0,
            likeCount +
              std.matchLikeStatus(currentLikeStatus, 1, 0, -1) +
              std.matchLikeStatus(initialLikeStatus, -1, 0, 1),
          ),
        )}
      </Text>
      <UnstyledButton
        onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Dislike, currentLikeStatus))}
      >
        <DislikeIcon likeStatus={currentLikeStatus} size="lg" />
      </UnstyledButton>
    </>
  )
}
