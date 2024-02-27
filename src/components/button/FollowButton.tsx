import yt from "@yt";
import { useEagerMutation } from "@/hooks/useEagerMutation";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { CollapsibleButton } from "./CollapsibleButton";
import { useTemporary } from "@/hooks/useTemporary";
import { ButtonVariant } from "@mantine/core";

export const FollowButton: React.FC<{
	followed: boolean;
	userId: string;
	notFollowingVariant?: ButtonVariant;
	followingVariant?: ButtonVariant;
}> = ({
	followed: initialFollowed,
	userId,
	notFollowingVariant = "filled",
	followingVariant = "light",
}) => {
	const [, followed, setFollowed] = useEagerMutation(
		initialFollowed,
		(_, desired) => yt.setUserFollowed(userId, desired),
		// todo: error notification
		console.error,
	);
	const [areYouSure, setAreYouSure] = useTemporary();

	const Icon = followed ? IconHeartFilled : IconHeart;
	const text = followed
		? areYouSure
			? "Click to confirm"
			: "Following"
		: "Follow";
	return (
		<CollapsibleButton
			onClick={(e) => {
				e.preventDefault();
				if (followed && !areYouSure) return setAreYouSure(true);
				setFollowed(!followed);
				setAreYouSure(false);
			}}
			variant={followed ? followingVariant : notFollowingVariant}
			leftSection={<Icon size={24} />}
		>
			{text}
		</CollapsibleButton>
	);
};
