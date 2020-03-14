const htmlparser2 = require("htmlparser2");
const cheerio = require("cheerio");

const BLOCK_TAGS = [
  "address",
  "article",
  "aside",
  "blockquote",
  "canvas",
  "dd",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "li",
  "main",
  "nav",
  "noscript",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "tfoot",
  "ul",
  "video",
  // Not strictly block tags, but still.
  "td",
  "th"
];

function getText($, el) {
  if (Array.isArray(el)) {
    let content = "";
    el.forEach(el => {
      content += getText($, el);
      if (el.type === "tag" && BLOCK_TAGS.includes(el.name)) {
        content += " ";
      }
    });
    return content;
  } else if (el.type === "text") {
    return el.data.replace(/\n/g, " ");
  } else if (el.type === "tag") {
    return getText(
      $,
      $(el)
        .contents()
        .get()
    );
  } else {
    throw new Error("Should not happen.");
  }
}

module.exports.html2text = function(html, type) {
  const $ = cheerio.load(html);
  // Remove copy buttons from code boxes
  $("pre button").remove();

  if (type === "docs" || type === "blog") {
    const HEADINGS = "h1, h2, h3";
    const pageTitle = $("article header h1")
      .first()
      .text();

    const sections = [];
    $("article")
      .find(HEADINGS)
      .each((_, heading) => {
        const $sectionElements = $(heading).parents("header").length
          ? $("article")
              .children()
              .not("header")
              .children()
              .first()
              .nextUntil(HEADINGS)
              .addBack()
          : $(heading).nextUntil(HEADINGS);

        const content = getText($, $sectionElements.get());

        sections.push({
          // Remove elements that are marked as aria-hidden.
          // This is mainly done to remove anchors like this:
          // <a aria-hidden="true" tabindex="-1" class="hash-link" href="#first-subheader" title="Direct link to heading">#</a>
          title: $(heading)
            .contents()
            .not("a[aria-hidden=true]")
            .text(),
          hash:
            $(heading)
              .find("a.hash-link")
              .attr("href") || "",
          content
        });
      });

    return { pageTitle, sections };
  } else if (type === "page") {
    $("a[aria-hidden=true]").remove();
    const pageTitle = $("h1")
      .first()
      .text();
    return {
      pageTitle,
      sections: [
        {
          title: pageTitle,
          hash: "",
          content: getText($("main").first())
        }
      ]
    };
  } else {
    throw new Error(`Cannot index files of unknown type ${type}!`);
  }
};
