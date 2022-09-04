import React from 'react'
import { ExternalLink, Title } from '../Typography'
import { VideoThumbnail } from './Thumbnail'
import { ChannelIcon } from '../Channel/Link'
import { NavLink } from 'react-router-dom'
import { Flex } from 'lese'
import * as std from '@std'
import { VideoSubLine } from './Shared'

export const VideoCard: React.FC<{ video: std.Video }> = ({ video }) => (
  <NavLink to={`/w/${video.id}`}>
    <Flex xAlign="stretch" column separation="12px">
      <VideoThumbnail {...video} />

      {video.author && (
        <Flex separation="12px">
          <ChannelIcon channel={video.author} />
          <Flex column separation="6px 4px">
            <Title lineClamp={2}>{video.title}</Title>
            <NavLink to={`/c/${video.author?.id}`}>
              <ExternalLink secondary>{video.author?.name}</ExternalLink>
            </NavLink>

            <VideoSubLine video={video} />
          </Flex>
        </Flex>
      )}
    </Flex>
  </NavLink>
)
