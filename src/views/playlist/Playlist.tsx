import { Author } from '@/components/Author'
import { RichText } from '@/components/RichText'
import { VideoGrid } from '@/components/Video/Grid'
import { useAsync } from '@/hooks/useAsync'
import { usePaginated } from '@/hooks/usePaginated'
import { ActionIcon, Divider, Text, Title } from '@mantine/core'
import { IconArrowsShuffle, IconHeart, IconHeartFilled, IconPlayerPlayFilled } from '@tabler/icons-react'
import yt from '@yt'
import { Column, Row } from 'lese'
import { useCallback, useEffect } from 'react'
import styled from 'styled-components'

const RoundThumbnail = styled.img`
  border-radius: var(--mantine-radius-lg);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  width: 100%;
  height: 180px;
`

export default function Playlist({ params: { playlistId } }: { params: { playlistId: string } }) {
  const playlist = useAsync(() => yt.getPlaylist!(playlistId), [playlistId])
  const videoPages = usePaginated(useCallback(() => yt.listPlaylistVideos!(playlistId), [playlistId]))
  useEffect(() => {
    if (playlist.error) {
      console.error(playlist.error)
    }
  }, [playlist.error])
  // useEffect(() => {
  //   if (!videoPages.done && videoPages.errors.length === 0) videoPages.next()
  // }, [playlistId])

  if (!playlist.data) return null
  return (
    <Column separation="24px" padding="24px">
      <Row separation="16px" yAlign>
        <div>
          <RoundThumbnail src={playlist.data.thumbnail.sort((a, b) => b.height - a.height)[0].url} />
        </div>
        <Column separation="2px 8px 16px">
          <Text tt="capitalize" size="sm" fw={500}>
            {playlist.data.visibility} Playlist
          </Text>
          <Title>{playlist.data.title}</Title>
          {(playlist.data.description?.length ?? 0) > 0 && <RichText chunks={playlist.data.description} />}
          <Text>Made by {playlist.data.author && <Author color="text" author={playlist.data.author} />}</Text>
          <Row separation="4px">
            <ActionIcon size="xl">
              <IconPlayerPlayFilled />
            </ActionIcon>
            <ActionIcon size="xl" variant="transparent">
              <IconArrowsShuffle />
            </ActionIcon>
            {playlist.data.canSave && (
              <ActionIcon size="xl" variant="transparent">
                {playlist.data.saved ? <IconHeartFilled /> : <IconHeart />}
              </ActionIcon>
            )}
          </Row>
        </Column>
      </Row>
      <Divider />
      <VideoGrid videos={videoPages.data.flat()} getNext={videoPages.next} />
    </Column>
  )
}
