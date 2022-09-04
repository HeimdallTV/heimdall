import styled from '@emotion/styled'

import { not } from 'ramda'
import { pipe } from 'fp-ts/function'
import { matchAsync, matchSWR } from '@libs/extension'
import { Video } from '@std'

import { Column, Flex, Grid, Row } from 'lese'
import { ExternalLink, Text, TextSecondary, Title } from '@components/Typography'
import { ChannelIcon, ChannelName } from '@components/Channel/Link'
import { Button, PaperButton } from '@components/Button'
import { CompactVideoListItem } from '@components/Video/ListItem'
import useSWR from 'swr'
import { useParams } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { getVideo as fetchVideo, getPlayer as fetchPlayer } from '@yt/video'
import { toShortHumanReadable } from '@yt/core/helpers'
import { usePaginated } from 'hooks/usePaginated'
import { formatDateAgo, formatNumberShort } from '@libs/format'
import {
  SendRounded,
  ThumbDownAltRounded,
  ThumbDownOffAltRounded,
  ThumbUpAltRounded,
  ThumbUpOffAltRounded,
} from '@mui/icons-material'
import * as std from '@std'
import { useAsync } from 'hooks/useAsync'
import { Player } from './player/Player'

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

const Description: FC<{
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
      <Text medium>
        {formatNumberShort(props.viewCount)} views {formatDateAgo(props.publishDate)}
      </Text>
      <Text lineClamp={isExpanded ? Infinity : 3}>
        {props.description?.map((chunk, i) =>
          'href' in chunk ? (
            <ExternalLink key={i} href={chunk.href} onClick={e => e.stopPropagation()}>
              {chunk.content}
            </ExternalLink>
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
        <PaperButton
          onClick={e => {
            e.stopPropagation()
            setIsExpanded(not)
          }}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </PaperButton>
      )}
    </DescriptionContainer>
  )
}

const WatchInfo: FC<{ video: Video }> = ({ video }) => (
  <Grid
    columns="auto 400px"
    gap="24px"
    yAlign="start"
    style={{
      maxWidth: '1280px',
      width: '100%',
      margin: 'auto',
      padding: '24px',
      paddingTop: '12px',
    }}
  >
    <Flex column xAlign="space-between" separation="12px 24px">
      <Title fontSize="1.4em" lineHeight="1.4em" medium>
        {video.title}
      </Title>
      <Row xAlign="space-between" yAlign>
        <Row separation="16px 32px" yAlign>
          <ChannelIcon size={40} channel={video.author!} />
          <Column separation="4px">
            <ChannelName author={video.author!} />
            <TextSecondary fontSize="0.9em">
              {toShortHumanReadable(video.author!.followerCount!)} subscribers
            </TextSecondary>
          </Column>
          <Button
            size="medium"
            filled={!Boolean(video.author?.followed)}
            tonal={Boolean(video.author?.followed)}
          >
            {video.author?.followed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </Row>
        <Row separation="8px" yAlign>
          <Row>
            <Button size="medium" tonal segmentStart separation="6px">
              {video.likeStatus === std.LikeStatus.Like ? (
                <ThumbUpAltRounded fontSize="large" />
              ) : (
                <ThumbUpOffAltRounded fontSize="large" />
              )}
              <span>{toShortHumanReadable(video.likeCount!)}</span>
            </Button>
            <Button size="medium" tonal segmentEnd separation="6px">
              {video.likeStatus === std.LikeStatus.Dislike ? (
                <ThumbDownAltRounded fontSize="large" />
              ) : (
                <ThumbDownOffAltRounded fontSize="large" />
              )}
              <span>{toShortHumanReadable(video.dislikeCount ?? 0)}</span>
            </Button>
          </Row>
          <Button size="medium" tonal separation="6px">
            <SendRounded fontSize="large" />
            <span>Share</span>
          </Button>
          <Button size="medium" tonal separation="6px">
            ...
          </Button>
        </Row>
      </Row>
      <Description
        description={video.description}
        viewCount={video.viewCount!}
        publishDate={video.publishDate!}
      />
    </Flex>
    <RelatedVideos video={video} />
  </Grid>
)

const RelatedVideos: FC<{ video: Video }> = ({ video }) => {
  const [videos, errors, getNextVideos] = usePaginated(video.related!)
  useEffect(() => {
    getNextVideos()
  }, [])
  return (
    <Column separation="8px">
      {videos
        .flat()
        // TODO: Concrete way of telling its a video
        .filter((video): video is Video => 'type' in video)
        .map(video => (
          <CompactVideoListItem key={video.id} video={video} />
        ))}
    </Column>
  )
}

const VideoContainer = styled('section')`
  height: calc(100vh - 53px);

  > iframe {
    width: 100vw;
    height: min(87vh, calc(100vw / 16 * 9));
  }

  > * + * {
    margin-top: 16px;
  }
`

const PlayerWrapper: FC<{ videoId: string }> = ({ videoId }) => {
  const player = pipe(
    useAsync(() => fetchPlayer(videoId)),
    matchAsync(
      player => player,
      err => console.error(err),
      () => console.log('loading'),
    ),
  )
  return <>{player && <Player player={player} />}</>
}

const Watch: FC = () => {
  const params = useParams()
  const Video = pipe(
    useSWR(params.id, fetchVideo),
    matchSWR(
      video => <WatchInfo video={video} />,
      () => 'Failed while loading video data',
      () => 'Loading...',
    ),
  )

  return (
    <VideoContainer>
      <PlayerWrapper videoId={params.id!} />
      {Video}
    </VideoContainer>
  )
}

export default Watch
