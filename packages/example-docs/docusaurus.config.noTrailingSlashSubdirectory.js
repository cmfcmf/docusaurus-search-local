import baseConfig from "./docusaurus.config.js";

/** @type {import('@docusaurus/types').Config} */
const config = {
  ...baseConfig,
  trailingSlash: false,
  baseUrl: '/foo/',
};

export default config;
