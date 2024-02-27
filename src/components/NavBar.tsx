import React, { memo } from "react";
import styled from "styled-components";
import { Link } from "wouter";
import yt from "@yt";

import { useDisclosure } from "@mantine/hooks";
import { Text, Tooltip } from "@mantine/core";
import {
	IconHeart,
	IconHistory,
	IconHome,
	IconLayoutSidebarLeftCollapse,
	IconLayoutSidebarLeftExpand,
	IconSearch,
	IconSettings,
} from "@tabler/icons-react";
import { usePaginated } from "@/hooks/usePaginated";
import { ChannelIcon } from "./Channel/Link";
import Settings from "@/views/settings/Settings";

const NavBarItemButton = styled.button<{ href?: string }>`
  display: grid;
  align-items: center;

  grid-template-columns: 48px fit-content(200px);
  grid-template-rows: 48px;

  cursor: ${({ onClick, href }) =>
		onClick !== undefined || href !== undefined ? "pointer" : "default"};

  background-color: transparent;
  color: var(--mantine-color-text);
  outline: none;
  border: none;
  padding: 0;

  > *:first-child {
    justify-self: center;
  }
`;
const NavBarItem: FC<
	PropsWithChildren<{
		as?: React.ElementType;
		expanded: boolean;
		tooltip: string;
		onClick?: () => void;
		href?: string;
		style?: React.CSSProperties;
	}>
> = ({ tooltip, expanded, ...props }) => (
	<Tooltip
		label={tooltip}
		position="right"
		withArrow
		arrowSize={6}
		disabled={expanded}
	>
		<NavBarItemButton {...props} />
	</Tooltip>
);

const NavBarContainer = styled.nav<{ $expanded: boolean }>`
  display: flex;
  flex-direction: column;

  overflow: ${({ $expanded }) => ($expanded ? "auto" : "hidden")} !important;

  ${({ $expanded }) =>
		!$expanded &&
		`
    > * > *:nth-child(2) {
      display: none;
    }
  `}
`;

// todo: custom tooltip for channels
// todo: virtual list for channels
export const NavBar = memo(() => {
	const [expanded, { toggle }] = useDisclosure(false);
	const [settingsOpen, { open: openSettings, close: closeSettings }] =
		useDisclosure(false);
	const followedUsers = usePaginated(yt.listFollowedUsers!);
	return (
		<NavBarContainer $expanded={expanded}>
			{/* Ensures that the tooltip delays are synced with each other */}
			<Tooltip.Group openDelay={1000} closeDelay={500}>
				<NavBarItem
					as="button"
					onClick={toggle}
					style={{ background: "var(--mantine-color-text)", color: "black" }}
					expanded={expanded}
					tooltip="Expand Sidebar"
				>
					{expanded ? (
						<IconLayoutSidebarLeftCollapse size={24} />
					) : (
						<IconLayoutSidebarLeftExpand size={24} />
					)}
					<Text size="sm" fw={700}>
						Collapse Sidebar
					</Text>
				</NavBarItem>

				<NavBarItem as={Link} href="/" expanded={expanded} tooltip="Home">
					<IconHome size={24} />
					<Text size="sm" fw={700}>
						Home
					</Text>
				</NavBarItem>

				<NavBarItem
					as={Link}
					href="/search"
					expanded={expanded}
					tooltip="Search"
				>
					<IconSearch size={24} />
					<Text size="sm" fw={700}>
						Search
					</Text>
				</NavBarItem>

				<NavBarItem
					as={Link}
					href="/history"
					expanded={expanded}
					tooltip="History"
				>
					<IconHistory size={24} />
					<Text size="sm" fw={700}>
						History
					</Text>
				</NavBarItem>

				<NavBarItem
					expanded={expanded}
					onClick={openSettings}
					tooltip="Settings"
				>
					<Settings opened={settingsOpen} onClose={closeSettings} />
					<IconSettings size={24} />
					<Text size="sm" fw={700}>
						Settings
					</Text>
				</NavBarItem>

				<NavBarItem
					as={Link}
					href="/following"
					expanded={expanded}
					tooltip="Following"
				>
					<IconHeart size={24} />
					<Text size="sm" fw={700}>
						Following
					</Text>
				</NavBarItem>

				{followedUsers.data
					.flat()
					.slice(0, 20)
					.map((user) => (
						<NavBarItemButton as={Link} href={`/c/${user.id}`} key={user.id}>
							<ChannelIcon size={30} channel={user} />
							<Text size="sm" fw={700} truncate="end">
								{user.name}
							</Text>
						</NavBarItemButton>
					))}
			</Tooltip.Group>
		</NavBarContainer>
	);
});
