import { useDelayedEvent } from "@/hooks/useDelayed";
import { toShortHumanReadable } from "@/parser/yt/core/helpers";
import * as std from "@std";
import yt from "@yt";
import { Link } from "wouter";
import { FollowButton } from "../button";
import { Avatar, Card, Skeleton, Stack, Text } from "@mantine/core";
import { Column } from "../lese/components/Flex";

export const ChannelCard: React.FC<{ channel: std.Channel }> = ({
	channel,
}) => {
	// prefetching the channel
	const getChannel = useDelayedEvent(() => yt.getChannel(channel.id), 400);

	return (
		<Column
			as={Link}
			href={`/c/${channel.id}`}
			onMouseEnter={getChannel.trigger}
			onMouseLeave={getChannel.cancel}
			xAlign
			separation="...4px 16px"
			style={{ overflow: "hidden", padding: "1rem" }}
		>
			<Avatar
				src={channel.user.avatar?.sort((a, b) => b.height - a.height)[0]?.url}
				size={128}
			/>
			<Text fw="bold" size="lg" lineClamp={2}>
				{channel.user.name}
			</Text>
			<Text size="sm" c="dimmed" lineClamp={2}>
				{toShortHumanReadable(channel.user.followerCount)} followers
			</Text>
			<FollowButton
				notFollowingVariant="default"
				userId={channel.user.id}
				followed={Boolean(channel.user.followed)}
			/>
		</Column>
	);
};

export const ChannelCardSkeleton: React.FC = () => (
	<Card styles={{ root: { background: "none", overflow: "visible" } }}>
		<Card.Section>
			<Skeleton width="128px" circle />
		</Card.Section>
		<Stack gap="4px">
			<Skeleton width="120px" height="3em" />
			<Skeleton width="160px" height="1.5em" />
		</Stack>
	</Card>
);
