import Mark from "mark.js";
import { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useHistory } from "@docusaurus/router";

export type DSLALocationState = {
  cmfcmfhighlight?: { terms: string[]; isDocsOrBlog: boolean };
};

export function HighlightSearchResults() {
  const location = useLocation<DSLALocationState>();
  const history = useHistory();
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();

  const [highlightData, setHighlightData] = useState<
    NonNullable<DSLALocationState["cmfcmfhighlight"]>
  >({ terms: [], isDocsOrBlog: false });

  useEffect(() => {
    if (
      !location.state?.cmfcmfhighlight ||
      location.state.cmfcmfhighlight.terms.length === 0
    ) {
      return;
    }
    setHighlightData(location.state.cmfcmfhighlight);

    const { cmfcmfhighlight, ...state } = location.state;
    history.replace({
      ...location,
      state,
    });
  }, [location.state?.cmfcmfhighlight, history, location]);

  useEffect(() => {
    if (highlightData.terms.length === 0) {
      return;
    }

    // Make sure to also adjust parse.js if you change the top element here.
    const root = highlightData.isDocsOrBlog
      ? document.getElementsByTagName("article")[0]
      : document.getElementsByTagName("main")[0];
    if (!root) {
      return;
    }

    const mark = new Mark(root);
    const options = {
      ignoreJoiners: true,
    };
    mark.mark(highlightData.terms, options);
    return () => mark.unmark(options);
  }, [highlightData, baseUrl]);

  return null;
}
