// Locators for the Login screen. Strategy priority (per appium-selectors
// skill): accessibility-id (~) → resource-id → UiSelector → XPath. XPath
// entries must have a matching row in /LOCATOR_DEBT.md.
//
// Note: emailField and passwordField live in `common.locators.ts` because
// the same Flutter widget is reused across Login, Sign Up, and Forgot
// Password (rule of three).

export const LOGIN_LOCATORS = {
  signInButton: '~Sign In',
  welcomeLabel: '~Welcome',
  errorBanner: 'android=new UiSelector().descriptionStartsWith("Error message")',
} as const
