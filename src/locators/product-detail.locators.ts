export const PRODUCT_DETAIL_LOCATORS = {
  addToCartButton: '~Add to Cart',
  productNameTitle: 'android=new UiSelector().descriptionStartsWith("Product name:")',
  imageCarousel: 'android=new UiSelector().descriptionContains("Product image carousel")',

  // Confirmation snackbar shown after tapping Add to Cart
  addedToCartSnackbar: 'android=new UiSelector().descriptionContains("added to cart")',
} as const
