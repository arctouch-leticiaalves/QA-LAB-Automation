// Locators for the Sign Up screen. See appium-page-object skill for layout
// rules and appium-selectors skill for selection priority. XPath entries
// must have a matching row in /LOCATOR_DEBT.md.
//
// Note: emailField and passwordField live in `common.locators.ts` — they
// are the same Flutter widget used on Login, Sign Up, and Forgot Password.

export const SIGNUP_LOCATORS = {
  backButton: '~Back',

  // Form fields — none of the EditTexts has a content-desc or resource-id,
  // only a `hint`. starts-with (instead of contains) is mandatory here so
  // that "Confirm Password" does not collide with the primary Password
  // field (which lives in common.locators.ts).
  fullNameField: '//android.widget.EditText[starts-with(@hint, "Full name")]',
  phoneField: '//android.widget.EditText[starts-with(@hint, "Phone")]',
  confirmPasswordField: '//android.widget.EditText[starts-with(@hint, "Confirm")]',

  // Visibility toggles
  showPasswordToggle: '~Show password',
  showConfirmPasswordToggle: '~Show confirm password',

  // Terms
  termsCheckbox: '~Terms and conditions checkbox',

  // CTAs
  createAccountButton: '~Create Account',
  signInLink: '~Go to sign in',

  // Validation banner — same pattern as Login. Verify on first run that the
  // same descriptionStartsWith prefix is reused; otherwise update here.
  errorBanner: 'android=new UiSelector().descriptionStartsWith("Error message")',
} as const
