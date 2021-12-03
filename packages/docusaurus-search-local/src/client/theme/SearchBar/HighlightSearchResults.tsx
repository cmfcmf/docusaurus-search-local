import Mark from "mark.js";
import { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { docsBasePath, blogBasePath } from "./generatedWrapper";
import { useHistory } from "@docusaurus/router";

function isDocsOrBlog(baseUrl: string) {
  return (
    window.location.pathname.startsWith(`${baseUrl}${docsBasePath}`) ||
    window.location.pathname.startsWith(`${baseUrl}${blogBasePath}`)
  );
}

export function HighlightSearchResults() {
  const location = useLocation<{ cmfcmfhighlight?: string[] }>();
  const history = useHistory();
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const [terms, setTerms] = useState<string[]>([]);

  useEffect(() => {
    const termsToHighlight = location.state?.cmfcmfhighlight ?? [];
    if (termsToHighlight.length === 0) {
      return;
    }
    setTerms(termsToHighlight);

    const { cmfcmfhighlight, ...state } = location.state;
    history.replace({
      ...location,
      state,
    });
  }, [location.state?.cmfcmfhighlight, history, location]);

  useEffect(() => {
    if (terms.length === 0) {
      return;
    }

    // Make sure to also adjust parse.js if you change the top element here.
    const root = isDocsOrBlog(baseUrl)
      ? document.getElementsByTagName("article")[0]
      : document.getElementsByTagName("main")[0];
    if (!root) {
      return;
    }

    const mark = new Mark(root);
    const options = {
      ignoreJoiners: true,
    };
    mark.mark(terms, options);
    return () => mark.unmark(options);
  }, [terms]);

  return null;
}
