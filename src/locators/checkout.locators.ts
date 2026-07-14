export const CHECKOUT_LOCATORS = {
  // Step indicator — content-desc: "Checkout step 1 of 3\n1\nAddress\n2\nPayment\n3\nReview"
  stepIndicator: 'android=new UiSelector().descriptionContains("Checkout step")',

  nextButton: '~Next',
  backButton: '~Back',
} as const
