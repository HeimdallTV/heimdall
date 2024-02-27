import * as std from "@std";
import { PlaylistHeader, PlaylistVideoList } from "../types";
import { combineSomeText } from "../../components/text";
import { extractNumber } from "../../core/helpers";

const privacyToVisibility = (
	privacy: "PUBLIC" | "UNLISTED" | "PRIVATE",
): std.Visibility => {
	switch (privacy) {
		case "PUBLIC":
			return std.Visibility.Public;
		case "UNLISTED":
			return std.Visibility.Unlisted;
		case "PRIVATE":
			return std.Visibility.Private;
	}
};

export function processPlaylistMetadata(
	{ playlistVideoListRenderer: playlist }: PlaylistVideoList,
	{ playlistHeaderRenderer: header }: PlaylistHeader,
): std.Playlist {
	return {
		provider: std.ProviderName.YT,
		id: playlist.playlistId,
		author: {
			id: header.ownerEndpoint.browseEndpoint.browseId,
			name: combineSomeText(header.ownerText),
		},
		title: combineSomeText(header.title),
		description: [
			{
				type: std.RichTextChunkType.Text,
				content: combineSomeText(header.descriptionText),
			},
		],
		thumbnail:
			header.playlistHeaderBanner.heroPlaylistThumbnailRenderer.thumbnail
				.thumbnails,
		videoCount: extractNumber(combineSomeText(header.numVidesText)),
		visibility: privacyToVisibility(header.privacy),
		isEditable: header.isEditable,
		canReorder: playlist.canReorder,
	};
}
