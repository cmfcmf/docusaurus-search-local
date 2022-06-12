const fs = require("fs");
const path = require("path");
const util = require("util");
const { html2text } = require("./parse");

const readFileAsync = util.promisify(fs.readFile);

beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

describe("parser", () => {
  it("parses blog pages", async () => {
    const htmlPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "example-docs/build/blog/d-s-l-test/index.html"
    );
    const html = await readFileAsync(htmlPath, "utf-8");
    expect(html2text(html, "blog")).toEqual({
      docSidebarParentCategories: undefined,
      pageTitle: "BLOG POST TITLE",
      sections: [
        {
          title: "BLOG POST TITLE",
          content: "FIRST SECTION CONTENT FIRST SECTION CONTENT 2",
          hash: "",
          tags: ["tag1", "tag2", "tag3"],
        },
        {
          title: "FIRST HEADER",
          content: "FIRST HEADER CONTENT FIRST HEADER CONTENT 2",
          hash: "", // no hashes are assigned to h1 headers
          tags: [],
        },
        {
          title: "FIRST SUBHEADER",
          content:
            'FIRST SUBHEADER CONTENT #include <stdio.h> int main(int argc, char** argv) { printf("Hello World"); }',
          hash: "#first-subheader",
          tags: [],
        },
      ],
    });
  });

  describe("docs", () => {
    it("parses normal pages", async () => {
      const htmlPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "example-docs/build/docs/d-s-l-test/index.html"
      );
      const html = await readFileAsync(htmlPath, "utf-8");
      expect(html2text(html, "docs")).toEqual({
        docSidebarParentCategories: ["Docusaurus"],
        pageTitle: "DOC TITLE",
        sections: [
          {
            title: "DOC TITLE",
            content: "FIRST SECTION CONTENT A link to a video.",
            hash: "",
            tags: ["tag1", "tag2", "tag3"],
          },
          {
            title: "FIRST HEADER",
            content: "FIRST HEADER CONTENT",
            hash: "", // no hashes are assigned to h1 headers
            tags: [],
          },
          {
            title: "FIRST SUBHEADER",
            content: "LIST ITEM 1 LIST ITEM 2",
            hash: "#first-subheader",
            tags: [],
          },
          {
            title: "SECOND SUBHEADER",
            content: "COL 1 COL 2 A1 B1 A2 B2",
            hash: "#second-subheader",
            tags: [],
          },
          {
            content: "BLOCKQUOTE CONTENT",
            hash: "#blockquotes",
            title: "Blockquotes",
            tags: [],
          },
          {
            content: "note This is a note",
            hash: "#first-sub-sub-header",
            title: "FIRST SUB SUB HEADER",
            tags: [],
          },
        ],
      });
    });

    it("parses empty page", async () => {
      const htmlPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "example-docs/build/docs/d-s-l-test2/index.html"
      );
      const html = await readFileAsync(htmlPath, "utf-8");
      expect(html2text(html, "docs")).toEqual({
        docSidebarParentCategories: ["Docusaurus"],
        pageTitle: "DOC TITLE",
        sections: [{ content: "", hash: "", title: "DOC TITLE", tags: [] }],
      });
    });

    it("parses nested sidebar categories", async () => {
      const htmlPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "example-docs/build/docs/next/nested_sidebar_doc/index.html"
      );
      const html = await readFileAsync(htmlPath, "utf-8");
      expect(html2text(html, "docs")).toEqual({
        docSidebarParentCategories: ["SidebarParent", "SidebarChild"],
        pageTitle: "NestedSidebarDoc",
        sections: [
          {
            content: "私は電車が好きです。",
            hash: "",
            title: "NestedSidebarDoc",
            tags: [],
          },
        ],
      });
    });

    it("parses page with first header directly after title", async () => {
      const htmlPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "example-docs/build/docs/d-s-l-test3/index.html"
      );
      const html = await readFileAsync(htmlPath, "utf-8");
      expect(html2text(html, "docs")).toEqual({
        docSidebarParentCategories: ["Docusaurus"],
        pageTitle: "DOC TITLE",
        sections: [
          {
            title: "DOC TITLE",
            content: "",
            hash: "",
            tags: [],
          },
          {
            title: "FIRST HEADER",
            content: "",
            hash: "#first-header",
            tags: [],
          },
          {
            title: "SECOND HEADER",
            content: "",
            hash: "#second-header",
            tags: [],
          },
        ],
      });
    });
  });

  describe("static pages", () => {
    it("uses first h1 as title", () => {
      const html = `<html><head><title>TITLE</title></head><body>
      <h1>H1</h1><h1>OTHER</h1></body></html>`;
      expect(html2text(html, "page")).toEqual({
        pageTitle: "H1",
        sections: [
          {
            title: "H1",
            hash: "",
            content: "",
            tags: [],
          },
        ],
      });
    });
    it("falls back to <title> if not <h1> is found", () => {
      const html = `<html><head><title>TITLE</title></head><body></body></html>`;
      expect(html2text(html, "page")).toEqual({
        pageTitle: "TITLE",
        sections: [
          {
            title: "TITLE",
            hash: "",
            content: "",
            tags: [],
          },
        ],
      });
    });
    it("works on an empty page", () => {
      const html = `<html></html>`;
      expect(html2text(html, "page")).toEqual({
        pageTitle: "",
        sections: [
          {
            title: "",
            hash: "",
            content: "",
            tags: [],
          },
        ],
      });
    });
    it("parses content in <main>", () => {
      const html = `<html><head><title>TITLE</title></head><body>
      <h1>H1</h1><main>this is content</main></body></html>`;
      expect(html2text(html, "page")).toEqual({
        pageTitle: "H1",
        sections: [
          {
            title: "H1",
            hash: "",
            content: "this is content",
            tags: [],
          },
        ],
      });
    });
  });
});
