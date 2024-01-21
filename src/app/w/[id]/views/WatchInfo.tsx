import { Grid, Column, Row } from 'lese'
import { Button, Skeleton, Text, Tooltip } from '@mantine/core'
import { ChannelIcon, ChannelName } from '@/components/Channel/Link'
import { toShortHumanReadable } from '@/parser/yt/core/helpers'
import { IconCheck, IconClipboard, IconClock, IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { Description } from './Description'
import { Video } from '@/parser/std'
import { RelatedVideos } from './RelatedVideos'
import * as std from '@/parser/std'
import styled from 'styled-components'
import { Comments } from './Comments'
import { useContext, useEffect, useState } from 'react'
import { PlayerContext } from './player/context'
import yt from '@yt'
import { DislikeIcon, LikeIcon, resolveSize } from '@/components/Badges'
import { useEagerMutation } from '@/hooks/useEagerMutation'

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
        <Skeleton width="130px" height="36px" />
      </Row>
    )
  }
  return (
    <Row separation="16px 32px" yAlign>
      <ChannelIcon size={40} channel={author} />
      <ChannelInfo author={author} />
      <FollowButton followed={Boolean(author.followed)} userId={author.id} />
    </Row>
  )
}

const VideoInteractions: React.FC<{ video?: Video }> = ({ video }) => {
  if (!video) return <Skeleton width="250px" height="36px" />
  return (
    <Row separation="8px" yAlign>
      <LikeButtons
        videoId={video.id}
        likeCount={video.likeCount}
        dislikeCount={video.dislikeCount}
        likeStatus={video.likeStatus!}
      />
      <CopyLinkButton videoId={video.id} provider={video.provider} />
    </Row>
  )
}

export const VideoInfo: React.FC<{ video?: Video }> = ({ video }) => (
  <Column separation="12px 24px 24px">
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
    {video?.id && <Comments videoId={video?.id!} />}
  </Column>
)

// todo: better name
export const ChannelInfo: React.FC<{ author?: std.User }> = ({ author }) => (
  <Column>
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

const FollowButton: React.FC<{ followed: boolean; userId: string }> = ({
  followed: initialFollowed,
  userId,
}) => {
  const [, followed, setFollowed] = useEagerMutation(
    initialFollowed,
    (_, desired) => yt.setUserFollowed(userId, desired),
    // todo: error notification
    console.error,
  )
  const [areYouSure, setAreYouSure] = useState(false)

  const Icon = followed ? IconHeartFilled : IconHeart
  const text = followed ? (areYouSure ? 'Are you sure?' : 'Following') : 'Follow'
  return (
    <Button
      onClick={() => {
        if (followed && !areYouSure) return setAreYouSure(true)
        setFollowed(!followed)
        setAreYouSure(false)
      }}
      variant={followed ? 'light' : 'filled'}
    >
      <Icon size={24} style={{ marginRight: '6px' }} />
      {text}
    </Button>
  )
}

export const LikeButtons: React.FC<{
  videoId: string
  likeStatus: std.LikeStatus
  likeCount?: number
  dislikeCount?: number
}> = ({ videoId, likeStatus: initialLikeStatus, likeCount, dislikeCount }) => {
  const [, likeStatus, setLikeStatus] = useEagerMutation(
    initialLikeStatus,
    (currentLikeStatus, desiredLikeStatus) =>
      yt.setVideoLikeStatus!(videoId, currentLikeStatus, desiredLikeStatus),
    // todo: error notification
    console.error,
  )

  // todo: handle provider not supporting like counts, or not supporting setting like status
  return (
    <Button.Group>
      <Button
        variant="default"
        leftSection={<LikeIcon likeStatus={likeStatus} size="xl" />}
        onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Like, likeStatus))}
      >
        {toShortHumanReadable(likeCount!)}
      </Button>
      <Button
        variant="default"
        leftSection={<DislikeIcon likeStatus={likeStatus} size="xl" />}
        onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Dislike, likeStatus))}
      >
        {toShortHumanReadable(dislikeCount!)}
      </Button>
    </Button.Group>
  )
}

export const CopyLinkButton: FC<{ provider: std.ProviderName; videoId: string }> = ({
  provider,
  videoId,
}) => {
  const playerInstance = useContext(PlayerContext)!
  const [copied, setCopied] = useState(false)
  const [copiedAt, setCopiedAt] = useState<boolean>(false)
  return (
    <Button.Group>
      <Button
        variant="default"
        leftSection={
          copied ? <IconCheck size={resolveSize('xl')} /> : <IconClipboard size={resolveSize('xl')} />
        }
        onClick={() => {
          // TODO: use provider
          navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}`)
          setCopied(true)
        }}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
      <Tooltip label="Copy link at current time" openDelay={500}>
        <Button
          variant="default"
          onClick={() => {
            // TODO: use provider
            const currentTimeSeconds = Math.floor(playerInstance.currentTimeMS.get() / 1000)
            navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}&t=${currentTimeSeconds}`)
            setCopiedAt(true)
          }}
        >
          {copiedAt && <IconCheck size={resolveSize('xl')} />}
          {!copiedAt && <IconClock size={resolveSize('xl')} />}
        </Button>
      </Tooltip>
    </Button.Group>
  )
}
