import React from 'react';

import {
  formatDateAgo,
  formatNumberShort,
} from '@libs/format';
import * as std from '@std';

import { TextSecondary } from '../Typography';
import { LiveNow } from './Badge';

export const VideoSubLine: React.FC<{
  video: Pick<std.Video, 'type' | 'viewCount' | 'publishDate'>
  short?: boolean
}> = ({ video, short }) =>
  video.type === std.VideoType.Live ? (
    <>
      <TextSecondary>{formatNumberShort(video.viewCount!)} watching</TextSecondary>
      <LiveNow>LIVE NOW</LiveNow>
    </>
  ) : (
    <TextSecondary>
      {formatNumberShort(video.viewCount!)}
      {short ? '' : ' views'}
      {video.publishDate ? ` • ${formatDateAgo(video.publishDate!)}` : ''}
    </TextSecondary>
  )
