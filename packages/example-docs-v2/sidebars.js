/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  someSidebar: {
    Docusaurus: ['d-s-l-test', 'd-s-l-test2', 'd-s-l-test3', 'd-s-l-test-no-title-h1-pre-text', 'd-s-l-test-no-title-h1', 'd-s-l-test-no-title-h2', 'translated'],
    SidebarParent: [
      {
        SidebarChild: ['nested_sidebar_doc']
      }
    ],
  },
};
