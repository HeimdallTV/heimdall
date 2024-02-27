import { ContinuationItem } from "../components/continuation";
import { Menu } from "../components/menu";
import { ManyText, Text } from "../components/text";
import { Thumbnail, ThumbnailOverlays } from "../components/thumbnail";
import { BrowseEndpoint } from "../components/utility/endpoint";
import { Navigation, NavigationSome } from "../components/utility/navigation";
import { CommandMetadata, Renderer, Runs, Some } from "../core/internals";

export type PlaylistVideo = Renderer<
	"playlistVideo",
	{
		/** Index starts at "1" */
		index: Some<Text>;
		videoId: string;
		/** Id of this instance of the video in this playlist. Used for referencing the video when doing i.e. reordering */
		setVideoId: string;
		title: Some<Text>;
		/** Typically the author of the video */
		shortBylineText: Runs<Navigation & ManyText>;
		thumbnail: Thumbnail;
		thumbnailOverlays: ThumbnailOverlays;
		/** Length in number format such as "515" */
		lengthSeconds: string;
		/** Length in the format "X:XX" */
		lengthText: Some<Text>;
		/** Typically runs in the format: ["Xk views", " • ", "Y months ago"] */
		videoInfo: Runs<ManyText>;
		menu: Menu<Renderer<"TODO">>;
	}
>;

export type PlaylistVideoList = Renderer<
	"playlistVideoList",
	{
		playlistId: string;
		isEditable: boolean;
		canReorder: boolean;
		contents: (PlaylistVideo | ContinuationItem)[];
		/** Skipping this since it doesn't provide any needed info to do re-ordering */
		onReorderEndpoint: Renderer<"TODO">;
		/** Provides sorting options, skipping for now */
		sortFilterMenu: Renderer<"TODO">;
	}
>;

type HeroPlaylistThumbnail = Renderer<
	"heroPlaylistThumbnail",
	{
		thumbnail: Thumbnail;
		thumbnailOverlays: ThumbnailOverlays;
		/** Image aspect ratio as height / width */
		maxRatio: number;
		/** Points to playing the first video in the playlist */
		onTap: Renderer<"TODO">;
	}
>;

/** Missing plenty of fields that were deemed unneeded */
export type PlaylistHeader = Renderer<
	"playlistHeader",
	{
		playlistId: string;
		title: Some<Text>;
		descriptionText: Some<Text>;
		privacy: "PUBLIC" | "UNLISTED" | "PRIVATE";
		isEditable: boolean;
		playlistHeaderBanner: HeroPlaylistThumbnail;
		numVidesText: Some<Text>;

		ownerText: Some<Text>;
		ownerEndpoint: BrowseEndpoint & CommandMetadata;
	}
>;
