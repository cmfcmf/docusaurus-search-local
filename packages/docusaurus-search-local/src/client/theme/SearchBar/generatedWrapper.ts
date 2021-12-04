const lunr = require("../../../lunr.js") as ((
  config: import("lunr").ConfigFunction
) => import("lunr").Index) & {
  Index: { load: (index: object) => import("lunr").Index };
} & {
  Query: {
    wildcard: {
      TRAILING: import("lunr").Query.wildcard.TRAILING;
    };
    presence: {
      PROHIBITED: import("lunr").Query.presence.PROHIBITED;
    };
  };
};

// @ts-expect-error
import * as data from "./generated.js";

export const tokenize: (input: string) => string[] = data.tokenize;
export const mylunr: typeof lunr = data.mylunr;
