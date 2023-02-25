export function tokenize(input: string): string[];

type lunr = ((
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

export const mylunr: lunr;
