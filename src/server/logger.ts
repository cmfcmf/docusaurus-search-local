function prefix(level: string) {
  return `[Local Search] [${level}]: `;
}

function suffix(options: { url?: string }) {
  return options.url ? ` (url: ${options.url})` : "";
}

const DEBUG = !!process.env.DEBUG;

export default {
  warn: (msg: string, options: { url?: string } = {}) =>
    console.warn(`${prefix("WARN")}${msg}${suffix(options)}`),
  info: (msg: string, options: { url?: string } = {}) =>
    console.info(`${prefix("INFO")}${msg}${suffix(options)}`),
  debug: (msg: string, options: { url?: string } = {}) =>
    DEBUG && console.debug(`${prefix("DEBUG")}${msg}${suffix(options)}`),
};
