const fs = require("fs");
const path = require("path");
const util = require("util");
const { html2text } = require("./parse");

const readFileAsync = util.promisify(fs.readFile);

describe("parser", () => {
  it("parses blog pages", async () => {
    const htmlPath = path.join(
      __dirname,
      "..",
      "example-docs/build/blog/d-s-l-test/index.html"
    );
    const html = await readFileAsync(htmlPath, "utf-8");
    expect(html2text(html, "blog")).toEqual({
      pageTitle: "BLOG POST TITLE",
      sections: [
        {
          title: "BLOG POST TITLE",
          content: "FIRST SECTION CONTENT FIRST SECTION CONTENT 2 ",
          hash: ""
        },
        {
          title: "FIRST HEADER",
          content: "FIRST HEADER CONTENT FIRST HEADER CONTENT 2 ",
          hash: "#first-header"
        },
        {
          title: "FIRST SUBHEADER",
          content:
            'FIRST SUBHEADER CONTENT #include <stdio.h>   int main(int argc, char** argv) {   printf("Hello World"); }   ',
          hash: "#first-subheader"
        }
      ]
    });
  });

  it("parses docs pages", async () => {
    const htmlPath = path.join(
      __dirname,
      "..",
      "example-docs/build/docs/d-s-l-test/index.html"
    );
    const html = await readFileAsync(htmlPath, "utf-8");
    expect(html2text(html, "docs")).toEqual({
      pageTitle: "DOC TITLE",
      sections: [
        {
          title: "DOC TITLE",
          content: "FIRST SECTION CONTENT A link to a video. ",
          hash: ""
        },
        {
          title: "FIRST HEADER",
          content: "FIRST HEADER CONTENT ",
          hash: "#first-header"
        },
        {
          title: "FIRST SUBHEADER",
          content: "LIST ITEM 1 LIST ITEM 2  ",
          hash: "#first-subheader"
        },
        {
          title: "SECOND SUBHEADER",
          content: "COL 1 COL 2 A1 B1 A2 B2  ",
          hash: "#second-subheader"
        },
        {
          content: "BLOCKQUOTE CONTENT  ",
          hash: "#blockquotes",
          title: "Blockquotes"
        },
        {
          content: " This is a note    ",
          hash: "#first-sub-sub-header",
          title: "FIRST SUB SUB HEADER"
        }
      ]
    });
  });
});
