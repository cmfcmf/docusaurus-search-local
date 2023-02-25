/**
 * @param {string} source
 * @returns {string}
 */
module.exports = function (source) {
  const options = this.getOptions();

  if (typeof options.generated !== "string") {
    process.exit("options.generated is not a string");
  }
  return options.generated;
};
