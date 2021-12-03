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
  docsRouteBasePath: "/docs",
  indexDocSidebarParentCategories: 0,
  indexBlog: true,
  blogRouteBasePath: "/blog",
  indexPages: false,
  language: "en",
  style: undefined,
  lunr: {
    tokenizerSeparator: undefined,
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
    docsRouteBasePath: "/foo",
    indexDocSidebarParentCategories: 3,
    indexBlog: false,
    blogRouteBasePath: "/bar",

    indexPages: true,
    language: "hi",

    style: "none",

    lunr: {
      tokenizerSeparator: /-+/,
    },
  };

  expect(validateOptions({ options, validate })).toEqual(options);
});
