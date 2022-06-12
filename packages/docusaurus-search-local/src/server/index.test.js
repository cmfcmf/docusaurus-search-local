const { validateOptions } = require("./index");

const validate = (schema, options) => {
  const result = schema.validate(options);
  if (result.error) {
    throw result.error;
  }
  return result.value;
};

const DEFAULT_OPTIONS = {
  indexDocs: true,
  indexDocSidebarParentCategories: 0,
  indexBlog: true,
  indexPages: false,
  language: "en",
  style: undefined,
  maxSearchResults: 8,
  lunr: {
    tokenizerSeparator: undefined,
    b: 0.75,
    k1: 1.2,
    titleBoost: 5,
    contentBoost: 1,
    tagsBoost: 3,
    parentCategoriesBoost: 2,
  },
};

it("validates options correctly", () => {
  expect(() =>
    validateOptions({ options: { foo: 123 }, validate })
  ).toThrowErrorMatchingInlineSnapshot(`"\\"foo\\" is not allowed"`);

  expect(() =>
    validateOptions({ options: { style: "modern" }, validate })
  ).toThrowErrorMatchingInlineSnapshot(`"\\"style\\" must be [none]"`);

  expect(validateOptions({ options: {}, validate })).toEqual(DEFAULT_OPTIONS);

  expect(
    validateOptions({ options: { language: ["en", "de"] }, validate })
  ).toEqual({
    ...DEFAULT_OPTIONS,
    language: ["en", "de"],
  });

  [-1, 1.4, Infinity].forEach((value) =>
    expect(() =>
      validateOptions({
        options: { indexDocSidebarParentCategories: value },
        validate,
      })
    ).toThrowError()
  );

  const options = {
    indexDocs: false,
    indexDocSidebarParentCategories: 3,
    indexBlog: false,
    indexPages: true,
    language: "hi",
    style: "none",
    maxSearchResults: 123,
    lunr: {
      tokenizerSeparator: /-+/,
      b: 0.6,
      k1: 0.2,
      titleBoost: 10,
      contentBoost: 1,
      tagsBoost: 3,
      parentCategoriesBoost: 4,
    },
  };

  expect(validateOptions({ options, validate })).toEqual(options);
});
