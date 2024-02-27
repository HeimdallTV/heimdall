/**
 * Convert between RequestInit/Response and TransferredRequestInit/TransferredResponse
 * so that we can send them over sendMessage since Request/Response aren't
 * transferrable objects
 **/

/// RequestInit
export interface TransferableRequestInit {
	/** A Base64 string or null to set request's body. */
	body?: string | null;
	/** A string indicating how the request will interact with the browser's cache to set request's cache. */
	cache?: RequestCache;
	/** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
	credentials?: RequestCredentials;
	/** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
	headers?: [string, string][] | Record<string, string>;
	/** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
	integrity?: string;
	/** A boolean to set request's keepalive. */
	keepalive?: boolean;
	/** A string to set request's method. */
	method?: string;
	/** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
	mode?: RequestMode;
	/** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. */
	redirect?: RequestRedirect;
	/** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
	referrer?: string;
	/** A referrer policy to set request's referrerPolicy. */
	referrerPolicy?: ReferrerPolicy;
}

export const transferableRequestInitToRequestInit = (
	transferableRequest: TransferableRequestInit,
): RequestInit => ({
	body:
		transferableRequest.body && stringToArrayBuffer(transferableRequest.body),
	cache: transferableRequest.cache,
	credentials: transferableRequest.credentials,
	headers: new Headers(transferableRequest.headers),
	integrity: transferableRequest.integrity,
	method: transferableRequest.method,
	mode: transferableRequest.mode,
	redirect: transferableRequest.redirect,
	referrer: transferableRequest.referrer,
	referrerPolicy: transferableRequest.referrerPolicy,
});

export const requestInitToTransferableRequestInit = async (
	requestInit: RequestInit,
): Promise<TransferableRequestInit> => ({
	...requestInit,
	body: requestInit.body && (await new Response(requestInit.body).text()),
	// @ts-expect-error Valid but Typescript doesn't recognize it
	headers:
		requestInit.headers instanceof Headers
			? requestInit.headers.entries()
			: requestInit.headers,
});

/// Response
type TransferableResponse = {
	/** Base64 encoded */
	body: null | string;
	headers: Record<string, string>;
	status: number;
	statusText: string;
};
export const responseToTransferableResponse = async (
	response: Response,
): Promise<TransferableResponse> => ({
	body: response.body && (await response.text()),
	headers: headersToObject(response.headers),
	status: response.status,
	statusText: response.statusText,
});

export const transferableResponseToResponse = (
	transferableResponse: TransferableResponse,
): Response =>
	new Response(
		transferableResponse.body && stringToArrayBuffer(transferableResponse.body),
		{
			headers: new Headers(transferableResponse.headers),
			status: transferableResponse.status,
			statusText: transferableResponse.statusText,
		},
	);

/// Helpers
const stringToArrayBuffer = (str: string) => {
	const encoder = new TextEncoder();
	return encoder.encode(str);
};
const headersToObject = (headers: Headers) => {
	const headersObject: Record<string, string> = {};
	// no type-safe way to do it with for of that I know of
	// biome-ignore lint/complexity/noForEach:
	headers.forEach((value, key) => {
		headersObject[key] = value;
	});
	return headersObject;
};
