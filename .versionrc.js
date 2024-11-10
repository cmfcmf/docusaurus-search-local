const files = ["packages/docusaurus-search-local/package.json"];

module.exports = {
  packageFiles: files,
  bumpFiles: files,
  sign: true,
  scripts: {
    // Make sure that there is nothing to format before generating the changelog.
    prechangelog: "pnpm run lint",
    // Format the generated changelog.
    postchangelog: "pnpm run format",
  },
  header: `\
# Change Log

All notable changes to this project will be documented in this file.
This change log is automatically generated based on commit messags. See
[Commit Message Guidelines](CONTRIBUTING.md#commit-message-guidelines)
for more information.`,
  types: [
    { type: "feat", section: "Features" },
    { type: "fix", section: "Bug Fixes" },
    { type: "deps", section: "Other", hidden: true },
    { type: "chore", section: "Other", hidden: true },
  ],
};
