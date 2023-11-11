import { Grid, Column, Row } from 'lese'
import { Button, Skeleton, Text } from '@mantine/core'
import { ChannelIcon, ChannelName } from '@/components/Channel/Link'
import { toShortHumanReadable } from '@/parser/yt/core/helpers'
import {
  IconHeart,
  IconHeartFilled,
  IconSend,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from '@tabler/icons-react'
import { Description } from './Description'
import { Video } from '@/parser/std'
import { RelatedVideos } from './RelatedVideos'
import * as std from '@/parser/std'
import styled from 'styled-components'

const WatchGrid = styled(Grid)`
  max-width: 1280px;
  width: 100%;
  margin: auto;
  padding: 0 24px;
`

export const WatchInfo: React.FC<{ video?: Video }> = ({ video }) => (
  <WatchGrid columns="auto 400px" gap="24px">
    <VideoInfo video={video} />
    {video && <RelatedVideos video={video} />}
  </WatchGrid>
)

const VideoTitle: React.FC<{ title?: string }> = ({ title }) => {
  if (title === undefined) return <Skeleton height="2em" />
  return (
    <Text size="1.4em" lh="1.4em" fw={600}>
      {title}
    </Text>
  )
}

const VideoAuthor: React.FC<{ author?: std.User }> = ({ author }) => {
  if (author === undefined) {
    return (
      <Row separation="16px 32px" yAlign>
        <Skeleton circle height="40px" />
        <Column separation="4px">
          <Skeleton width="120px" height="1em" />
          <Skeleton width="80px" height="1em" />
        </Column>
        <Skeleton width="110px" height="36px" />
      </Row>
    )
  }
  return (
    <Row separation="16px 32px" yAlign>
      <ChannelIcon size={40} channel={author} />
      <ChannelInfo author={author} />
      <FollowButton followed={author?.followed} />
    </Row>
  )
}

const VideoInteractions: React.FC<{ video?: Video }> = ({ video }) => {
  if (!video) return <Skeleton width="400px" height="36px" />
  return (
    <Row separation="8px" yAlign>
      <LikeButtons {...video} />
      <ShareButton />
      <OverflowButton />
    </Row>
  )
}

export const VideoInfo: React.FC<{ video?: Video }> = ({ video }) => (
  <Column separation="12px 24px">
    <VideoTitle title={video?.title} />
    <Row xAlign="space-between" yAlign>
      {(!video || video.author) && <VideoAuthor author={video?.author} />}
      <VideoInteractions video={video} />
    </Row>
    <Description
      description={video?.description!}
      viewCount={video?.viewCount!}
      publishDate={video?.publishDate!}
    />
  </Column>
)

// todo: better name
export const ChannelInfo: React.FC<{ author?: std.User }> = ({ author }) => (
  <Column separation="4px">
    <ChannelName author={author} />
    {(!author || author.followerCount !== undefined) && (
      <SubscriberCount followerCount={author?.followerCount} />
    )}
  </Column>
)

const SubscriberCount: React.FC<{ followerCount?: number }> = ({ followerCount }) => {
  if (followerCount === undefined) return <Skeleton width="120px" height="1em" />
  return (
    <Text c="dimmed" fs="0.9em">
      {toShortHumanReadable(followerCount!)} subscribers
    </Text>
  )
}

export const FollowButton: React.FC<{
  followed?: boolean
  setFollowed: (cb: (followed: boolean) => boolean) => void
}> = ({ followed, setFollowed }) => {
  if (followed === undefined) return <Skeleton width="110px" height="36px" />
  return (
    <Button onClick={() => setFollowed(followed => !followed)} variant={followed ? 'light' : 'filled'}>
      {followed ? (
        <IconHeartFilled size={24} style={{ marginRight: '6px' }} />
      ) : (
        <IconHeart size={24} style={{ marginRight: '6px' }} />
      )}
      {followed ? 'Following' : 'Follow'}
    </Button>
  )
}

export const LikeButtons: React.FC<{
  likeStatus?: std.LikeStatus
  likeCount?: number
  dislikeCount?: number
}> = ({ likeStatus, likeCount, dislikeCount }) => {
  return (
    <Button.Group>
      <Button variant="default">
        {likeStatus === std.LikeStatus.Like ? (
          <IconThumbUpFilled fontSize="large" />
        ) : (
          <IconThumbUp fontSize="large" />
        )}
        <Text ml="6px">{toShortHumanReadable(likeCount ?? 0)}</Text>
      </Button>
      <Button variant="default">
        {likeStatus === std.LikeStatus.Dislike ? (
          <IconThumbDownFilled fontSize="large" />
        ) : (
          <IconThumbDown fontSize="large" />
        )}
        <Text ml="6px">{toShortHumanReadable(dislikeCount ?? 0)}</Text>
      </Button>
    </Button.Group>
  )
}

export const ShareButton = () => (
  <Button variant="default">
    <IconSend fontSize="large" />
    <Text ml="6px">Share</Text>
  </Button>
)

export const OverflowButton = () => <Button variant="default">...</Button>
