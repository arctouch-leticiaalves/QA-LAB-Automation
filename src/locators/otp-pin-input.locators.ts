export const OTP_PIN_INPUT_LOCATORS = {
  otpPinInputTitle:
    'android=new UiSelector().description("OTP / PIN Input").clickable(false)',

  dismissHintButton:
    'android=new UiSelector().descriptionContains("Dismiss hint")',

  otpDigit: (index: number) =>
    `android=new UiSelector().description("OTP digit ${index}")`,

  verifyCodeButton:
    'android=new UiSelector().descriptionContains("Verify code")',

  clearCodeButton:
    'android=new UiSelector().descriptionContains("Clear code")',

  invalidCodeMessage:
    'android=new UiSelector().descriptionContains("Invalid code")',

  verificationSuccessfulMessage:
    'android=new UiSelector().descriptionContains("Verification successful")',
} as const
