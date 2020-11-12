const cheerio = require("cheerio");

const { logger } = require("./logger");

// We insert whitespace after text from any of these tags
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
  "th",
];

function getText($, el) {
  if (Array.isArray(el)) {
    let content = "";
    el.forEach((el) => {
      content += getText($, el);
      if (el.type === "tag" && BLOCK_TAGS.includes(el.name)) {
        content += " ";
      }
    });
    return content;
  } else if (el.type === "text") {
    return el.data.replace(/\n/g, " ");
  } else if (el.type === "tag") {
    return getText($, $(el).contents().get());
  } else if (el.type === "style" || el.type === "script") {
    return "";
  } else {
    throw new Error(`This should not be reached (debug: got type ${el.type})`);
  }
}

module.exports.html2text = function (html, type, url = "?") {
  const $ = cheerio.load(html);
  // Remove copy buttons from code boxes
  $("div[class^=mdxCodeBlock_] button").remove();

  if (type === "docs") {
    // Remove version badges
    $("span")
      .filter(
        (_, element) =>
          $(element).hasClass("badge") &&
          $(element).text().startsWith("Version:")
      )
      .remove();
  }

  if (type === "docs" || type === "blog") {
    const HEADINGS = "h1, h2, h3";
    const pageTitle = $("article header h1").first().text();

    const sections = [];
    // Make sure to also adjust the highlighting functionality in the client
    // if you change the top element here.
    $("article")
      .find(HEADINGS)
      .each((_, heading) => {
        const title = $(heading).contents().not("a[aria-hidden=true]").text();
        const hash = $(heading).find("a.hash-link").attr("href") || "";

        let $sectionElements;
        if ($(heading).parents("header").length) {
          // $(heading) is the page title

          $firstElement = $("article")
            .children() // div.markdown, header
            .not("header") // div.markdown
            .children() // h1, p, p, h2, ...
            .first(); // h1 || p
          if ($firstElement.filter(HEADINGS).length) {
            // The first element is a header. This section is empty.
            sections.push({ title, hash, content: "" });
            return;
          }
          $sectionElements = $firstElement.nextUntil(HEADINGS).addBack();
        } else {
          $sectionElements = $(heading).nextUntil(HEADINGS);
        }
        const content = getText($, $sectionElements.get()).trim();

        sections.push({
          // Remove elements that are marked as aria-hidden.
          // This is mainly done to remove anchors like this:
          // <a aria-hidden="true" tabindex="-1" class="hash-link" href="#first-subheader" title="Direct link to heading">#</a>
          title,
          hash,
          content,
        });
      });

    return { pageTitle, sections };
  } else if (type === "page") {
    $("a[aria-hidden=true]").remove();
    let $pageTitle = $("h1").first();
    if (!$pageTitle.length) {
      $pageTitle = $("title");
    }

    const pageTitle = $pageTitle.text();
    // Make sure to also adjust the highlighting functionality in the client
    // if you change the top element here.
    const $main = $("main").first();
    if (!$main.length) {
      logger.warn(
        "Page has no <main>, therefore no content was indexed for this page.",
        { url }
      );
    }
    return {
      pageTitle,
      sections: [
        {
          title: pageTitle,
          hash: "",
          content: $main.length ? getText($, $main.get()).trim() : "",
        },
      ],
    };
  } else {
    throw new Error(`Cannot index files of unknown type ${type}!`);
  }
};

module.exports.getDocVersion = function (html) {
  const $ = cheerio.load(html);
  return $('meta[name="docusaurus_version"]').attr("content");
};
