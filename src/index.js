const fs = require("fs");
const path = require("path");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const lunr = require("lunr");
const { html2text } = require("./parse");

const flatMap = (array, mapper) => {
  return array.reduce((acc, element) => {
    return acc.concat(mapper(element));
  }, []);
};

module.exports = function(context, options) {
  const blogBasePath =
    options.blogBasePath !== undefined ? options.blogBasePath : "/blog";
  const docsBasePath =
    options.docsBasePath !== undefined ? options.docsBasePath : "/docs";
  const indexPages =
    options.indexPages !== undefined ? options.indexPages : false;
  const indexBlog = options.indexBlog !== undefined ? options.indexBlog : true;
  const indexDocs = options.indexDocs !== undefined ? options.indexDocs : true;

  if (!blogBasePath.startsWith("/")) {
    throw new Error(
      `blogBasePath must start with /, received: '${blogBasePath}'.`
    );
  }
  if (!docsBasePath.startsWith("/")) {
    throw new Error(
      `docsBasePath must start with /, received: '${docsBasePath}'.`
    );
  }

  return {
    name: "docusaurus-plugin",
    getThemePath() {
      return path.resolve(__dirname, "./theme");
    },
    async postBuild({ routesPaths = [], outDir }) {
      const data = flatMap(routesPaths, route => {
        if (route === "/404.html") {
          // Do not index error page.
          return [];
        }
        if (indexBlog && route.startsWith(blogBasePath)) {
          if (
            route === blogBasePath ||
            route.startsWith(`${blogBasePath}/tags/`) ||
            route === `${blogBasePath}/tags`
          ) {
            // Do not index list of blog posts and tags filter pages
            return [];
          }
          return { route, type: "blog" };
        }
        if (indexDocs && route.startsWith(docsBasePath)) {
          return { route, type: "docs" };
        }
        if (indexPages) {
          return { route, type: "page" };
        }
        return [];
      }).map(({ route, type }) => {
        const file = path.join(outDir, route, "index.html");
        return {
          file,
          route,
          type
        };
      });

      // Give every index entry a unique id so that the index does not need to store long URLs.
      let nextDocId = 1;
      const documents = (
        await Promise.all(
          data.map(async ({ file, route, type }) => {
            const html = await readFileAsync(file, { encoding: "utf8" });

            const { pageTitle, sections } = html2text(html, type);

            return sections.map(section => ({
              id: nextDocId++,
              pageTitle,
              pageRoute: route,
              sectionRoute: route + section.hash,
              sectionTitle: section.title,
              sectionContent: section.content
            }));
          })
        )
      ).reduce((acc, val) => acc.concat(val), []); // .flat()

      const index = lunr(function() {
        this.ref("id");
        this.field("title");
        this.field("content");
        documents.forEach(function({ id, sectionTitle, sectionContent }) {
          this.add({
            id: id.toString(), // the ref must be a string
            title: sectionTitle,
            content: sectionContent
          });
        }, this);
      });

      await writeFileAsync(
        path.join(outDir, "search-index.json"),
        JSON.stringify({
          documents: documents.map(
            ({ id, pageTitle, sectionTitle, sectionRoute }) => ({
              id,
              pageTitle,
              sectionTitle,
              sectionRoute
            })
          ),
          index
        }),
        { encoding: "utf8" }
      );
    }
  };
};
