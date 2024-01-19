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
import { useCallback, useContext, useState } from 'react'
import { PlayerContext } from './player/context'
import yt from '@yt'
import { DislikeIcon, LikeIcon } from '@/components/Badges'

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
      <FollowButton
        followed={author.followed}
        setFollowed={() => {
          throw Error('not implemented')
        }}
      />
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
  videoId: string
  likeStatus: std.LikeStatus
  likeCount?: number
  dislikeCount?: number
}> = ({ videoId, likeStatus: initialLikeStatus, likeCount, dislikeCount }) => {
  const [currentLikeStatus, setCurrentLikeStatus] = useState(initialLikeStatus)
  // fixme: should use a queue for the user actions and run this serially on the latest user action
  const setLikeStatus = useCallback(
    async (desiredLikeStatus: std.LikeStatus) => {
      if (currentLikeStatus === desiredLikeStatus) return
      setCurrentLikeStatus(desiredLikeStatus)
      await yt.setVideoLikeStatus!(videoId, currentLikeStatus, desiredLikeStatus).catch(err => {
        // todo: error handling
        setCurrentLikeStatus(currentLikeStatus)
        throw err
      })
    },
    [currentLikeStatus],
  )

  // todo: handle provider not supporting like counts, or not supporting setting like status
  return (
    <Button.Group>
      <Button
        variant="default"
        leftSection={<LikeIcon likeStatus={currentLikeStatus} size="xl" />}
        onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Like, currentLikeStatus))}
      >
        {toShortHumanReadable(likeCount!)}
      </Button>
      <Button
        variant="default"
        leftSection={<DislikeIcon likeStatus={currentLikeStatus} size="xl" />}
        onClick={() => setLikeStatus(std.toggleLikeStatus(std.LikeStatus.Dislike, currentLikeStatus))}
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
        leftSection={copied ? <IconCheck fontSize="large" /> : <IconClipboard fontSize="large" />}
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
            const currentTimeSeconds = Math.floor(playerInstance.getCurrentTimeMS() / 1000)
            navigator.clipboard.writeText(`https://youtube.com/watch?v=${videoId}&t=${currentTimeSeconds}`)
            setCopiedAt(true)
          }}
        >
          {copiedAt && <IconCheck fontSize="large" />}
          {!copiedAt && <IconClock fontSize="large" />}
        </Button>
      </Tooltip>
    </Button.Group>
  )
}
