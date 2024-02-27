import { ChannelShelf, VideoShelf } from "@/components/Shelf";
import { useAsync } from "@/hooks/useAsync";
import yt from "@yt";
import * as std from "@std";
import { useEffect } from "react";

export default function HomeTab({ channelId }: { channelId: string }) {
	const shelves = useAsync(
		() => yt.listChannelShelves!(channelId),
		[channelId],
	);
	useEffect(() => {
		if (shelves.error) {
			console.error(shelves.error);
		}
	}, [shelves.error]);

	if (!shelves.data) return null;
	return (
		<div className="channel-max-width">
			{shelves.data.map((shelf, i) => {
				if (shelf.type === std.ShelfType.Videos) {
					return (
						<VideoShelf
							key={shelf.name}
							{...shelf}
							size={i === 0 ? "md" : "sm"}
							videos={shelf.items}
						/>
					);
				}
				if (shelf.type === std.ShelfType.Channels) {
					return (
						<ChannelShelf
							key={shelf.name}
							{...shelf}
							size="sm"
							channels={shelf.items}
						/>
					);
				}
				throw new Error(`Unknown shelf type: ${shelf.type}`);
			})}
		</div>
	);
}
