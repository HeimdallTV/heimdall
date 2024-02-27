import { Some, SomeOptions, someToArray } from "../core/internals";
import { dissoc } from "@libs/utils";

export function parseText<T extends SingleText, U extends ManyText>(
	value: T | U,
): (Omit<T, keyof SingleText> & ManyText) | U {
	// @ts-ignore
	if ("simpleText" in value)
		return { ...dissoc("simpleText", value), text: value.simpleText };
	// @ts-ignore
	return value;
}

export const someTextToArray = <T extends SingleText, U extends ManyText>(
	value: Some<SomeOptions<T, U>>,
) => someToArray(value).map((run) => parseText<T, U>(run));

export const combineSomeText = <T extends Some<Text>>(value: T) =>
	someTextToArray(value)
		.map((_) => _.text)
		.join("");

export type SingleText = { simpleText: string };
export type ManyText = { text: string };
export type Text = SomeOptions<SingleText, ManyText>;
