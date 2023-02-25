const assert = require("assert");

module.exports = (api) => {
  const isTest = api.env("test");
  assert(isTest, "babel.config.js is only used for testing with jest!");

  return {
    // Jest
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-typescript",
    ],
  };
};
