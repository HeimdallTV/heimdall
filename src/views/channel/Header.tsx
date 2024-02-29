import * as std from '@std'
import yt from '@yt'
import { Avatar, Text, Title } from '@mantine/core'
import { Column, Row } from 'lese'
import { FollowButton } from '@/components/button'
import { useAsync } from '@/hooks/useAsync'
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandPatreon,
  IconBrandReddit,
  IconBrandSoundcloud,
  IconBrandSpotify,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandYoutube,
  IconLink,
} from '@tabler/icons-react'
import { formatNumberShort } from '@/libs/format'

// todo: channel links
export function ChannelHeader({ channel }: { channel: std.Channel }) {
  const src = channel.user.avatar?.sort((a, b) => b.height - a.height)[0]?.url
  return (
    <Row className="channel-max-width" separation="16px">
      <Avatar src={src} size={192} />
      <Column separation="4px ...12px" xAlign="flex-start">
        <Title>{channel.user.name}</Title>
        <ChannelHeaderByline user={channel.user} />
        {channel.shortDescription && <Text>{channel.shortDescription}</Text>}
        <FollowButton userId={channel.user.id} followed={Boolean(channel.user.followed)} />
      </Column>
    </Row>
  )
}

function ChannelHeaderByline({ user }: { user: std.User }) {
  const components = [`@${user.name}`]
  if (user.followerCount !== undefined) {
    components.push(`${formatNumberShort(user.followerCount)} followers`)
  }
  if (user.viewCount !== undefined) {
    components.push(`${formatNumberShort(user.viewCount)} views`)
  }
  return (
    <Text component="p" c="dimmed">
      {components.join(' • ')}
    </Text>
  )
}

// todo: figure out how to incorporate this
type Icon = { domains: string[]; icon: React.FC }
const icons: Icon[] = [
  { domains: ['youtube.com'], icon: IconBrandYoutube },
  { domains: ['twitch.tv'], icon: IconBrandTwitch },
  { domains: ['twitter.com', 'x.com'], icon: IconBrandTwitter },
  { domains: ['discord.com', 'discord.gg'], icon: IconBrandDiscord },
  { domains: ['patreon.com'], icon: IconBrandPatreon },
  { domains: ['tiktok.com'], icon: IconBrandTiktok },
  { domains: ['facebook.com'], icon: IconBrandFacebook },
  { domains: ['instagram.com'], icon: IconBrandInstagram },
  { domains: ['reddit.com'], icon: IconBrandReddit },
  { domains: ['soundcloud.com'], icon: IconBrandSoundcloud },
  { domains: ['spotify.com'], icon: IconBrandSpotify },
  { domains: ['github.com'], icon: IconBrandGithub },
]
function ChannelLinks({ channelId }: { channelId: string }) {
  const links = useAsync(() => yt.listChannelLinks!(channelId), [channelId])
  console.log(links)
  if (!links.data) return null
  return (
    <Column separation="6px" xAlign="flex-end">
      {links.data.map((link) => {
        // incorrect for TLDs that have >= 2 parts but we don't have any atm
        const domain = new URL(link).hostname.split('.').slice(-2).join('.')
        const Icon = icons.find(({ domains }) => domains.includes(domain))?.icon ?? IconLink
        return (
          <Row as="a" href={link} target="_blank" rel="noopener noreferrer" yAlign separation="4px">
            <Text>{link.slice('https://'.length)}</Text>
            <Icon size={24} />
          </Row>
        )
      })}
    </Column>
  )
}
