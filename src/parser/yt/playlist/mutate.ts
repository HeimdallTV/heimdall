import * as std from '@std'
import { Endpoint, fetchYt } from '../core/api'
import { makeListPlaylistVideosIterator } from './list'
import { PlaylistVideo } from './types'
import { fetchPlaylist } from './get'

enum Actions {
  SetPrivacy = 'ACTION_SET_PLAYLIST_PRIVACY',
  SetTitle = 'ACTION_SET_PLAYLIST_NAME',
  SetDescription = 'ACTION_SET_PLAYLIST_DESCRIPTION',
  AddVideo = 'ACTION_ADD_VIDEO',
  RemoveVideo = 'ACTION_REMOVE_VIDEO_BY_VIDEO_ID',
  MoveVideoAfter = 'ACTION_MOVE_VIDEO_AFTER',
}

async function sendAction(playlistId: string, action: Actions, payload: Record<string, unknown> = {}) {
  fetchYt(Endpoint.EditPlaylist, {
    actions: [{ action, ...payload }],
    playlistId,
  })
}

/// Setters
export async function setPlaylistVisibility(playlistId: string, visibility: std.Visibility): Promise<void> {
  const playlistPrivacy =
    visibility === std.Visibility.Public ? 0 : visibility === std.Visibility.Unlisted ? 1 : 2
  await sendAction(playlistId, Actions.SetPrivacy, { playlistPrivacy })
}
export async function setPlaylistTitle(playlistId: string, title: string): Promise<void> {
  await sendAction(playlistId, Actions.SetTitle, { playlistName: title })
}
export async function setPlaylistDescription(playlistId: string, description: string): Promise<void> {
  await sendAction(playlistId, Actions.SetDescription, {
    playlistDescription: description,
  })
}

/// Videos
export async function movePlaylistVideo(
  playlistId: string,
  currentPosition: number,
  newPosition: number,
): Promise<void> {
  if (currentPosition === newPosition) return
  if (currentPosition < 0 || newPosition < 0) throw new Error('Invalid position')

  const videos: PlaylistVideo[] = []
  for await (const videos of makeListPlaylistVideosIterator(playlistId)) {
    videos.push(...videos)
    if (videos.length >= Math.max(currentPosition, newPosition)) break
  }

  const setVideoId = videos[currentPosition].playlistVideoRenderer.setVideoId
  if (newPosition === 0) {
    return sendAction(playlistId, Actions.MoveVideoAfter, { setVideoId })
  }
  const offset = newPosition > currentPosition ? 1 : 0
  const movedSetVideoIdPredecessor = videos[newPosition - offset].playlistVideoRenderer.setVideoId
  return sendAction(playlistId, Actions.MoveVideoAfter, {
    setVideoId,
    movedSetVideoIdPredecessor,
  })
}
export async function addPlaylistVideo(playlistId: string, videoId: string) {
  await sendAction(playlistId, Actions.AddVideo, { addedVideoId: videoId })
}
export async function removePlaylistVideo(playlistId: string, videoId: string) {
  await sendAction(playlistId, Actions.RemoveVideo, {
    removedVideoId: videoId,
  })
}

/// Playlists
export async function createPlaylist(title: string, visibility: std.Visibility): Promise<string> {
  return fetchYt<{ playlistId: string }>(Endpoint.CreatePlaylist, {
    privacyStatus: visibility.toUpperCase(),
    title,
    videoIds: [],
  }).then((res) => res.playlistId)
}
export async function deletePlaylist(playlistId: string): Promise<void> {
  await fetchYt(Endpoint.DeletePlaylist, { playlistId })
}

export async function savePlaylist(playlistId: string) {
  const playlist = await fetchPlaylist(playlistId)
  const params =
    playlist.playlistHeader.playlistHeaderRenderer.saveButton?.toggleButtonRenderer.defaultServiceEndpoint
      .likeEndpoint.likeParams
  if (!params) throw new Error('Could not find likeParams in playlist header. Is this your own playlist?')
  await fetchYt(Endpoint.Like, { target: { playlistId }, params })
}
export async function unsavePlaylist(playlistId: string) {
  const playlist = await fetchPlaylist(playlistId)
  const params =
    playlist.playlistHeader.playlistHeaderRenderer.saveButton?.toggleButtonRenderer.toggledServiceEndpoint
      .likeEndpoint.removeLikeParams
  if (!params) {
    throw new Error('Could not find removeLikeParams in playlist header. Is this your own playlist?')
  }
  await fetchYt(Endpoint.Like, { target: { playlistId }, params })
}
