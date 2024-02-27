import browser from "webextension-polyfill";
import { ExtensionRequestMetadata } from "@saghen/hermes/transports/extension";
import {
	TransferableRequestInit,
	responseToTransferableResponse,
	transferableRequestInitToRequestInit,
} from "./convert";

const deserializeCookies = (cookies: string) =>
	Object.fromEntries(
		cookies
			.split(";")
			.filter(Boolean)
			.map((cookie) => [
				cookie.slice(0, cookie.indexOf("=")).trim(),
				cookie.slice(cookie.indexOf("=") + 1).trim(),
			]),
	);
const serializeCookies = (cookies: Record<string, string>) =>
	Object.entries(cookies)
		.map((cookie) => `${cookie[0]}=${cookie[1]}`)
		.join("; ");

const createHeaderRule = async (
	url: string,
	cookies: Record<string, string>,
) => {
	const serializedCookies = serializeCookies(cookies);
	if (serializedCookies === "") return () => {};

	const randomId = Math.floor(Math.random() * 1000000000);
	await browser.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: [randomId, randomId + 1],
		addRules: [
			{
				id: randomId,
				priority: 1,
				action: {
					type: "modifyHeaders",
					requestHeaders: [
						{
							header: "Cookie",
							operation: "set",
							value: serializedCookies,
						},
						{
							header: "Origin",
							operation: "set",
							value: new URL(url).origin,
						},
						{
							header: "Referer",
							operation: "set",
							value: new URL(url).origin,
						},
					],
				},
				condition: {
					urlFilter:
						url /* , initiatorDomains: [new URL(browser.runtime.getURL('/')).hostname] */,
				},
			},
		],
	});
	return () =>
		browser.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: [randomId],
		});
};

// TODO: Support Request to match default behavior
export const fetch = async (
	url: string,
	transferableInit: TransferableRequestInit,
	metadata: ExtensionRequestMetadata,
) => {
	const init = transferableRequestInitToRequestInit(transferableInit);

	// Combine cookies from the request with the cookies from the given context
	const headers = new Headers(init?.headers);
	const requestCookies = deserializeCookies(headers.get("cookie") ?? "");
	const browserCookies = await browser.cookies
		.getAll({ url, storeId: metadata.sender.tab?.cookieStoreId })
		.then((cookies) =>
			cookies
				.filter(
					(cookie) =>
						!cookie.expirationDate ||
						cookie.expirationDate > Number(new Date()) / 1000,
				)
				.map((cookie) => [cookie.name, cookie.value]),
		)
		.then(Object.fromEntries);
	const removeCookieRule = await createHeaderRule(url, {
		...browserCookies,
		...requestCookies,
	});

	return globalThis
		.fetch(url, init)
		.then(responseToTransferableResponse)
		.finally(removeCookieRule);
};
