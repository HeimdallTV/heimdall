import {
	AppendContinuationItemsResponse,
	getContinuationResponseItems,
} from "../components/continuation";
import {
	Endpoint,
	fetchEndpointContinuation,
	makeContinuationIterator,
} from "../core/api";
import { fetchPlaylist } from "./get";
import { processPlaylistVideo } from "./processors/video";
import { PlaylistVideo } from "./types";

export async function listUserPlaylists() {
	// todo: should use the getChannelPlaylists
	// todo: should always return watch later
	throw new Error("Not implemented");
}

type PlaylistVideosContinuationResponse =
	AppendContinuationItemsResponse<PlaylistVideo>;
const fetchPlaylistVideosContinuation = fetchEndpointContinuation(
	Endpoint.Browse,
)<PlaylistVideosContinuationResponse>;

export function makeListPlaylistVideosIterator(id: string) {
	return makeContinuationIterator(
		() =>
			fetchPlaylist(id).then(
				(_) => _.playlistVideoList.playlistVideoListRenderer.contents,
			),
		(token) =>
			fetchPlaylistVideosContinuation(token).then(getContinuationResponseItems),
	);
}

export async function* listPlaylistVideos(id: string) {
	for await (const videos of makeListPlaylistVideosIterator(id)) {
		yield videos.map(processPlaylistVideo);
	}
}
