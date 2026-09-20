export const LOGIN_LOCATORS = {
  signInButton: '~Sign In',

  welcomeLabel: '~Welcome',
  
  errorBanner: 'android=new UiSelector().descriptionStartsWith("Error message")',

  signUpLink: "~Don't have an account? Sign Up",

  forgotPasswordLink:
    'android=new UiSelector().descriptionContains("Forgot password link")',
} as const
