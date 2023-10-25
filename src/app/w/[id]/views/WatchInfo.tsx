import { Grid, Column, Row } from 'lese'
import { Button, Text } from '@mantine/core'
import { ChannelIcon, ChannelName } from '@/components/Channel/Link'
import { toShortHumanReadable } from '@/parser/yt/core/helpers'
import {
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

export const WatchInfo: React.FC<{ video: Video }> = ({ video }) => (
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
    <Column xAlign="space-between" separation="12px 24px">
      <Text fs="1.4em" lh="1.4em" fw="medium">
        {video.title}
      </Text>
      <Row xAlign="space-between" yAlign>
        <Row separation="16px 32px" yAlign>
          <ChannelIcon size={40} channel={video.author!} />
          <Column separation="4px">
            <ChannelName author={video.author!} />
            <Text c="dimmed" fontSize="0.9em">
              {toShortHumanReadable(video.author!.followerCount!)} subscribers
            </Text>
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
                <IconThumbUpFilled fontSize="large" />
              ) : (
                <IconThumbUp fontSize="large" />
              )}
              <span>{toShortHumanReadable(video.likeCount!)}</span>
            </Button>
            <Button size="medium" tonal segmentEnd separation="6px">
              {video.likeStatus === std.LikeStatus.Dislike ? (
                <IconThumbDownFilled fontSize="large" />
              ) : (
                <IconThumbDown fontSize="large" />
              )}
              <span>{toShortHumanReadable(video.dislikeCount ?? 0)}</span>
            </Button>
          </Row>
          <Button size="medium" tonal separation="6px">
            <IconSend fontSize="large" />
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
    </Column>
    <RelatedVideos video={video} />
  </Grid>
)
