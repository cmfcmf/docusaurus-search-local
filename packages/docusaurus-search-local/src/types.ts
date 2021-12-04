export type DSLAPluginData = {
  indexDocSidebarParentCategories: number;
  titleBoost: number;
  contentBoost: number;
  parentCategoriesBoost: number;
};

export type MyDocument = {
  id: number;
  pageTitle: string;
  sectionTitle: string;
  sectionRoute: string;
  docVersion?: string;
  type: "docs" | "blog" | "page";
};
