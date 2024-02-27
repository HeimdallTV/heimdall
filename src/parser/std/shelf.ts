import { GameCategory } from "./category";
import { Channel } from "./channel";
import { ProviderName } from "./core";
import { Video } from "./video";

export enum ShelfType {
	Games = "games",
	Channels = "channels",
	Videos = "videos",
	Playlists = "playlists",
}
export type Shelf<Type extends ShelfType = ShelfType> = {
	provider: ProviderName;
	name: string;
	href?: string;
	shortDescription?: string;
} & (Type extends ShelfType.Games // some shenanigans to make type inference work nicely
	? {
			type: Type;
			items: GameCategory[];
	  }
	: Type extends ShelfType.Channels
	  ? {
				type: Type;
				items: Channel[];
		  }
	  : Type extends ShelfType.Videos
		  ? {
					type: Type;
					items: Video[];
			  }
		  : Type extends ShelfType.Playlists
			  ? {
						type: Type;
						items: never;
				  }
			  : never);
