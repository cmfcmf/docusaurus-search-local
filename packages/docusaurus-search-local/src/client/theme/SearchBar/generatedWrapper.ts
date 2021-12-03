import type lunr from "lunr";
// @ts-expect-error
import * as data from "./generated.js";

export const blogBasePath: string = data.blogBasePath;
export const docsBasePath: string = data.docsBasePath;
export const tokenize: (input: string) => string[] = data.tokenize;
export const indexDocSidebarParentCategories: boolean =
  data.indexDocSidebarParentCategories;
export const mylunr: typeof lunr = data.mylunr;
