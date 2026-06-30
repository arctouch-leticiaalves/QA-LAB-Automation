// Locators shared across screens. Lift an entry here ONLY when the same
// widget (proven by identical accessibility/hint contract) appears on 3+
// screens — see appium-selectors skill, "Locator hygiene".
//
// XPath entries below must also have a corresponding row in
// /LOCATOR_DEBT.md so the dev team can backfill contentDescription.

export const COMMON_LOCATORS = {
  // Email TextField rendered by the same Flutter widget on Login, Sign Up
  // (and the upcoming Forgot Password screen). starts-with chosen over
  // contains because it is more deterministic and not sensitive to where
  // "Email" appears inside a longer hint string.
  emailField: '//android.widget.EditText[starts-with(@hint, "Email")]',

  // Password TextField. starts-with("Password input field") is mandatory
  // here: on Sign Up the screen also has a Confirm Password field whose
  // hint contains "Password" too — only the stricter prefix isolates the
  // primary Password input on every screen.
  passwordField: '//android.widget.EditText[starts-with(@hint, "Password input field")]',
} as const
