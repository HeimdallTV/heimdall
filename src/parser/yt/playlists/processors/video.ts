import * as std from "@std";
import { PlaylistVideo } from "../types";
import { combineSomeText } from "../../components/text";
import { parseDate } from "../../video/processors/helpers";
import { fromShortHumanReadable } from "../../core/helpers";

export function processPlaylistVideo({
	playlistVideoRenderer: video,
}: PlaylistVideo): std.Video {
	return {
		provider: std.ProviderName.YT,
		type: std.VideoType.Static,
		id: video.videoId,
		author: {
			id: video.shortBylineText.runs[0].navigationEndpoint.browseEndpoint
				.browseId,
			name: combineSomeText(video.shortBylineText),
		},

		title: combineSomeText(video.title),
		staticThumbnail: video.thumbnail.thumbnails,

		viewCount: fromShortHumanReadable(video.videoInfo.runs[0].text),
		length: Number(video.lengthSeconds),
		publishDate: parseDate(video.videoInfo.runs[2].text),
	};
}
