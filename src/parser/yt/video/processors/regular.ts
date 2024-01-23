import * as std from '@std'
import { getVideoType } from '..'
import { isVerifiedBadge, MetadataBadge } from '../../components/badge'
import { combineSomeText, Text } from '../../components/text'
import {
	ChannelThumbnailWithLink,
	MovingThumbnail,
	Thumbnail,
	ThumbnailOverlayNowPlaying,
	ThumbnailOverlayResumePlayback,
	ThumbnailOverlayTimeStatus,
} from '../../components/thumbnail'
import { Renderer, Some } from '../../core/internals'
import { parseViewCount } from '../../core/helpers'
import { Accessibility } from '../../components/utility/accessibility'
import { getBrowseNavigationId, Navigation, NavigationSome } from '../../components/utility/navigation'
import { ProviderName } from '@std'
import { getLength, getViewedLength, relativeToAbsoluteDate } from './helpers'
import { BrowseEndpoint, WatchEndpoint } from '@yt/components/utility/endpoint'

/**
 * Currently cannot parse/doesn't handle live streams and upcoming events
 */
export function processVideo({ videoRenderer: video }: Video): std.Video {
	return {
		provider: ProviderName.YT,

		type: getVideoType(video),
		id: video.videoId,

		title: combineSomeText(video.title),
		shortDescription: video.descriptionSnippet && combineSomeText(video.descriptionSnippet),
		viewCount: parseViewCount(combineSomeText(video.viewCountText)),

		author: {
			name: combineSomeText(video.ownerText),
			id: getBrowseNavigationId(video.ownerText),
			avatar: video.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails,
			verified: std.verifiedFrom(video.ownerBadges?.some(isVerifiedBadge)),
		},

		staticThumbnail: video.thumbnail.thumbnails,
		animatedThumbnail: video.richThumbnail?.movingThumbnailRenderer.movingThumbnailDetails?.thumbnails,

		length: getLength(video.lengthText),
		viewedLength: getViewedLength(video.thumbnailOverlays, getLength(video.lengthText)),

		publishDate: video.publishedTimeText && relativeToAbsoluteDate(combineSomeText(video.publishedTimeText)),
	}
}

export type BaseVideo = Navigation<WatchEndpoint> & {
	/** Badges that show on the thumbnail. Used to detect live streams */
	badges?: MetadataBadge[]

	/** Thumbnails for channel */
	channelThumbnailSupportedRenderers: ChannelThumbnailWithLink

	/** Short version of description with ellipses. Not provided when description is not defined */
	descriptionSnippet?: Some<Text>

	/** Length of video info */
	lengthText: Some<Accessibility<Text>>

	/** Appears to be duplicate of ownerText which has the same info? */
	longBylineText: Some<NavigationSome<BrowseEndpoint, Text>>
	/** Appears to be duplicate of ownerText which has the same info? */
	shortBylineText: Some<NavigationSome<BrowseEndpoint, Text>>

	/** Excluded because I don't need it */
	menu: Record<never, never>

	/** Verified and other badges */
	ownerBadges?: MetadataBadge[]

	/** Channel info */
	ownerText: Some<NavigationSome<BrowseEndpoint, Text>>

	/** How long ago the video was published. Ex. 3 days ago */
	publishedTimeText: Some<Text>

	/** Info for animated thumbnail on hover */
	richThumbnail: MovingThumbnail

	/** A more condensed version of view count. Ex. 354k views */
	shortViewCountText: Some<Accessibility<Text>>

	/** Human readable view count. Ex. 354,434 views */
	viewCountText: Some<Text>

	showActionMenu: boolean
	thumbnail: Thumbnail

	/** Renderers that are overlayed on top of the thumbnail such as watch later and length */
	thumbnailOverlays: (
		| ThumbnailOverlayNowPlaying
		| ThumbnailOverlayResumePlayback
		| ThumbnailOverlayTimeStatus
	)[]

	title: Some<Accessibility<Text>>

	trackingParams: string
	videoId: string
}

export type Video = Renderer<'video', BaseVideo>
