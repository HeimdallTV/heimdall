import yt from "@yt";
import { useContext, useEffect } from "react";
import { PlayerContext } from "./context";
import { useDurationMS, usePlayerState } from "./hooks/use";
import usePoll from "@/hooks/usePoll";
import { PlayerState } from "./hooks/usePlayerInstance";

export function Tracking() {
	const player = useContext(PlayerContext)!;
	const { state } = usePlayerState(player);
	const { durationMS } = useDurationMS(player);

	// track the view when the video starts playing
	useEffect(() => {
		if (player.state.get() !== PlayerState.Playing) {
			const unsubscribe = player.state.onChange((state) => {
				if (state !== PlayerState.Playing) return;
				yt.trackVideoView!(player.id);
				unsubscribe();
			});
			return unsubscribe;
		}
		yt.trackVideoView!(player.id);
	}, [player]);

	// track the current time every 10 seconds
	usePoll(() => {
		if (!durationMS || state === PlayerState.Paused) return Infinity;
		yt.trackVideoProgress!(player.id, player.currentTimeMS.get(), durationMS);
		return 10_000;
	}, [durationMS, state]);

	// track the current time when the video umounts with final = true
	useEffect(
		() => () => {
			const durationMS = player.durationMS.get();
			console.log("durationMS", durationMS);
			if (!durationMS) return;
			yt.trackVideoProgress!(
				player.id,
				player.currentTimeMS.get(),
				durationMS,
				true,
			);
		},
		[player],
	);

	return null;
}
