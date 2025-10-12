module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [2, "always", "sentence-case"],
  },
  ignores: [(commit) => commit.includes("Signed-off-by: dependabot[bot]")],
  helpUrl:
    "https://github.com/cmfcmf/docusaurus-search-local/blob/main/CONTRIBUTING.md#commit-message-guidelines",
};
