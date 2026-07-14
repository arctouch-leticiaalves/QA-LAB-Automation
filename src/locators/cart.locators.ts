export const CART_LOCATORS = {
  cartHeader: 'android=new UiSelector().description("Cart")',

  emptyCartMessage: 'android=new UiSelector().descriptionContains("Your cart is empty")',
  browseProductsButton: '~Browse Products',

  firstCartItem: 'android=new UiSelector().descriptionContains("Cart item:").instance(0)',

  increaseQuantity: '~Increase quantity',
  decreaseQuantity: '~Decrease quantity',

  orderTotal: 'android=new UiSelector().descriptionContains("Order total:")',

  proceedToCheckoutButton: '~Proceed to Checkout',

  addedToCartSnackbar: 'android=new UiSelector().descriptionContains("added to cart")',
  removedSnackbar: 'android=new UiSelector().descriptionContains("removed")',
  undoButton: '~UNDO',

  cartTab: 'android=new UiSelector().descriptionContains("Tab 2 of 4")',
} as const
