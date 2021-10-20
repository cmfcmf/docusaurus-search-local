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
  docsPath: "docs",
  docsRouteBasePath: "/docs",
  indexDocSidebarParentCategories: 0,
  indexBlog: true,
  blogRouteBasePath: "/blog",
  indexPages: false,
  language: "en",
  style: undefined,
  lunr: {
    tokenizerSeparator: undefined,
    b: 0.75,
    contentBoost: 1,
    k1: 1.2,
    titleBoost: 5,
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

  expect(() =>
    validateOptions({ options: { docsRouteBasePath: "foo" }, validate })
  ).toThrowErrorMatchingInlineSnapshot(
    `"\\"docsRouteBasePath\\" with value \\"foo\\" fails to match the required pattern: /^\\\\//"`
  );

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
    docsPath: "baz",
    docsRouteBasePath: "/foo",
    indexDocSidebarParentCategories: 3,
    indexBlog: false,
    blogRouteBasePath: "/bar",

    indexPages: true,
    language: "hi",

    style: "none",

    lunr: {
      tokenizerSeparator: /-+/,
      k1: 0.2,
      b: 0.6,
      titleBoost: 10,
      contentBoost: 1,
    },
  };

  expect(validateOptions({ options, validate })).toEqual(options);
});
