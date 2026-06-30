// Locators for the Login screen. Each entry is a single WDIO selector string.
// Strategy priority (per appium-selectors skill): accessibility-id (~) →
// resource-id → UiSelector → XPath. XPath entries must have a matching row
// in /LOCATOR_DEBT.md.

export const LOGIN_LOCATORS = {
  // XPath used because email/password EditTexts have neither content-desc nor
  // resource-id, only a `hint` attribute. UiSelector cannot match by hint.
  // Tracked in LOCATOR_DEBT.md — dev team to add contentDescription.
  emailField: '//android.widget.EditText[contains(@hint, "Email")]',
  passwordField: '//android.widget.EditText[contains(@hint, "Password")]',

  signInButton: '~Sign In',
  welcomeLabel: '~Welcome',
  errorBanner: 'android=new UiSelector().descriptionStartsWith("Error message")',
} as const
