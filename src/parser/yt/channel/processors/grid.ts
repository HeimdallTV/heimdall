import * as std from '@std'
import { GridChannel } from '../types'
import { combineSomeText } from '../../components/text'
import { isVerifiedBadge } from '../../components/badge'
import { fromShortHumanReadable } from '../../core/helpers'

export const processGridChannel = ({ gridChannelRenderer: channel }: GridChannel): std.Channel => {
	return {
		provider: std.ProviderName.YT,
		id: channel.channelId,
		user: {
			id: channel.channelId,
			name: combineSomeText(channel.title),
			avatar: channel.thumbnail.thumbnails,
			verified: std.verifiedFrom(channel.ownerBadges?.some(isVerifiedBadge)),
			followerCount: fromShortHumanReadable(combineSomeText(channel.subscriberCountText)),
		},
	}
}
