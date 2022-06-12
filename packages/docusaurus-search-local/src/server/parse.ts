import cheerio from "cheerio";
import logger from "./logger";

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

function _getText($: ReturnType<typeof cheerio.load>, el: any | any[]): string {
  if (Array.isArray(el)) {
    let content = "";
    el.forEach((el) => {
      content += _getText($, el);
      if (
        el.type === "tag" &&
        (BLOCK_TAGS.includes(el.name) ||
          // for lines in code blocks
          (el.name === "span" && $(el).attr("class") === "token-line"))
      ) {
        content += " ";
      }
    });
    return content;
  } else if (el.type === "text") {
    return el.data.replace(/\n/g, " ");
  } else if (el.type === "tag") {
    return _getText($, $(el).contents().get());
  } else if (["style", "script", "comment"].includes(el.type)) {
    return "";
  } else {
    logger.warn(
      `Received an unknown element while extracting content from HTML files. This should never happen. Please open an issue at https://github.com/cmfcmf/docusaurus-search-local/issues if you see this message (debug: got type ${el.type}).`
    );
    return "";
  }
}

function getText($: ReturnType<typeof cheerio.load>, el: any | any[]): string {
  return _getText($, el).replace(/\s+/g, " ").trim();
}

export function html2text(
  html: string,
  type: "docs" | "blog" | "page",
  url: string = "?"
) {
  const $ = cheerio.load(html);
  // Remove copy buttons from code boxes
  $("div[class^=codeBlockContent_] button").remove();

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

    const sections: Array<{
      title: string;
      hash: string;
      content: string;
      tags: string[];
    }> = [];
    // Parse tags, and add them to the first section.
    const tags = $("article footer ul[class^=tags_] li")
      .map((_, element) => $(element).text())
      .toArray();

    // Make sure to also adjust the highlighting functionality in the client
    // if you change the top element here.
    $("article")
      .find(HEADINGS)
      .each((i, heading) => {
        const title = $(heading)
          .contents()
          // Remove elements that are marked as aria-hidden and the hash-link.
          // This is mainly done to remove anchors like these:
          //
          // <a aria-hidden="true" tabindex="-1" class="hash-link" href="#first-subheader" title="Direct link to heading">#</a>
          // <a aria-hidden="true" tabindex="-1" class="anchor enhancedAnchor_prK2" id="first-header"></a>
          // <a class="hash-link" href="#first-header" title="Direct link to heading">#</a>
          .not("a[aria-hidden=true], a.hash-link")
          .text();
        const hash = $(heading).find("a.hash-link").attr("href") || "";

        let $sectionElements;
        if ($(heading).parents(".markdown").length === 0) {
          // $(heading) is the page title

          const $firstElement = $("article")
            .children() // div.markdown, header
            .not("header") // div.markdown
            .children() // h1, p, p, h2, ...
            .first(); // h1 || p
          if ($firstElement.filter(HEADINGS).length) {
            // The first element is a header. This section is empty.
            sections.push({
              title,
              hash,
              content: "",
              tags: i === 0 ? tags : [],
            });
            return;
          }
          $sectionElements = $firstElement
            .nextUntil(`${HEADINGS}, header`)
            .addBack();
        } else {
          // If the users uses a h1 tag as part of the markdown, Docusaurus will generate a header
          // around it for some reason, which we need to ignore.
          //
          // <header>
          //   <h1 class="h1Heading_27L5">FIRST HEADER</h1>
          // </header>

          const root = $(heading).parent("header").length
            ? $(heading).parent()
            : $(heading);
          $sectionElements = root.nextUntil(`${HEADINGS}, header`);
        }
        const content = getText($, $sectionElements.get());

        sections.push({
          title,
          hash,
          content,
          tags: i === 0 ? tags : [],
        });
      });

    const docSidebarParentCategories =
      type === "docs"
        ? $(".theme-doc-sidebar-container .menu__link--active")
            .map((_, element) => $(element).text())
            .get()
            .slice(0, -1)
        : undefined;

    return { pageTitle, sections, docSidebarParentCategories };
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
          content: $main.length ? getText($, $main.get()) : "",
          tags: [],
        },
      ],
    };
  } else {
    throw new Error(`Cannot index files of unknown type ${type}!`);
  }
}

export function getDocusaurusTag(html: string) {
  const $ = cheerio.load(html);
  const tag = $('meta[name="docusaurus_tag"]').attr("content");
  if (!tag || tag.length === 0) {
    throw new Error(
      "The `docusaurus_tag` meta tag could not be found. Please make sure that your page is wrapped in the `<Layout>` component (from `@theme/Layout`). If it is, then this is a bug, please report it."
    );
  }
  return tag;
}
