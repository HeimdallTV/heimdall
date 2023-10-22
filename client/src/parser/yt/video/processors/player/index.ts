import { ProviderName } from '@/parser/std';
import * as std from '@std';
import { PlayerResponse } from '@yt/video/types/responses/player';

import {
  PlayerAdaptiveFormat,
  PlayerAudioFormat,
  PlayerFormat,
  PlayerVideoFormat,
} from '../../types/streaming-data';
import { processCaptions } from './captions';
import { decodeVideoPlaybackUrl } from './decoder';

export async function processPlayer({
  videoDetails,
  playerConfig,
  streamingData,
  captions,
}: PlayerResponse): Promise<std.Player> {
  console.log(videoDetails)
  return {
    provider: ProviderName.YT,
    type: videoDetails.isLiveContent ? std.VideoType.Live : std.VideoType.Static,
    id: videoDetails.videoId,
    title: videoDetails.title,
    staticThumbnail: videoDetails.thumbnail.thumbnails,
    sources: await Promise.all([
      ...streamingData.formats.map(processFormat).map(decodeFormatUrl),
      ...streamingData.adaptiveFormats.map(processAdaptiveFormat).map(decodeFormatUrl),
    ]),
    closedCaptions: processCaptions(captions),
    viewedLength: playerConfig.playbackStartConfig?.startSeconds ?? 0,
    length: Number(videoDetails.lengthSeconds),
  }
}

export const processFormat = (format: PlayerFormat): std.Source<std.SourceType.AudioVideo> => ({
  type: std.SourceType.AudioVideo,
  frameRate: format.fps,
  width: format.width,
  height: format.height,
  url: format.url,
  mimetype: format.mimeType,
})

export const processAdaptiveFormat = (format: PlayerAdaptiveFormat): std.Source =>
  'audioQuality' in format ? processAdaptiveAudioFormat(format) : processAdaptiveVideoFormat(format)

export const processAdaptiveVideoFormat = (
  format: PlayerAdaptiveFormat & PlayerVideoFormat,
): std.Source<std.SourceType.Video> => ({
  type: std.SourceType.Video,
  frameRate: format.fps,
  width: format.width,
  height: format.height,
  url: format.url,
  mimetype: format.mimeType,
  videoBitrate: format.bitrate,
})

export const processAdaptiveAudioFormat = (
  format: PlayerAdaptiveFormat & PlayerAudioFormat,
): std.Source<std.SourceType.Audio> => ({
  type: std.SourceType.Audio,
  url: format.url,
  mimetype: format.mimeType,
  audioBitrate: format.bitrate,
})

export const decodeFormatUrl = async <Type extends std.SourceType = std.SourceType>(
  source: std.Source<Type>,
): Promise<std.Source<Type>> =>
  decodeVideoPlaybackUrl(new URL(source.url)).then(url => ({ ...source, url: url.toString() }))
