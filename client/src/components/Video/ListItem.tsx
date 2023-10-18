import {
  Flex,
  Grid,
} from 'lese';
import { NavLink } from 'react-router-dom';

import * as std from '@std';

import {
  ChannelIconWithName,
  CompactChannelLink,
} from '../Channel/Link';
import {
  TextSecondary,
  Title,
} from '../Typography';
import { VideoSubLine } from './Shared';
import { VideoThumbnail } from './Thumbnail';

export const VideoListItem: React.FC<{
  video: std.Video
}> = props => {
  const video = props.video
  return (
    <NavLink to={`/w/${video.id}`}>
      <Grid columns="calc(220px * 16 / 9) 1fr" gap="12px">
        <VideoThumbnail {...video} />

        <Flex column separation="12px">
          <Title lineClamp={2}>{video.title}</Title>
          <VideoSubLine video={video} short />

          {video.author && <ChannelIconWithName size={24} channel={video.author} />}
          <TextSecondary>{video.shortDescription}</TextSecondary>
        </Flex>
      </Grid>
    </NavLink>
  )
}

export const CompactVideoListItem: React.FC<{ video: std.Video }> = ({ video }) => {
  return (
    <NavLink to={`/w/${video.id}`}>
      <Grid columns="calc(94px * 16 / 9) 1fr" gap="8px">
        <VideoThumbnail {...video} />

        <Flex column separation="6px 2px ...0px" style={{ fontSize: '0.9em' }}>
          <Title lineClamp={2}>{video.title}</Title>
          {video.author && <CompactChannelLink channel={video.author} />}
          <VideoSubLine video={video} />
        </Flex>
      </Grid>
    </NavLink>
  )
}
