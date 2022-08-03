export type DSLAPluginData = {
  indexDocSidebarParentCategories: number;
  titleBoost: number;
  contentBoost: number;
  tagsBoost: number;
  parentCategoriesBoost: number;
  maxSearchResults: number;
  searchEngine?: "lunr" | "sqlite";
};

export type MyDocument = {
  id: number;
  pageTitle: string;
  sectionTitle: string;
  sectionRoute: string;
  type: "docs" | "blog" | "page";
};
