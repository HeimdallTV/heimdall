import React from 'react';

import { Flex } from 'lese';
import Link from 'next/link';

import * as std from '@std';

import { ChannelIcon } from '../Channel/Link';
import {
  ExternalLink,
  Title,
} from '../Typography';
import { VideoSubLine } from './Shared';
import { VideoThumbnail } from './Thumbnail';

export const VideoCard: React.FC<{ video: std.Video }> = ({ video }) => (
  <Link href={`/w/${video.id}`}>
    <Flex xAlign="stretch" column separation="12px">
      <VideoThumbnail {...video} />

      {video.author && (
        <Flex separation="12px">
          <ChannelIcon channel={video.author} />
          <Flex column separation="6px 4px">
            <Title lineClamp={2}>{video.title}</Title>
            <Link href={`/c/${video.author?.id}`}>
              <ExternalLink secondary>{video.author?.name}</ExternalLink>
            </Link>

            <VideoSubLine video={video} />
          </Flex>
        </Flex>
      )}
    </Flex>
  </Link>
)
