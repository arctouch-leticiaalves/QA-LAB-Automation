export const CHECKOUT_LOCATORS = {
  // content-desc: "Checkout step 1 of 3\n1\nAddress\n2\nPayment\n3\nReview"
  stepIndicator: 'android=new UiSelector().descriptionContains("Checkout step")',

  addressStepIndicator:
    'android=new UiSelector().descriptionContains("Checkout step 1 of 3")',
  paymentStepIndicator:
    'android=new UiSelector().descriptionContains("Checkout step 2 of 3")',
  reviewStepIndicator:
    'android=new UiSelector().descriptionContains("Checkout step 3 of 3")',

  fullNameField:
    '//android.widget.EditText[starts-with(@hint, "Full name input field")]',
  phoneField:
    '//android.widget.EditText[starts-with(@hint, "Phone number input field")]',
  addressField:
    '//android.widget.EditText[starts-with(@hint, "Personal address input field")]',
  cityField:
    '//android.widget.EditText[starts-with(@hint, "Personal city input field")]',
  stateField:
    '//android.widget.EditText[starts-with(@hint, "Personal state input field")]',
  zipCodeField:
    '//android.widget.EditText[starts-with(@hint, "Personal ZIP code input field")]',

  cardNumberField:
    '//android.widget.EditText[starts-with(@hint, "Card number input field")]',
  expiryField:
    '//android.widget.EditText[starts-with(@hint, "Expiry date input field")]',
  cvvField: '//android.widget.EditText[starts-with(@hint, "CVV input field")]',

  nextButton: '~Next',
  placeOrderButton: '~Place Order',

  // content-desc starts with "Order placed successfully\nOrder Placed!..."
  orderConfirmation:
    'android=new UiSelector().descriptionContains("Order placed successfully")',
  // "Your order ORD-2026-004 has been placed successfully."
  confirmedOrderMessage:
    'android=new UiSelector().descriptionContains("Your order ORD-")',
  continueShoppingButton: '~Continue Shopping',

  backButton: '~Back',

  // Inline / snackbar validation and payment failures
  errorMessage: (text: string) =>
    `android=new UiSelector().descriptionContains("${text}")`,
  anyErrorMessage:
    'android=new UiSelector().descriptionStartsWith("Error message")',
  paymentDeclined:
    'android=new UiSelector().descriptionContains("Payment declined")',
} as const
