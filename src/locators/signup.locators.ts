export const SIGNUP_LOCATORS = {
  backButton: '~Back',

  fullNameField: '//android.widget.EditText[starts-with(@hint, "Full name")]',

  phoneField: '//android.widget.EditText[starts-with(@hint, "Phone")]',

  confirmPasswordField: '//android.widget.EditText[starts-with(@hint, "Confirm")]',

  showPasswordToggle: '~Show password',

  showConfirmPasswordToggle: '~Show confirm password',

  termsCheckbox: '~Terms and conditions checkbox',

  // "Create Account" appears twice with identical content-desc: as the
  // app-bar title (clickable=false) and as the bottom CTA (clickable=true).
  // clickable() isolates each without falling back to XPath.
  titleLabel: 'android=new UiSelector().description("Create Account").clickable(false)',
  createAccountButton: 'android=new UiSelector().description("Create Account").clickable(true)',

  signInLink: '~Go to sign in',

  // Inline field validation errors (android.view.View with live-region="1" inside each EditText)
  fieldError: '//android.view.View[@live-region="1"]',

  // Server-side error banner rendered directly from the API response.
  // content-desc does NOT use the "Error message: " prefix (unlike the login screen).
  errorBanner: '~An account with this email already exists.',

  // Toast shown after successful account creation: "Account created
  // successfully! Please sign in." descriptionContains ("Account created")
  // is stable if the exact copy changes ("successfully" → "success").
  successToast: 'android=new UiSelector().descriptionContains("Account created")',
} as const
