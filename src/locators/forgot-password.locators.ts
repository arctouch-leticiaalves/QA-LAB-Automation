export const FORGOT_PASSWORD_LOCATORS = {
  forgotPasswordTitle:
    'android=new UiSelector().description("Forgot Password").clickable(false)',

  resetPasswordHeading:
    'android=new UiSelector().description("Reset Password")',

  emailField: '//android.widget.EditText[starts-with(@hint, "Email")]',

  sendResetLinkButton: '~Send Reset Link',

  errorBanner: 'android=new UiSelector().descriptionStartsWith("Error message")',

  successConfirmation:
    'android=new UiSelector().descriptionContains("Reset link sent confirmation")',

  successEmailMessage:
    'android=new UiSelector().descriptionContains("We\'ve sent a password reset link to")',

  backToSignInButton:
    'android=new UiSelector().descriptionContains("Back to sign in button")',

  resendEmailButton:
    'android=new UiSelector().descriptionContains("Resend email button")',

  dismissHintButton:
    'android=new UiSelector().descriptionContains("Dismiss hint")',
} as const
