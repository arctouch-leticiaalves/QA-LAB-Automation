import { When, Then } from '@wdio/cucumber-framework'

When(/^the user opens the OTP \/ PIN Input scenario$/, async function () {
  this.otpPinInput = await this.additionalTests.openOtpPinInput()
})

When(/^the user enters the OTP code (.+)$/, async function (code: string) {
  await this.otpPinInput.enterCode(code)
})

When(/^the user verifies the OTP code$/, async function () {
  await this.otpPinInput.verifyCode()
})

When(/^the user clears the OTP code$/, async function () {
  await this.otpPinInput.clearCode()
})

Then(/^the OTP \/ PIN Input screen should be displayed$/, async function () {
  expect(await this.otpPinInput.isLoaded()).toBe(true)
})

Then(/^the OTP digit fields should be displayed$/, async function () {
  expect(await this.otpPinInput.areDigitFieldsDisplayed()).toBe(true)
})

Then(/^the invalid OTP message should be displayed$/, async function () {
  await this.otpPinInput.waitForInvalidCode()
  expect(await this.otpPinInput.isInvalidCodeDisplayed()).toBe(true)
})

Then(/^the invalid OTP message should not be displayed$/, async function () {
  await this.otpPinInput.waitForInvalidCodeHidden()
  expect(await this.otpPinInput.isInvalidCodeDisplayed()).toBe(false)
})

Then(
  /^the OTP verification success message should be displayed$/,
  async function () {
    await this.otpPinInput.waitForVerificationSuccessful()
    expect(await this.otpPinInput.isVerificationSuccessfulDisplayed()).toBe(
      true,
    )
  },
)
