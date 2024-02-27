import { Image } from "./components/image";
import { RichText } from "./components/rich-text";
import { User, ProviderName, Video, Visibility } from ".";

export type Playlist = {
	provider: ProviderName;
	id: string;
	visibility: Visibility;
	title: string;
	/** Example: https://www.youtube.com/channel/UC-9b7aDP6ZN0coj9-xFnrtw */
	shortDescription?: string;
	description?: RichText;
	thumbnail: Image[];
	author?: User;
	isEditable: boolean;
	canReorder: boolean;
	videoCount?: number;
};
