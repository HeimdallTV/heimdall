import { useCallback, useEffect } from 'react'
import { usePaginated } from '@/hooks/usePaginated'
import yt from '@/parser/yt'
import * as std from '@/parser/std'
import { Avatar, Text } from '@mantine/core'
import { Column, Row } from 'lese'
import { formatDateAgo } from '@/libs/format'
import { IconThumbDown, IconThumbDownFilled, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import { RichTextChunk } from '@/components/RichText'

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
      <Column separation="4px">
        <Row yAlign separation="4px">
          <Text component="h3" size="sm" fw={600}>
            {comment.author.name}
          </Text>
          <Text c="dimmed" size="xs">
            {formatDateAgo(comment.publishedAt)}
          </Text>
        </Row>
        <Text size="sm" lh="lg">
          {comment.content.map((chunk, i) => (
            <RichTextChunk key={i} chunk={chunk} />
          ))}
        </Text>
        <Row yAlign separation="16px 8px 10px">
          <Text fw="bold" size="xs">
            REPLY
          </Text>
          {comment.likeStatus === std.LikeStatus.Like ? (
            <IconThumbUpFilled size={20} />
          ) : (
            <IconThumbUp size={20} />
          )}
          <Text fw="bold" size="xs">
            {comment.likes}
          </Text>
          {comment.likeStatus === std.LikeStatus.Dislike ? (
            <IconThumbDownFilled size={20} />
          ) : (
            <IconThumbDown size={20} />
          )}
        </Row>
      </Column>
    </Row>
  )
}
