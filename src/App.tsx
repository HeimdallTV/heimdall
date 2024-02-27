import { Suspense, lazy } from "react";
import styled from "styled-components";
import { Route, Router } from "wouter";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { NavBar } from "@/components/NavBar";

// if (import.meta.env.VITE_MODE === 'development') {
// 	const origConsoleError = console.error
// 	console.error = (...args: unknown[]) => {
// 		const isNestingWarning = (arg: unknown) => typeof arg === 'string' && arg.includes('validateDOMNesting')
// 		const [formatString, child, parent] = args
// 		if (isNestingWarning(formatString) && child === '<a>' && parent === 'a') {
// 			return
// 		}
// 		origConsoleError(...args)
// 	}
// }

const theme = createTheme({
	fontFamily: "Roboto Flex",
	colors: {
		dark: [
			"#C9C9C9",
			"#b8b8b8",
			"#828282",
			"#696969",
			"#393348",
			"#332E41",
			"#2d2939",
			"#1E1E28",
			"#1c1a24",
			"#131019",
		],
	},
	lineHeights: {
		xs: "1.3",
		sm: "1.35",
		md: "1.45",
		lg: "1.5",
		xl: "1.55",
	},
});

const Shell = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: auto 1fr;

  > * {
    overflow-y: auto;
  }
`;

const Home = lazy(() => import("./views/Home"));
const Following = lazy(() => import("./views/Following"));
const History = lazy(() => import("./views/History"));
const Watch = lazy(() => import("./views/watch/Watch"));
const Channel = lazy(() => import("./views/channel/Channel"));
const Search = lazy(() => import("./views/search/Search"));

export default function App() {
	return (
		<MantineProvider theme={theme} defaultColorScheme="dark">
			<Shell>
				<NavBar />
				<Suspense fallback={null}>
					<Router>
						<Route path="/">
							<Home />
						</Route>
						<Route path="/following">
							<Following />
						</Route>
						<Route path="/history">
							<History />
						</Route>
						<Route path="/w/:videoId" component={Watch} />
						<Route path="/c/:channelId" component={Channel} />
						<Route path="/search/:query" component={Search} />{" "}
					</Router>
				</Suspense>
			</Shell>
		</MantineProvider>
	);
}
