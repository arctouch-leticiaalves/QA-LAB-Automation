// Locators for the Shop screen. See appium-page-object skill for layout rules
// and appium-selectors skill for selection priority.

export const SHOP_LOCATORS = {
  // descriptionContains because the visible "Showing X of Y products" text
  // changes as the user scrolls and loads more results.
  productsCounter: 'android=new UiSelector().descriptionContains("Showing")',

  allCategoryChip: '~All',
} as const
