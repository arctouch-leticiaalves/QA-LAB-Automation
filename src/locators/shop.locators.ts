export const SHOP_LOCATORS = {
  productsCounter: 'android=new UiSelector().descriptionContains("Showing")',

  searchField: '//android.widget.EditText[starts-with(@hint, "Search")]',

  allCategoryChip: '~All',
  electronicsChip: '~Electronics',
  clothingChip: '~Clothing',
  homeChip: '~Home',
  booksChip: '~Books',

  firstProductCard: 'android=new UiSelector().descriptionContains("Product card:").instance(0)',

  listViewToggle: '~Switch to list view',
  gridViewToggle: '~Switch to grid view',

  shopTab: 'android=new UiSelector().descriptionContains("Tab 1 of 4")',
  cartTab: 'android=new UiSelector().descriptionContains("Tab 2 of 4")',
} as const
