// todo: overall quite scuffed because of the weird styling required to
// do the tabs with max-width and background

import { useAsync } from '@/hooks/useAsync'
import { Tabs } from '@mantine/core'
import yt from '@yt'
import { useEffect } from 'react'
import { ChannelHeader } from './Header'
import styled from 'styled-components'

import HomeTab from './tabs/Home'
import VideosTab from './tabs/Videos'
import PlaylistsTab from './tabs/Playlists'

const ChannelContainer = styled.main`
  max-height: 100vh;
  overflow: auto;
  margin-top: 24px;

  & .mantine-Tabs-tab[data-active='true'] {
    background: var(--mantine-color-dark-filled);
    border-bottom-color: var(--mantine-color-dark-filled);
  }

  & .channel-max-width {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  > * + * {
    margin-top: 24px;
  }
`

const TabListContainer = styled.div`
  border-bottom: 1px solid var(--mantine-color-dark-4);

  > * {
    margin-bottom: -1px;
  }
`

export default function Channel({ params: { channelId } }: { params: { channelId: string } }) {
  const channel = useAsync(() => yt.getChannel(channelId), [channelId])
  useEffect(() => {
    if (channel.error) {
      console.error(channel.error)
    }
  }, [channel.error])

  if (!channel.data) return null
  return (
    <ChannelContainer>
      <ChannelHeader channel={channel.data} />
      <Tabs
        keepMounted={false}
        defaultValue="home"
        variant="outline"
        styles={{
          root: { height: '100%' },
          panel: {
            minHeight: '100%',
            padding: '24px',
            background: 'var(--mantine-color-dark-filled)',
          },
          list: { marginBottom: '-1px' },
          tabLabel: { fontSize: '1.2em', fontWeight: '500' },
        }}
      >
        <TabListContainer>
          <Tabs.List className="channel-max-width">
            <Tabs.Tab value="home">Home</Tabs.Tab>
            <Tabs.Tab value="videos">Videos</Tabs.Tab>
            <Tabs.Tab value="playlists">Playlists</Tabs.Tab>
            <Tabs.Tab value="about">About</Tabs.Tab>
          </Tabs.List>
        </TabListContainer>

        <Tabs.Panel value="home">
          <HomeTab channelId={channelId} />
        </Tabs.Panel>
        <Tabs.Panel value="videos">
          <VideosTab channelId={channelId} />
        </Tabs.Panel>
        <Tabs.Panel value="playlists">
          <PlaylistsTab channelId={channelId} />
        </Tabs.Panel>
      </Tabs>
    </ChannelContainer>
  )
}
