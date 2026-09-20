export const FAVORITES_LOCATORS = {
  myFavoritesTitle:
    'android=new UiSelector().description("My Favorites").clickable(false)',

  emptyMessage:
    'android=new UiSelector().descriptionContains("No favorites yet")',

  emptyHint:
    'android=new UiSelector().descriptionContains("Tap the heart icon on products")',

  // Favorite rows expose "Product Name\n$price" as the Button content-desc.
  favoriteItem: (productName: string) => {
    const safeName = productName.replaceAll('"', '')
    return `android=new UiSelector().className("android.widget.Button").descriptionContains("${safeName}")`
  },

  removedSnackbar:
    'android=new UiSelector().descriptionContains("from favorites")',

  dismissHintButton:
    'android=new UiSelector().descriptionContains("Dismiss hint")',

  backButton: '~Back',
} as const
