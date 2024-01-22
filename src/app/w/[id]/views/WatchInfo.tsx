import { useContext } from 'react'
import styled from 'styled-components'
import { Column, Row } from 'lese'
import { Skeleton, Text } from '@mantine/core'

import * as std from '@/parser/std'
import { Video } from '@/parser/std'
import { toShortHumanReadable } from '@/parser/yt/core/helpers'

import { ChannelIcon, ChannelName } from '@/components/Channel/Link'
import { LikeButtons, FollowButton } from '@/components/button'
import { Description } from './Description'
import { RelatedVideos } from './RelatedVideos'
import { Comments } from './Comments'
import { PlayerContext } from './player/context'
import { CopyLinkButton } from '@/components/button/CopyLinkButton'
import { usePageLeave } from '@mantine/hooks'
import { usePaginated } from '@/hooks/usePaginated'

// todo: better way to move related videos inline?
const WatchGrid = styled.section`
  max-width: 1400px;
  width: 100%;
  margin: auto;
  padding: 0 24px;

  display: grid;
  grid-template-columns: 1fr 400px;
  grid-template-rows: repeat(2, auto);
  grid-gap: 24px;

  > *:nth-child(2) {
    grid-row: 1 / 3;
    grid-column: 2;
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, auto);

    > *:nth-child(2) {
      grid-row: 2;
      grid-column: 1;
    }
  }
`

export const WatchInfo: React.FC<{ video?: Video }> = ({ video }) => {
  const relatedVideos = usePaginated(video?.related)
  return (
    <WatchGrid>
      <VideoInfo video={video} />
      {video && <RelatedVideos relatedVideos={relatedVideos.data} loading={relatedVideos.loading} />}
      {video?.id && <Comments videoId={video.id} />}
    </WatchGrid>
  )
}

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
    </Row>
  )
}

export const VideoInfo: React.FC<{ video?: Video }> = ({ video }) => (
  <Column separation="12px 24px" style={{ containerType: 'inline-size' }}>
    <VideoTitle title={video?.title} />
    <Row separation="24px" xAlign="space-between" yAlign>
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

const VideoInteractions: React.FC<{ video?: Video }> = ({ video }) => {
  const player = useContext(PlayerContext)
  if (!video) return <Skeleton width="250px" height="36px" />
  return (
    <Row
      separation="8px"
      yAlign
      xAlign="space-between"
      style={{ containerType: 'inline-size', flexGrow: '1' }}
    >
      <FollowButton followed={Boolean(video.author!.followed)} userId={video.author!.id} />
      <Row separation="8px" yAlign>
        <LikeButtons
          videoId={video.id}
          likeCount={video.likeCount}
          dislikeCount={video.dislikeCount}
          likeStatus={video.likeStatus!}
        />
        <CopyLinkButton
          videoId={video.id}
          provider={video.provider}
          getCurrentTimeMS={player?.currentTimeMS.get!}
        />
      </Row>
    </Row>
  )
}

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
