export const PRODUCT_DETAIL_LOCATORS = {
  backButton: '~Back',

  dismissHintButton:
    'android=new UiSelector().descriptionContains("Dismiss hint")',

  addToCartButton: '~Add to Cart',

  productNameTitle:
    'android=new UiSelector().descriptionStartsWith("Product name:")',

  priceLabel: 'android=new UiSelector().descriptionStartsWith("Price:")',

  imageCarousel:
    'android=new UiSelector().descriptionContains("Product image carousel")',

  addToFavoritesButton: '~Add to favorites',

  removeFromFavoritesButton: '~Remove from favorites',

  increaseQuantityButton: '~Increase quantity',

  decreaseQuantityButton: '~Decrease quantity',

  quantityLabel: 'android=new UiSelector().descriptionContains("Quantity:")',

  totalLabel: 'android=new UiSelector().descriptionContains("Total:")',

  // Confirmation snackbar shown after tapping Add to Cart
  addedToCartSnackbar:
    'android=new UiSelector().descriptionContains("added to cart")',

  viewCartButton: '~VIEW CART',
} as const
