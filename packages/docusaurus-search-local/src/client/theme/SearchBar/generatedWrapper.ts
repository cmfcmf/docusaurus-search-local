import type lunr from "lunr";
// @ts-expect-error
import * as data from "./generated.js";

export const tokenize: (input: string) => string[] = data.tokenize;
export const mylunr: typeof lunr = data.mylunr;
