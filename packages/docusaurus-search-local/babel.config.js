module.exports = (api) => {
  api.cache.never();

  return {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-typescript",
    ],
  };
};
