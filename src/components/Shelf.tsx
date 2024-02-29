import * as std from '@std'
import { useEffect, useState } from 'react'
import { Column } from 'lese'
import { Button, Divider, Text } from '@mantine/core'
import { VideoGrid } from './Video/Grid'
import { ChannelGrid } from './Channel/Grid'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { Link } from 'wouter'
import { useResizeObserver } from '@mantine/hooks'
import styled from 'styled-components'
import { PlaylistGrid } from './Playlist/Grid'

// todo: detect when all items are shown and dont show the divider
type ShelfProps = Pick<std.Shelf, 'name' | 'shortDescription' | 'href'> & {
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
  children: (ref: React.RefObject<HTMLElement>) => React.ReactNode
}
export const Shelf: FC<ShelfProps> = ({
  name,
  shortDescription,
  href,
  expanded,
  onExpandedChange,
  children,
}) => {
  const [requiresExpansion, setRequiresExpansion] = useState(false)
  const [expandableRef, size] = useResizeObserver()
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (expandableRef.current) {
      const elem = expandableRef.current
      if (elem) {
        setRequiresExpansion(elem.scrollHeight > elem.clientHeight)
      }
    }
  }, [expandableRef, size])

  return (
    <Column>
      <Column separation="2px" style={{ marginBottom: '16px' }}>
        <Text component={href ? Link : 'h2'} href={href} size="xl" fw="bold">
          {name}
        </Text>
        {shortDescription && (
          <Text component="h3" c="dimmed" fw={500}>
            {shortDescription}
          </Text>
        )}
      </Column>
      {children(expandableRef)}
      <ShowMoreDivider
        requiresExpansion={requiresExpansion || expanded}
        expanded={expanded}
        onClick={() => onExpandedChange(!expanded)}
      />
    </Column>
  )
}

const FixedSizeDivider = styled.span`
  margin: 18px 0;
  background: var(--mantine-color-dark-4);
  height: 1px;
`
const ShowMoreDivider = ({
  requiresExpansion,
  expanded,
  onClick,
}: {
  requiresExpansion: boolean
  expanded: boolean
  onClick: () => void
}) => {
  if (!requiresExpansion) return <FixedSizeDivider />
  const text = expanded ? 'Show less' : 'Show more'
  const Icon = expanded ? IconChevronUp : IconChevronDown
  return (
    <Divider
      label={
        <Button variant="transparent" onClick={onClick}>
          {text} <Icon size={24} style={{ marginLeft: '4px' }} />
        </Button>
      }
    />
  )
}

// todo: Videos, Channels and Playlists are copy pasted
type VideoShelfProps = Omit<ShelfProps, 'expanded' | 'onExpandedChange' | 'children'> & {
  size: 'sm' | 'md'
  videos: std.Video[]
}
export const VideoShelf: FC<VideoShelfProps> = ({ size, videos, ...props }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <Shelf {...props} expanded={expanded} onExpandedChange={setExpanded}>
      {(ref) => <VideoGrid ref={ref} size={size} collapsed={!expanded} videos={videos} />}
    </Shelf>
  )
}

type ChannelShelfProps = Omit<ShelfProps, 'expanded' | 'onExpandedChange' | 'children'> & {
  size: 'sm' | 'md'
  channels: std.Channel[]
}
export const ChannelShelf: FC<ChannelShelfProps> = ({ size, channels, ...props }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <Shelf {...props} expanded={expanded} onExpandedChange={setExpanded}>
      {(ref) => <ChannelGrid ref={ref} size={size} collapsed={!expanded} channels={channels} />}
    </Shelf>
  )
}

type PlaylistShelfProps = Omit<ShelfProps, 'expanded' | 'onExpandedChange' | 'children'> & {
  size: 'sm' | 'md'
  playlists: std.Playlist[]
}
export const PlaylistShelf: FC<PlaylistShelfProps> = ({ size, playlists, ...props }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <Shelf {...props} expanded={expanded} onExpandedChange={setExpanded}>
      {(ref) => <PlaylistGrid ref={ref} size={size} collapsed={!expanded} playlists={playlists} />}
    </Shelf>
  )
}
